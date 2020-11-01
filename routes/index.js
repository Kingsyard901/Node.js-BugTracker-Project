const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const bodyParser = require("body-parser");
const User = require("../models/User");
const Ticket = require("../models/Ticket");
const Customer = require("../models/Customer");
const passport = require("../config/passport");

router.use(bodyParser.urlencoded({ extended: true }));

//Welcome Page
router.get("/", (req, res) => res.render("welcome"));

//Dashboard
// router.get("/dashboard", ensureAuthenticated, (req, res) => 
// res.render("dashboard", {
//     name: req.user.name (HENRIK - KOLLA TRAVERSYS video om vad denna raden gjorde...)
// }));

//Dashboard
router.get("/dashboard", ensureAuthenticated, function(req, res) {
        //Authentication on viewing only users tickets
        const loggedInUser = req.user._id;

    //Dashboard Active Tickets box
    Ticket.countDocuments({createdByUser: loggedInUser}, function(err, itemCount) {
        if (!err) {
            nrOfTickets = itemCount;
        };
    });

    //https://www.youtube.com/watch?v=9_lKMTXVk64
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Ticket.find({"createdByUser": loggedInUser, "ticketTitle": regex}, function(err, foundItems) {
            res.render("dashboard", {
                newListItems: foundItems,
            });
        });
    } else {
        Ticket.find({createdByUser: loggedInUser}, function(err, foundItems) {
            res.render("dashboard", {
                newListItems: foundItems,
            });
        });
    }
});


// TICKETS -----------------
//Loading createTicket page
router.get("/createTicket", ensureAuthenticated, (req, res) => {
    
    async function generateListItems() {
        // await User.find({}).sort({ name: 1 }).exec(function(err, userItems) {
        //     res.render("createTicket", {
        //         userListItems: userItems,
        //     });
        // });

        // await Customer.find({}).sort({ projectName: 1 }).exec(function(err, customerItems) {
        //     res.render("createTicket", {
        //         customerListItems: customerItems,
        //     });
        // });

        await Customer.find({}).sort({ projectName: 1 }).exec(function(err, customerItems) {
            if (!err) {
                res.render("createTicket", {
                    customerListItems: customerItems,
                })
                
            };
        });
    } 

    //This functions with async and await removes the problem of the page failing to load customerListItems every first time you enter the createTicket page.
    generateListItems();
});

//Saving ticket to createTicket Post on to DB
router.post("/createTicket", ensureAuthenticated, function(req, res) {

    const createdByUser = req.user._id;
    const ticketTitle = req.body.ticketTitle;
    const ticketSystem = req.body.ticketSystem;
    const ticketDate = req.body.ticketDate;
    const ticketEndDate = req.body.ticketEndDate;
    const ticketMessage = req.body.ticketMessage;

    const assignedDev = req.body.assignedDev;
    const projectOwner = req.body.projectOwner;
    const assignedDate = req.body.assignedDate;
    const ticketCompleted = req.body.ticketCompleted;
    const ticketStatus = req.body.ticketStatus;
    const ticketPriority = req.body.ticketPriority;


    const ticket = new Ticket({
        createdByUser: createdByUser,
        ticketTitle: ticketTitle,
        ticketSystem: ticketSystem,
        ticketDate: ticketDate,
        ticketEndDate: ticketEndDate,
        ticketMessage: ticketMessage,

        assignedDev: assignedDev,
        projectOwner: projectOwner,
        assignedDate: assignedDate,
        ticketCompleted: ticketCompleted,
        ticketStatus: ticketStatus,
        ticketPriority: ticketPriority
    });

    ticket.save();
    res.redirect("/dashboard");
});

//myTicket
// router.get("/myTicket", ensureAuthenticated, (req, res) => 
// res.render("myTicket", {
//     name: req.user.name
// }));

//viewTicket
router.get("/viewTicket", ensureAuthenticated, function(req, res) {
    //Authentication on viewing only users tickets
    const loggedInUser = req.user._id;

    Ticket.find({createdByUser: loggedInUser}, function(err, foundItems) {
        res.render("viewTicket", {
            newListItems: foundItems,
        });
    });
});

//viewTicketStatus
// router.get("/viewTicketStatus", ensureAuthenticated, (req, res) => 
// res.render("viewTicketStatus", {
//     name: req.user.name
// }));

//updateTicket View
router.get("/updateticket/:postId", ensureAuthenticated, (req, res) => {
    const requestedPostId = req.params.postId;
    const loggedInUser = req.user._id;

    Ticket.findOne({ createdByUser: loggedInUser, _id: requestedPostId }, function(err, Ticket) {
        res.render("updateTicket", {
            ticketId: Ticket._id,
            title: Ticket.ticketTitle,
            ticketSystem: Ticket.ticketSystem,
            ticketDate: Ticket.ticketDate,
            ticketEndDate: Ticket.ticketEndDate,
            content: Ticket.ticketMessage,
            assignedDev: Ticket.assignedDev,
            projectOwner: Ticket.projectOwner,
            assignedDate: Ticket.assignedDate,
            ticketCompleted: Ticket.ticketCompleted,
            ticketStatus: Ticket.ticketStatus,
            ticketPriority: Ticket.ticketPriority
        });
    });

    Customer.find({}).sort({ projectName: 1 }).exec(function(err, customerItems) {
        if (!err) {
            customerListItems = customerItems;
        };
    });

    User.find({}).sort({ name: 1 }).exec(function(err, userItems) {
        if (!err) {
            userListItems = userItems;
        };
    });
});

//updateTicket POST Update
router.post("/updateTicket", ensureAuthenticated, (req, res) => {
    let updateTitleId = req.body.updateTicketButton;

    const ticketTitle = req.body.ticketTitle;
    const ticketSystem = req.body.ticketSystem;
    const ticketDate = req.body.ticketDate;
    const ticketEndDate = req.body.ticketEndDate;
    const ticketMessage = req.body.ticketMessage;
    const assignedDev = req.body.assignedDev;
    const projectOwner = req.body.projectOwner;
    const assignedDate = req.body.assignedDate;
    const ticketCompleted = req.body.ticketCompleted;
    const ticketStatus = req.body.ticketStatus;
    const ticketPriority = req.body.ticketPriority;

    Ticket.findByIdAndUpdate({ _id: updateTitleId }, { ticketTitle: ticketTitle, ticketSystem: ticketSystem, ticketDate: ticketDate, ticketEndDate: ticketEndDate, ticketMessage: ticketMessage, assignedDev: assignedDev, projectOwner: projectOwner, assignedDate: assignedDate, ticketCompleted: ticketCompleted, ticketStatus: ticketStatus, ticketPriority: ticketPriority }, function(err, Ticket) {
        console.log("Ticket updated.")
    });
    res.redirect("/ticketPreview/" + updateTitleId);
});

//Ticket Preview when opening from Dashboard
router.get("/ticketPreview/:postId", ensureAuthenticated, function(req, res) {

    const requestedPostId = req.params.postId;
    const loggedInUser = req.user._id;

    Ticket.findOne({ "createdByUser": loggedInUser,_id: requestedPostId }, function(err, Ticket) {
        res.render("ticketPreview", {
            ticketId: Ticket._id,
            title: Ticket.ticketTitle,
            ticketSystem: Ticket.ticketSystem,
            ticketDate: Ticket.ticketDate,
            ticketEndDate: Ticket.ticketEndDate,
            content: Ticket.ticketMessage,
            assignedDev: Ticket.assignedDev,
            projectOwner: Ticket.projectOwner,
            assignedDate: Ticket.assignedDate,
            ticketCompleted: Ticket.ticketCompleted,
            ticketStatus: Ticket.ticketStatus,
            ticketPriority: Ticket.ticketPriority
        });
    });
});


//DELETE TICKET
router.post("/ticketDelete", function(req, res) {
    let checkedItemId = req.body.deleteTicketButton;
    Ticket.findByIdAndRemove(checkedItemId, function(err) {
        if (!err) {
            console.log("Ticket deleted.");
            res.redirect("/dashboard");
        }
    });
});

//PROJECTS -----------------
//createProject
router.get("/createProject", ensureAuthenticated, (req, res) => 
res.render("createProject", {
    name: req.user.name
}));

//viewProject
router.get("/viewProject", ensureAuthenticated, (req, res) => 
res.render("viewProject", {
    name: req.user.name
}));

//viewProjectReport
router.get("/viewProjectReport", ensureAuthenticated, (req, res) => 
res.render("viewProjectReport", {
    name: req.user.name
}));


//CUSTOMERS -----------------
//createCustomer View
// router.get("/createCustomer", function(req, res) {

//     Customer.find({}).sort({ companyName: 1 }).exec(function(err, companyItems) {
//         res.render("createCustomer", {
//             customerListItems: companyItems,
//         });
//     });
// });

router.get("/createCustomer", ensureAuthenticated, (req, res) => 
res.render("createCustomer", {
    name: req.user.name
}));


//createCustomer POST
router.post("/createCustomer", ensureAuthenticated, (req, res) => {
    const companyName = req.body.companyName;
    const contactName = req.body.contactName;
    const contactEmail = req.body.contactEmail;
    const projectName = req.body.projectName;
    const hourlyRate = req.body.hourlyRate;
    const billingAdress = req.body.billingAdress;
    const customerCreatedDate = req.body.customerCreatedDate;
    const customerComment = req.body.customerComment;

    const customer = new Customer({
        companyName: companyName,
        contactName: contactName,
        contactEmail: contactEmail,
        projectName: projectName,
        hourlyRate: hourlyRate,
        billingAdress: billingAdress,
        customerCreatedDate: customerCreatedDate,
        customerComment: customerComment,
    });

    customer.save();
    res.redirect("/viewCustomer");
    console.log("Customer saved to database.");
});

//viewCustomer
// router.get("/viewCustomer", ensureAuthenticated, (req, res) => 
// res.render("viewCustomer", {
//     name: req.user.name
// }));

// router.get("/viewCustomer", ensureAuthenticated, (req, res) => {
        
//     Customer.find({}).sort({ companyName: 1 }).exec(function(err, companyItems) {
//         res.render("viewCustomer", {
//             customerListItems: companyItems,
//         });
//     });
// });

router.get("/viewCustomer", ensureAuthenticated, function(req, res) {

    if (req.query.searchCustomer) {
        const regex = new RegExp(escapeRegex(req.query.searchCustomer), 'gi');
        Customer.find({companyName: regex}, function(err, foundItems) {
            res.render("viewCustomer", {
                customerListItems: foundItems,
            });
        });
    } else {
        Customer.find({}, function(err, foundItems) {
            res.render("viewCustomer", {
                customerListItems: foundItems,
            });
        });
    }
});


//viewCustomerBilling
router.get("/viewCustomerBilling", ensureAuthenticated, (req, res) => 
res.render("viewCustomerBilling", {
    name: req.user.name
}));


//USERS -----------------
//createUser
router.get("/createUser", ensureAuthenticated, (req, res) => 
res.render("createUser", {
    name: req.user.name
}));

//viewUser
// router.get("/viewUser", ensureAuthenticated, (req, res) => 
// res.render("viewUser", {
//     name: req.user.name
// }));

router.get("/viewUser", ensureAuthenticated, function(req, res) {
    User.find({}, function(err, foundItems) {
        res.render("viewUser", {
            newListItems: foundItems,
        });
    });
});

//viewUserActivity
// router.get("/viewUserActivity", ensureAuthenticated, (req, res) => 
// res.render("viewUserActivity", {
//     name: req.user.name
// }));

router.get("/viewUserActivity", ensureAuthenticated, function(req, res) {
    const loggedInUser = req.user._id;
    const loggedInUserName = req.user.name;
    const loggedInUserEmail = req.user.email;

    res.render("viewUserActivity", {
        loggedInUserName,
        loggedInUserEmail
    });
    

});


//Declaration. See link to stack overflow: https://stackoverflow.com/questions/38421664/fuzzy-searching-with-mongodb
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;