const db = require("../models");
const SpecialService = db.specialService;
const dateUtils = require('../utils/date.utils');

exports.create = (req, res) => {
    const start = new Date(req.body.start);
    const utcStart = dateUtils.toLocale(start);
    const end = new Date(req.body.end);
    const utcEnd = dateUtils.toLocale(end);
    const specialService = new SpecialService({
        services: req.body.services,
        promotion: req.body.promotion,
        start: utcStart,
        end: utcEnd
    });

    specialService.save(specialService).then(data => {
        console.log(specialService);
        req.app.io.emit('specialOfferCreated', { offer: data });
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Erreur lors de la création de l'offre spéciale"
        });
    });
};


exports.findCurrents = (req, res) => {
    const currentDate = new Date();
        SpecialService.find({
            start: { $lte: currentDate },
            end: { $gte: currentDate }
        }).populate('services').exec((err, specialServices) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.send(specialServices);
        });

};

exports.findAll = (req, res) => {
    SpecialService.find().populate('services').exec((err, specialServices) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send(specialServices);
    });
}

exports.findCurrentForService = (req, res) => {
    const currentDate = new Date();
    SpecialService.find({
        services: req.params.id,
        start: { $lte: currentDate },
        end: { $gte: currentDate }
    }).populate('services').exec((err, specialServices) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send(specialServices);
    });
};

exports.delete = (req, res) => {
    SpecialService.findByIdAndRemove(req.params.id)
        .then(specialService => {
            if (!specialService) {
                res.status(404).send({
                    message: `L'offre spéciale avec l'id ${req.params.id} n'a pas été trouvée`
                });
            } else {
                req.app.io.emit('specialOfferDeleted', { offer: specialService });
                res.send({ message: "L'offre spéciale a été supprimée avec succès!" });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de supprimer l'offre spéciale avec l'id " + req.params.id
            });
        });
}
