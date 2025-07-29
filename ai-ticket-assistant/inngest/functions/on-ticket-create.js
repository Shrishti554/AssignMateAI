import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/agent.js";


export const onTicketCreate = inngest.createFunction(
    { id: "on-ticket-created" , retries:2 },
    { event: "ticket/created"},
    async ({event , step }) => {
        console.log("🎫 Ticket creation background job started for:", event.data.ticketId);
        try {
            const {ticketId} = event.data
           //fetch ticket fromDB 
          const ticket = await step.run("fetch-ticket", async() =>{
              const ticketObject = await Ticket.findById(ticketId)
            if(!ticketObject){
                throw new NonRetriableError("Ticket not found")
            }
            return ticketObject;
           })

           await step.run("update-ticket-status", async() =>{
            await Ticket.findByIdAndUpdate(ticketId, {
                status:"TODO",
            })
           })

           const aiResponse = await analyzeTicket(ticket)

           const relatedSkills =await step.run("ai-processing", async () =>{
               let skills =[]
               if(aiResponse){
                await Ticket.findByIdAndUpdate(ticketId, {
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
            console.log("🔍 Looking for moderator with skills:", relatedSkills);
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
                console.log("❌ No moderator found, assigning to admin");
                user=await User.findOne({
                    role:"admin",
                })
            } else {
                console.log("✅ Found moderator:", user.email);
            }
            await Ticket.findByIdAndUpdate(ticketId,{
                assignedTo: user?._id || null
            })
            return user
           });

           await step.run("send-email-notification", async() =>{
            if(moderator){
                const finalTicket = await Ticket.findById(ticketId)
                await sendMail(
                    moderator.email, 
                    "Ticket assigned", 
                    `You have a new ticket assigned to you.${finalTicket.title} Please check it out.`)
            }
           })

            return {success:true}
        } catch (err) {
            console.error("Error running the step", err.message)
            return {success:false}
        }
    }
)