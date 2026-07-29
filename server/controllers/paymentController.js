const db = require("../config/db");

// Add Payment
const addPayment = (req, res) => {

    const {
        customer_policy_id,
        payment_date,
        amount,
        payment_method,
        payment_status,
        transaction_id
    } = req.body;

    const sql = `
        INSERT INTO premium_payments
        (customer_policy_id, payment_date, amount, payment_method, payment_status, transaction_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            customer_policy_id,
            payment_date,
            amount,
            payment_method,
            payment_status,
            transaction_id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Payment Added Successfully"
            });
        }
    );
};

// Get All Payments
const getPayments = (req, res) => {

    const sql = `
    SELECT
        pp.id,
        c.name AS customer_name,
        p.policy_name,
        pp.payment_date,
        pp.amount,
        pp.payment_method,
        pp.payment_status,
        pp.transaction_id
    FROM premium_payments pp
    JOIN customer_policies cp
        ON pp.customer_policy_id = cp.id
    JOIN customers c
        ON cp.customer_id = c.id
    JOIN policies p
        ON cp.policy_id = p.id
    ORDER BY pp.id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.json(result);

    });

};

module.exports = {
    addPayment,
    getPayments
};