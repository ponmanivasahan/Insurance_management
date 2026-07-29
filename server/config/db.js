const mysql = require("mysql2");
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"insurance_management"
});
db.connect((err)=>{
if(err){
    console.log("Database Connection Error:",err);
} else{
    console.log("Database Connected Successfully");
}
});
module.exports = db;