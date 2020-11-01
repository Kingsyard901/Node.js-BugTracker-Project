const mongoose = require("mongoose");

// const ProjectSchema = new mongoose.Schema({
//     companyName: {
//         type: String,
//         required: true
//     },
//     contactName: {
//         type: String,
//         required: false
//     },
//     contactEmail: {
//         type: Date,
//         required: false
//     },
//     projectName: {
//         type: Date,
//         required: false
//     },
//     hourlyRate: {
//         type: String,
//         required: true
//     },
//     billingAdress: {
//         type: String,
//         required: false
//     },
//     customerCreatedDate: {
//         type: String,
//         required: false
//     },
//     customerComment: {
//         type: Date,
//         required: false
//     }
// });


const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;