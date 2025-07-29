import express from "express";
import { authenticate } from "../middleware/auth.js";
import { createTicket, getTicket, getTickets, assignTicket } from "../controllers/ticket.js";

const router = express.Router();

router.get("/", authenticate, getTickets);
router.get("/:id", authenticate, getTicket);
router.post("/", authenticate, createTicket);
router.post("/:id/assign", authenticate, assignTicket);

export default router;