const db = require("../config/db");

// Customer Report
const customerReport = (req, res) => {

    const sql = `
        SELECT
            customer_code,
            name,
            phone,
            email,
            created_at
        FROM customers
        ORDER BY id DESC
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

// Policy Report
const policyReport = (req, res) => {

    const sql = `
        SELECT
            policy_number,
            policy_name,
            policy_type,
            premium,
            coverage_amount,
            duration_years
        FROM policies
        ORDER BY id DESC
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

// Claims Report
const claimReport = (req, res) => {

    const sql = `
        SELECT
            claim_number,
            claim_amount,
            status,
            claim_date
        FROM claims
        ORDER BY id DESC
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

// Payment Report
const paymentReport = (req, res) => {

    const sql = `
        SELECT
            payment_date,
            amount,
            payment_method,
            payment_status,
            transaction_id
        FROM premium_payments
        ORDER BY id DESC
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
    customerReport,
    policyReport,
    claimReport,
    paymentReport
};