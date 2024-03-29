const controller = require("../controllers/specialService.controller");
const {employeeAuthJwt} = require("../middlewares");


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/specialServices",
        employeeAuthJwt.isAdmin,
        controller.create
    );

    app.get(
        "/api/specialServices/currents",
        controller.findCurrents
    );

    app.delete(
        "/api/specialServices/:id",
        employeeAuthJwt.isAdmin,
        controller.delete
    );

    app.get(
        "/api/specialServices",
        controller.findAll
    );


}
