const mongoose = require("mongoose");
const User = require("./User");

const TicketSchema = new mongoose.Schema({
    createdByUser: {
        type: String,
        required: true
    },
    ticketTitle: {
        type: String,
        required: true
    },
    ticketSystem: {
        type: String,
        required: false
    },
    ticketDate: {
        type: Date,
        required: false
    },
    ticketEndDate: {
        type: Date,
        required: false
    },
    ticketMessage: {
        type: String,
        required: true
    },
    assignedDev: {
        type: String,
        required: false
    },
    projectOwner: {
        type: String,
        required: false
    },
    assignedDate: {
        type: Date,
        required: false
    },
    ticketCompleted: {
        type: Date,
        required: false
    },
    ticketStatus: {
        type: String,
        required: false
    },
    ticketPriority: {
        type: String,
        required: false
    }
});


const Ticket = mongoose.model("Ticket", TicketSchema);

module.exports = Ticket;