const express = require('express');
const routes = express.Router();
const path = require('path');
var mysql = require('mysql');
const multer = require('multer');
const e = require('connect-flash');
const { json } = require('body-parser');
const nodemailer = require("nodemailer");
var fn = "";
var session;
const noofidperpage = 3;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/databaseimg");
    },
    filename: (req, file, cb) => {
        fn = Date.now() + path.extname(file.originalname);
        cb(null, fn);
    }
})
const upload = multer({ storage: storage });
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'job_site'
})

con.connect((err) => {
    if (err) throw err;
    else {
        console.log('Connected');

    }

})
var code;
var user_email_address;
const staticpage = path.join(__dirname, "../public", "about.html");
routes.get("/",(req,res)=>
{

res.render("signin");
})

let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: "talentedpak008@gmail.com", // generated ethereal user
      pass: "vspkmolktosaubkv", // generated ethereal password
    },
  });
  function homedata(req,res)
  {
    var query = "SELECT COUNT(*) FROM job";
    con.query(query, function (err, data) {
        if (err) {
            throw err;

        }
        else {
            let Count = data[0]["COUNT(*)"];
            let page = req.query.page ? req.query.page : 1;
            let jobPerPage = 3;
            let startLimit = (page - 1) * jobPerPage;
            let totalPages = Math.ceil(Count / jobPerPage);



            let selectQuery = `SELECT * from  job LIMIT ${startLimit},${jobPerPage}`;
            con.query(selectQuery, (err, data) => {
                if (err) throw err;
                else {

                }
            //    res.send('home', {
                //        data: data, Count, page, totalPages, jobPerPage
                //    });
                res.render("home",{data:data,page,jobPerPage,startLimit,totalPages});
                
                
                
                
            })
            
        }
    })
  }

routes.post('/home', function(request, response, next){

user_email_address = request.body.user_email_address;

    var user_password = request.body.user_password;

    if(user_email_address && user_password)
    {
       var  query = `
        SELECT * FROM user
        WHERE Email = "${user_email_address}"
        `;

        con.query(query, function(error, data){

          
            if(data.length > 0)
            {
                for(var count = 0; count < data.length; count++)
                {
                    
                    if(data[count].Password == user_password)
                    {
                      var register= data[count].register;
                       
                        var query = "SELECT COUNT(*) FROM job";
    con.query(query, function (err, data) {
        if (err) {
            throw err;

        }
        else {
            let Count = data[0]["COUNT(*)"];
            let page = 1;
            let jobPerPage = 3;
            let startLimit = (page - 1) * jobPerPage;
            let totalPages = Math.ceil(Count / jobPerPage);



            let selectQuery = `SELECT * from  job LIMIT ${startLimit},${jobPerPage}`;
            con.query(selectQuery, (err, data) => {
                if (err) throw err;
                else {

                }
                if(user_email_address=="admin")
                {

                 response.render("admin",{data:data,page,jobPerPage,startLimit,totalPages});
                }
                else{
                    if(register=="false")
                    {
                         code=generateCode()
                        var mailOptions = {
                            from: "talentedpak008@gmail.com",
                            to: user_email_address,
                            subject: "Welcome To Talented Pak",
                            text: "Confirmation code is "+code,
                          };
                          transporter.sendMail(mailOptions
                          );
                          response.render("pinverificaton");
                    }
                    else{
                        
                        response.render("home", {data:data,page,jobPerPage,startLimit,totalPages})
                    }
                    
                       

                }
                
            })

        }
    })


}
                    else
                    {
                        response.send('Incorrect Password');
                    }
                }
            }
            else
            {
                response.send('Incorrect Email Address');
            }
           
        });
    }
    else
    {
        response.send('Please Enter Email Address and Password Details');
       
    }

});
routes.post("/",(req,res)=>{
   
    res.render("signin");
})


routes.post("/pinverify",(req,res)=>
{
    if(code==req.body.name)
    {
        
        console.log(code +"  "+req.body.name);
        var query=`UPDATE user SET register = 'True'  WHERE Email= '${user_email_address}'`;
       // res.send(query);
        con.query(query,(err,data)=>
        {
            if(err)
            {
                throw err;
            }
            else
            homedata(req,res);
        });

    }
})
routes.get("/newuser",(req,res)=>{
    res.render("newuser");
})
routes.post("/newuser",(req,res)=>
{
    var email=req.body.email;
    var password =req.body.password;
    var query=`INSERT INTO user (Password, Email,register) VALUES ('${password}','${email}','false')`;
    con.query(query,(err,data)=>
    {

        res.render("signin");
    })
})
routes.get("/password",(req,res)=>
{
    var mailOptions = {
        from: "talentedpak008@gmail.com",
        to: "f200319@cfd.nu.edu.pk",
        subject: "Forget Password",
        text: "Link  is : " ,
        html:  '<p>Click <a href="http://localhost:3000/reset">here</a> to reset your password</p>'
      };
      transporter.sendMail(mailOptions
      );
   res.send("Reset Link Sent");
   
})
routes.get("/reset",(req,res)=>
{
    res.render("forgetpassword");
   
    
})
routes.post("/reset",(req,res)=>
{
    var query=`UPDATE user SET password = '${req.body.password}'  WHERE Email= 'f200319@cfd.nu.edu.pk'`;
    con.query(query,(err,data)=>
    {
res.render("signin");
    })
})
routes.get("/forgetpassword",(req,res)=>
{
    res.render("forgetpassword");
})
routes.get('/home', (req, res) => {

    if(code ==req.body.name)
    {
        
      homedata(req,res);

}
else{
    res.render("pinverificaton");
}
})
routes.get("/Registration", (req, res, next) => {

    res.render('addjob');
})
routes.post('/Registration', upload.single("JOBIMG"), (req, res, next) => {
    var JOBNAME = req.body.JOBNAME;
    var JOBTPYE = req.body.JOBTYPE;
    var CATEGORY = req.body.CATEGORY;
    var CITY = req.body.CITY;
    var COUNTRY = req.body.COUNTRY;
    var MIN_SAL = req.body.MIN_SAL;
    var MAX_SAL = req.body.MAX_SAL;
    var PUBLISHER = "Admin";
    var JOBIMG = fn;
    var query = "INSERT INTO `job`( `JOBIMG`, `JOBTYPE`, `JOBNAME`, `PUBLISHER`, `CATEGORY`, `CITY`, `COUNTRY`, `MIN_SAL`, `MAX_SAL`) VALUES ('" + JOBIMG + "','" + JOBTPYE + "','" + JOBNAME + "','" + PUBLISHER + "','" + CATEGORY + "','" + CITY + "','" + COUNTRY + "','" + MIN_SAL + "','" + MAX_SAL + "')";

    con.query(query, (error, result) => {
        if (error) throw error
        else {

            res.redirect("/Registration");


        }
    })
})
routes.get("/about", (req, res) => {
    res.sendFile(staticpage);
})
routes.get("/admin", (req, res) => {
    var query = "SELECT * FROM JOB";
    con.query(query, (err, data) => {
        if (err) throw err;
        else
            res.render("admin", { data: data });

    })
    routes.get('/admin/:id', (req, res) => {


        var id = req.query.id;
        var query = `Delete from job where id = ${id}`;
        con.query(query, (err, data) => {
            if (err) {
                throw err;
            }
            else {
                res.render("admin");
            }
        })
    })

})

routes.get("/search", function (req, res) {
    var query = "SELECT COUNT(*) FROM job";
    con.query(query, function (err, data) {
        if (err) {
            throw err;

        }
        else {
            let Count = data[0]["COUNT(*)"];
            let page = req.query.page ? req.query.page : 1;
            let jobPerPage = 3;
            let startLimit = (page - 1) * jobPerPage;
            let totalPages = Math.ceil(Count / jobPerPage);
            var searchf = req.query.JOBSEARCH;


            let selectQuery = `SELECT * from  job where JOBNAME like "${searchf}" LIMIT ${startLimit},${jobPerPage} `;
            con.query(selectQuery, (err, data) => {
                if (err) throw err;
                else {

                }
                console.log(data);
                res.render('search', {
                    data: data, Count, page, totalPages, jobPerPage
                });
            })

        }
    })

})
function generateCode() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  }
  
module.exports = routes; 
