const { model } = require("../models/User");

//Add this to any page/resource that you want protected!
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "please log in to view this resource");
        res.redirect("/users/login");
    }
}