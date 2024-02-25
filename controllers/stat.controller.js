const db = require("../models");
const dateUtils = require("../utils/date.utils");
const TaskPayment = db.taskPayment;
const DepensePayment = db.depensePayment;
const TypeDepensePayment = db.typeDepensePayment;

exports.getTurnOverPerDay = (req, res) => {
    const employeeId = req.params.id;
    const start = req.query.start;
    const utcStart = dateUtils.toLocale(new Date(start));
    const utcStartPlusOne = dateUtils.toLocale(new Date(start));
    console.log(start);
    utcStartPlusOne.setDate(utcStartPlusOne.getDate() + 1);
    const date = new Date();

    TaskPayment.find({
        date: {
            $gte: utcStart,
            $lt: utcStartPlusOne
        }
    }).exec((err, payments) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: err });
            return;
        }
        let turnOver = 0;
        payments.forEach(payment => {
            turnOver += payment.amount;
        });
        res.status(200).send({ data: turnOver });
    });

}
exports.getTurnOverPerMonth = (req, res) => {
    const year = req.query.year;

    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const monthPayments = {};

    TaskPayment.find({
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).exec((err, payments) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: err });
            return;
        }

        payments.forEach(payment => {
            const monthIndex = payment.date.getMonth();
            const monthName = months[monthIndex];
            if (!monthPayments[monthName]) {
                monthPayments[monthName] = payment.amount;
            } else {
                monthPayments[monthName] += payment.amount;
            }
        });

        const result = months.map(month => ({
            month,
            amount: monthPayments[month] || 0
        }));

        res.status(200).send({ data: result });
    });
}


exports.getMonthlyBenefits = (req, res) => {
    const year = req.query.year;

    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const monthPayments = {};
    const monthExpensePayments = {};
    const monthTypeExpensePayments = {};

    TaskPayment.find({
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).exec((err, payments) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: err });
            return;
        }

        payments.forEach(payment => {
            const monthIndex = payment.date.getMonth();
            const monthName = months[monthIndex];
            if (!monthPayments[monthName]) {
                monthPayments[monthName] = payment.amount;
            } else {
                monthPayments[monthName] += payment.amount;
            }
        });

        DepensePayment.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).exec((err, expensePayments) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
                return;
            }

            expensePayments.forEach(expensePayment => {
                const monthIndex = expensePayment.date.getMonth();
                const monthName = months[monthIndex];
                if (!monthExpensePayments[monthName]) {
                    monthExpensePayments[monthName] = expensePayment.value;
                } else {
                    monthExpensePayments[monthName] += expensePayment.value;
                }
            });

            TypeDepensePayment.find({
                month: { $gte: startDate.getMonth() + 1, $lte: endDate.getMonth() + 1 },
                year: year
            }).exec((err, typeExpensePayments) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ message: err });
                    return;
                }

                typeExpensePayments.forEach(typeExpensePayment => {
                    const monthName = months[typeExpensePayment.month - 1];
                    if (!monthTypeExpensePayments[monthName]) {
                        monthTypeExpensePayments[monthName] = typeExpensePayment.value;
                    } else {
                        monthTypeExpensePayments[monthName] += typeExpensePayment.value;
                    }
                });

                const result = months.map(month => ({
                    month,
                    benefits: (monthPayments[month] || 0) - ((monthExpensePayments[month] || 0) + (monthTypeExpensePayments[month] || 0))
                }));

                res.status(200).send({ data: result });
            });
        });
    });
}



