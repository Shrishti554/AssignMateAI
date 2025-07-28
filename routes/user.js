import express from "express";
import { login, logout, signup, updateUser, getUsers } from "../controllers/user";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/update-user",authenticate, updateUser);
router.get("/get-users",authenticate, getUsers);

 
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)



export default router;