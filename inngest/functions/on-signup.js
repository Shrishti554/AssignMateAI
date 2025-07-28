import { inngest } from "../client";
import user from "../../models/use.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";


export const onUserSignup = inngest.createFunction(
    { id: "on-user-signup" , retries:2 },
    { event: "user/signup"},
    async ({event , step }) => {
        try{
            const  {email} = event.data
            const user = await step.run("get-user-email", async() =>{
                const userObject =await user.findOne({email})
                if(!userObject){
                    throw new NonRetriableError("User not found")
                }
                return userObject
            })
              
            await step.run("send-welcome-email", async() =>{
                const subject =`welcome to the app`
                const message =`Hi
                \n\n
                Thanks for singing up. we're excited to have you on board.
                `
                await sendMail(email, subject, message)
            })

            return {success:true}
        } catch(error){
            console.log("Error running step ", error.message);
            return {sucess:false}
        }
    }
)