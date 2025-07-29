import {inngest} from "../inngest/client.js";
import Ticket from "../models/ticket.js";
import User from "../models/user.js";

export const createTicket = async (req, res) => {
    try {
        const {title, description}= req.body
        if(!title || !description){
            return res.status(400).json({error:"Title and description are required"});
        }
        const newTicket = await Ticket.create({
            title,
             description,
              createdBy: req.user._id.toString(),
            })
            try {
                await inngest.send({
                    name:"ticket/created",
                    data: {
                        ticketId: newTicket._id.toString(),
                        title,
                        description,
                        createdBy:req.user._id.toString()
                    },
                })
            } catch (inngestError) {
                console.log("Inngest error (non-critical):", inngestError.message);
            }
            return res.status(201).json({
                message:"Ticket created successfully",
                ticket:newTicket,
            })
    } catch (error) {
        console.error("Ticket creation error:", error.message);
        return res.status(500).json({error:"Failed to create ticket"});
    }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];
    if (user.role !== "user") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt")
        .sort({ createdAt: -1 });
    }
    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id).populate("assignedTo", [
        "email",
        "_id",
      ]);
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id,
      }).select("title description status createdAt");
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Manual assignment function for testing
export const assignTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const user = req.user;

    // Only admins can manually assign tickets
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can assign tickets" });
    }

    // Get the ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Simple assignment logic - find a moderator with matching skills
    const ticketSkills = ["Python", "JavaScript", "AI", "Machine Learning", "Web Development"];

    let assignedUser = await User.findOne({
      role: "moderator",
      skills: {
        $elemMatch: {
          $regex: ticketSkills.join("|"),
          $options: "i",
        }
      }
    });

    if (!assignedUser) {
      // Fallback to any admin
      assignedUser = await User.findOne({ role: "admin" });
    }

    // Update ticket with assignment
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        assignedTo: assignedUser?._id || null,
        status: "IN_PROGRESS",
        priority: "medium",
        relatedSkills: ticketSkills.slice(0, 2) // Add some related skills
      },
      { new: true }
    ).populate("assignedTo", ["email", "_id"]);

    return res.status(200).json({
      message: "Ticket assigned successfully",
      ticket: updatedTicket,
      assignedTo: assignedUser?.email || "No one available"
    });

  } catch (error) {
    console.error("Error assigning ticket:", error.message);
    return res.status(500).json({ error: "Failed to assign ticket" });
  }
};