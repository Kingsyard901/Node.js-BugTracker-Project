const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: false
    },
    contactEmail: {
        type: String,
        required: false
    },
    projectName: {
        type: String,
        required: false
    },
    hourlyRate: {
        type: String,
        required: true
    },
    billingAdress: {
        type: String,
        required: false
    },
    customerCreatedDate: {
        type: Date,
        required: false
    },
    customerComment: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});


const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;