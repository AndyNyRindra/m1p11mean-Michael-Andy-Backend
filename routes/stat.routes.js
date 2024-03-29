const controller = require("../controllers/stat.controller");
const {employeeAuthJwt} = require("../middlewares");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/stat/turnover/day",
        employeeAuthJwt.isAdmin,
        controller.getTurnOverPerDay
    );
    app.get(
        "/api/stat/turnover/month",
        employeeAuthJwt.isAdmin,
        controller.getTurnOverPerMonth
    );

    app.get(
        "/api/stat/benefits/month",
        employeeAuthJwt.isAdmin,
        controller.getMonthlyBenefits
    );

    app.get(
        "/api/stat/expense/month",
        employeeAuthJwt.isAdmin,
        controller.getExpensesPerMonth
    );

    app.get(
        "/api/stat/task/day",
        employeeAuthJwt.isAdmin,
        controller.getNbTaskPerDay
    );

    app.get(
        "/api/stat/task/month",
        employeeAuthJwt.isAdmin,
        controller.getNbTaskPerMonth
    );

    app.get(
        "/api/stat/employee/nbhour",
        employeeAuthJwt.isAdmin,
        controller.getEmployeeHourOfWork
    );
}
