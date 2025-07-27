import express from "express";
import mongoose from "mongoose";
import cros from "cros";

const PORT = process.env.PORT || 3000;
const app = express();


app.use(cros())
app.use(express.json())

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