const db = require("../config/db");
const addCustomer = (req,res)=>{
    const { customer_code, name, dob, gender, email, phone, address } = req.body;
    const sql =`INSERT INTO customers(customer_code,name,dob,gender,email,phone,address)VALUES(?,?,?,?,?,?,?)`;
    db.query(
        sql,[customer_code,name,dob,gender,email,phone,address],
        (err,result)=>{
            if(err){
                return res.status(500).json({message:"Customer not added"})
            }
            else {
                return res.status(200).json({
                    message:"Customer added successfully"
                })
            }
        }

    )
}
const getAllCustomers = (req,res)=>{
    const sql = "SELECT * FROM customers ORDER BY id DESC";
    db.query(sql,(err,result)=>
    {
        if(err){
            return res.status(500).json({
                message:err.message
            });
        }
        res.status(200).json(result);
    })
}
const getCustomerById = (req,res)=>{
    const{id}=req.params;
    db.query ("SELECT * FROM customers WHERE id=?",[id],(err,result)=>{
        if(err){
            return res.status(500).json({ 
                message:err.message
        })
        }
        if(result.length===0){
            return res.status(404).json({
                message:"Customer not found"
            })
        }
        res.status(200).json(result[0]);
    }
    )

}
const updateCustomer = (req, res) => {

    const { id } = req.params;

    const {
        customer_code,
        name,
        dob,
        gender,
        phone,
        email,
        address
    } = req.body;

    const sql = `
        UPDATE customers
        SET customer_code=?, name=?, dob=?, gender=?, phone=?, email=?, address=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            customer_code,
            name,
            dob,
            gender,
            phone,
            email,
            address,
            id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Customer Updated Successfully"
            });

        }
    );

};
const deleteCustomer = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM customers WHERE id=?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Customer Deleted Successfully"
            });

        }
    );

};
module.exports={addCustomer,getAllCustomers,getCustomerById,updateCustomer,deleteCustomer}