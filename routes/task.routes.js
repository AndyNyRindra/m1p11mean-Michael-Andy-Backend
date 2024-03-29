const controller = require("../controllers/task.controller");
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
        "/api/tasks",
        employeeAuthJwt.findLoggedEmployee,
        controller.create
    );

    app.get(
        "/api/tasks/employee",
        employeeAuthJwt.findLoggedEmployee,
        controller.findTaskPerEmployee
    );

    app.get(
        "/api/tasks/:id",
        controller.findByID
    );

    app.put(
        "/api/tasks/:id/status",
        controller.updateStatus
    );

    app.put(
        "/api/tasks/:id/payment",
        controller.pay
    );

    app.post(
        "/api/tasks/appointment",
        controller.makeAppointment
    );

    app.post(
        "/api/tasks/appointment/confirm",
        controller.createAppointment
    );

    app.get(
        "/api/tasks/commission/:id",
        employeeAuthJwt.findLoggedEmployee,
        controller.getDailyCommission
    );

    app.get(
        "/api/tasks/get/user",
        controller.getTaskForUser
    );

}
