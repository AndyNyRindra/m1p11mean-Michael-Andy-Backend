const db= require ('../models');
const dateUtils = require('../utils/date.utils');

const EmployeeCheckIn = db.employeeCheckIn;
const Employee = db.employee;

exports.checkIn = (req, res) => {
    const employeeId = req.params.id;
    const date = new Date();
    const utcDate = dateUtils.toLocale(date);
    const checkIn = new EmployeeCheckIn({
        employee: employeeId,
        in: utcDate
    });

    checkIn.save((err, checkIn) => {
        Employee.findByIdAndUpdate(
            employeeId,
            {
                $set: { lastCheckIn: utcDate }
            },
            { new: true },
            (err, employee) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
            }
        );
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).send(checkIn);
    });
}

exports.checkOut = (req, res) => {
    const employeeId = req.params.id;
    const date = new Date();
    const utcDate = dateUtils.toLocale(date);
    let start = new Date();
    start.setHours(0,0,0,0);
    let end = new Date();
    end.setHours(23,59,59,999);
    start = dateUtils.toLocale(start);
    end = dateUtils.toLocale(end);
    EmployeeCheckIn.findOne({ employee: employeeId,
    in: { $gte: start, $lte: end }
    }).exec((err, checkIn) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!checkIn) {
            res.status(404).send({ message: "L'employé n'est pas encore enregistré" });
            return;
        }
        checkIn.out = utcDate;
        checkIn.save((err, checkIn) => {
            Employee.findByIdAndUpdate(
                employeeId,
                {
                    $set: { lastCheckOut: utcDate }
                },
                { new: true },
                (err, employee) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                }
            );
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.status(200).send(checkIn);
        });
    });
}