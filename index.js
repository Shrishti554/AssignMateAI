import express from "express";
import mongoose from "mongoose";
import cros from "cros";
import userRoutes from "./routes/user.js";
import {serve} from "inngest/express";
import ticketRoutes from "./routes/ticket.js";
import {inngest} from "./inngest/client.js";
import {onTicketCreate} from "./inngest/functions/on-ticket-create.js";
import {onUserSignup} from "./inngest/functions/on-signup.js";

const PORT = process.env.PORT || 3000;
const app = express();


app.use(cros())
app.use(express.json())

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use("/api/inngest", serve({
    client:inngest,
    functions: [onTicketCreate, onUserSignup],
}));

mongoose
     .connect(process.env.MONGODB_URI)
     .then(() =>{
         console.log("Connected to MongoDB");
         app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        })
     .catch((err) => console.error(err));


export default app;