import express from "express";
import mongoose from "mongoose";
import cros from "cros";
import userRoutes from "./routes/user.js";

const PORT = process.env.PORT || 3000;
const app = express();


app.use(cros())
app.use(express.json())

app.use("/api/auth", userRoutes);

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