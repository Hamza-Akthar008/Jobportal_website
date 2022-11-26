const express = require('express');
const routes = express.Router();
const path = require('path');
var mysql = require('mysql');
const multer = require('multer');
const e = require('connect-flash');
const { json } = require('body-parser');

const controller =require("../Controllers/controllers.js");
var session;
const noofidperpage = 3;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/databaseimg");
    },
    filename: (req, file, cb) => {
    
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage });
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'job_site'
})


var code;
var user_email_address;

routes.get("/",(req,res)=>controller.signin(req,res));
routes.post('/', function(request, response, next){
    controller.home(request,response);
    });
routes.get('/about',(req,res)=>controller.about(req,res));
routes.post('/signout',(req,res)=>controller.logout(req,res));
routes.post('/search',(req,res)=>controller.search(req,res));




// routes.post("/pinverify",(req,res)=>
// {
//     if(code==req.body.name)
//     {
        
//         console.log(code +"  "+req.body.name);
//         var query=`UPDATE user SET register = 'True'  WHERE Email= '${user_email_address}'`;
//        // res.send(query);
//         con.query(query,(err,data)=>
//         {
//             if(err)
//             {
//                 throw err;
//             }
//             else
//             homedata(req,res);
//         });

//     }
// })
// routes.get("/newuser",(req,res)=>{
//     res.render("newuser");
// })
// routes.post("/newuser",(req,res)=>
// {
//     var email=req.body.email;
//     var password =req.body.password;
//     var query=`INSERT INTO user (Password, Email,register) VALUES ('${password}','${email}','false')`;
//     con.query(query,(err,data)=>
//     {

//         res.render("signin");
//     })
// })
// routes.get("/password",(req,res)=>
// {
    
//    res.send("Reset Link Sent");
   
// })
// routes.get("/reset",(req,res)=>
// {
//     res.render("forgetpassword");
   
    
// })
// routes.post("/reset",(req,res)=>
// {
//     var query=`UPDATE user SET password = '${req.body.password}'  WHERE Email= 'f200319@cfd.nu.edu.pk'`;
//     con.query(query,(err,data)=>
//     {
// res.render("signin");
//     })
// })
// routes.get("/forgetpassword",(req,res)=>
// {
//     res.render("forgetpassword");
// })
// routes.get('/home', (req, res) => {

//     if(code ==req.body.name)
//     {
        
//       homedata(req,res);

// }
// else{
//     res.render("pinverificaton");
// }
// })
// routes.get("/Registration", (req, res, next) => {

//     res.render('addjob');
// })
// routes.post('/Registration', upload.single("JOBIMG"), controller.register
// )

// routes.get("/admin", (req, res) => {
//     var query = "SELECT * FROM JOB";
//     con.query(query, (err, data) => {
//         if (err) throw err;
//         else
//             res.render("admin", { data: data });

//     })
//     routes.get('/admin/:id', (req, res) => {


//         var id = req.query.id;
//         var query = `Delete from job where id = ${id}`;
//         con.query(query, (err, data) => {
//             if (err) {
//                 throw err;
//             }
//             else {
//                 res.render("admin");
//             }
//         })
//     })

// })


  
module.exports = routes; 
