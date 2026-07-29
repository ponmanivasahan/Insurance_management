const db = require("../config/db");

const getDashboard = (req, res) => {

    const dashboard = {};

    db.query("SELECT COUNT(*) AS totalCustomers FROM customers", (err, customerResult) => {

        if (err) return res.status(500).json(err);

        dashboard.totalCustomers = customerResult[0].totalCustomers;

        db.query("SELECT COUNT(*) AS totalPolicies FROM policies", (err, policyResult) => {

            if (err) return res.status(500).json(err);

            dashboard.totalPolicies = policyResult[0].totalPolicies;

            db.query("SELECT COUNT(*) AS assignedPolicies FROM customer_policies", (err, assignedResult) => {

                if (err) return res.status(500).json(err);

                dashboard.assignedPolicies = assignedResult[0].assignedPolicies;

                db.query(
                    "SELECT COUNT(*) AS activePolicies FROM customer_policies WHERE status='Active'",
                    (err, activeResult) => {

                        if (err) return res.status(500).json(err);

                        dashboard.activePolicies = activeResult[0].activePolicies;

                        db.query(
                            "SELECT IFNULL(SUM(premium),0) AS totalPremium FROM policies",
                            (err, premiumResult) => {

                                if (err) return res.status(500).json(err);

                                dashboard.totalPremium = premiumResult[0].totalPremium;

                                res.json(dashboard);

                            }
                        );

                    }
                );

            });

        });

    });

};

module.exports = {
    getDashboard
};