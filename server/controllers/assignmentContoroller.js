const db = require("../config/db");

const getAssignedPolicies = (req, res) => {

    const sql = `
        SELECT
            cp.id,
            c.customer_code,
            c.name AS customer_name,
            p.policy_number,
            p.policy_name,
            p.policy_type,
            p.premium,
            cp.start_date,
            cp.end_date,
            cp.status
        FROM customer_policies cp
        INNER JOIN customers c
            ON cp.customer_id = c.id
        INNER JOIN policies p
            ON cp.policy_id = p.id
        ORDER BY cp.id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json(result);

    });

};

module.exports = {
    assignPolicy,
    getAssignedPolicies
};