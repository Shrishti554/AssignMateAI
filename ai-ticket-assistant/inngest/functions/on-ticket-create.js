import { inngest } from "../client";
import Ticket from "../../models/ticket.js";
import user from "../../models/use.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/agent.js";


export const onTicketCreate = inngest.createFunction(
    { id: "on-ticket-created" , retries:2 },
    { event: "ticket/created"},
    async ({event , step }) => {
        try {
            const {ticketId} = event.data
           //fetch ticket fromDB 
          const ticket = await step.run("fetch-ticket", async() =>{
              const ticketObject = await Ticket.findById(ticketId)
            if(!ticket){
                throw new NonRetriableError("Ticket not found")
            }
            return ticketObject;
           })

           await step.run("update-ticket-status", async() =>{
            await Ticket.findByIdAndUpdate(ticketId._id, {
                status:"TODO",
            })
           })

           const aiResponse = await analyzeTicket(ticket)

           const relatedSkills =await step.run("ai-processing", async () =>{
               let skills =[]
               if(aiResponse){
                await Ticket.findByIdAndUpdate(ticket._id, {
                    priority: !["low", "medium", "high"].includes(aiResponse.priority) ? "medium" : aiResponse.priority,
                    helpfulNotes: aiResponse.helpfulNotes,
                    relatedSkills: aiResponse.relatedSkills,
                    status:"IN_PROGRESS"
                })
                skills = aiResponse.relatedSkills
               }
               return skills
           })
          


           const moderator = await step.run("assign-moderator", async() =>{
            let user =await User.findOne({
                role:"moderator",
                skills:{
                    $elemMatch: {
                        $regex:relatedSkills.join("|"),
                        $options:"i",
                    }
                }
            })
            if (!user) {
                user=await User.findOne({
                    role:"admin",
                })
            }
            await Ticket.findByIdAndUpdate(ticket._id,{
                assignedTo: user?._id || null
            })
            return user
           });

           await step.run("send-email-notification", async() =>{
            if(moderator){
                const finalTicket = await Ticket.findById(ticket._id)
                await sendMail(
                    moderator.email, 
                    "Ticket assigned", 
                    `You have a new ticket assigned to you.${finalTicket.title} Please check it out.`)
            }
           })

            return {sucess:true}
        } catch (err) {
            console.error("Error running the step", err.message)
            return {sucess:false}
        }
    }
)