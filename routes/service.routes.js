const controller = require("../controllers/service.controller");
const {authJwt} = require("../middlewares");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/service",
        [authJwt.verifyToken],
        controller.create
    );

    app.get(
        "/api/service/:id",
        [authJwt.verifyToken],
        controller.findById
    );

    app.get(
        "/api/services",
        [authJwt.verifyToken],
        controller.findAll
    );

    app.put(
        "/api/service/:id",
        [authJwt.verifyToken],
        controller.update
    );

    app.delete(
        "/api/service/:id",
        [authJwt.verifyToken],
        controller.delete
    );
};