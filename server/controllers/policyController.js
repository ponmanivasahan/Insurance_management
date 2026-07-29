const db = require("../config/db");

const addPolicy = (req, res) => {

    const {
        policy_number,
        policy_name,
        policy_type,
        premium,
        coverage_amount,
        duration_years,
        description
    } = req.body;

    const sql = `
        INSERT INTO policies
        (policy_number, policy_name, policy_type, premium, coverage_amount, duration_years, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            policy_number,
            policy_name,
            policy_type,
            premium,
            coverage_amount,
            duration_years,
            description
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Policy Added Successfully"
            });
        }
    );
};

module.exports = {
    addPolicy
};