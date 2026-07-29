const db = require("../config/db");

const createClaim = (req, res) => {

    const {
        customer_policy_id,
        claim_number,
        claim_date,
        claim_amount,
        reason
    } = req.body;

    const sql = `
        INSERT INTO claims
        (customer_policy_id, claim_number, claim_date, claim_amount, reason)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            customer_policy_id,
            claim_number,
            claim_date,
            claim_amount,
            reason
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Claim Submitted Successfully"
            });

        }
    );
};

const getAllClaims = (req, res) => {

    const sql = `
        SELECT
            c.id,
            c.claim_number,
            c.claim_date,
            c.claim_amount,
            c.reason,
            c.status,
            cu.name AS customer_name,
            p.policy_name
        FROM claims c
        JOIN customer_policies cp ON c.customer_policy_id = cp.id
        JOIN customers cu ON cp.customer_id = cu.id
        JOIN policies p ON cp.policy_id = p.id
        ORDER BY c.id DESC
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
    createClaim,
    getAllClaims
};