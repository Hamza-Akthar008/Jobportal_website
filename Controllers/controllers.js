var con = require("./db");
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const staticpage = path.join(__dirname, "../public", "about.html");
const deleteimg =path.join(__dirname,"../public/databaseimg/")
const nodemailer = require('nodemailer');
let mailTransporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: "talentedpak008@gmail.com", // generated ethereal user
      pass: "vspkmolktosaubkv", // generated ethereal password
    }
});
con.connect();
var found = true;
var jobsearch;

function homedata(req, res) {
    var Query = "SELECT COUNT(*) FROM job";
    con.query(Query, function (err, data) {
        if (err) {
            throw err;

        }
        else {
            let Count = data[0]["COUNT(*)"];
            let page = req.query.page ? req.query.page : 1;
            let jobPerPage = 3;
            let startLimit = (page - 1) * jobPerPage;
            let totalPages = Math.ceil(Count / jobPerPage);

            var selectQuery = `SELECT * from  job LIMIT   ${startLimit},${jobPerPage}`;




            con.query(selectQuery, (err, data) => {
                if (err) throw err;
                else {

                }
                req.flash('message','');
                if (req.session.user_role == "ADMIN") {
                    var selectQuery = `SELECT * from  job LIMIT   ${startLimit},${jobPerPage}`;
                    con.query(selectQuery, (err, data) => {
                        res.render("admin", { data: data ,message:request.flash('message'),page, jobPerPage, startLimit, totalPages});

                      
                    })


                }
                else {
                    res.render("home", { data: data, page, jobPerPage, startLimit, totalPages,message:req.flash('message') });

                }




            })

        }
    })
}



exports.signin = function (req, res) {
    if (req.session.user_role) {
        found = true;
        homedata(req, res);
    }

    else {

        res.render('signin',{message:req.flash('message')});
                   
       

    }
}
exports.home = function (request, response) {

    user_email_address = request.body.user_email_address;

    var user_password = request.body.user_password;

    if (user_email_address && user_password) {
        var query = `
        SELECT * FROM user
        WHERE Email = "${user_email_address}"
        `;

        con.query(query, function (error, data) {


            if (data.length > 0) {
                for (var count = 0; count < data.length; count++) {

                    if (data[count].Password == user_password) {
                        request.flash('message','Login Successfully');
                        request.session.user_id = data[count].ID;

                        request.session.user_role = data[count].role;
                        request.session.user_email = data[count].Email;

                        var register = data[count].register;

                        var query = "SELECT COUNT(*) FROM job";
                        con.query(query, function (err, data) {
                            if (err) {
                                throw err;

                            }
                            else {
                                let Count = data[0]["COUNT(*)"];
                                let page = 1;
                                let jobPerPage = 10;
                                let startLimit = (page - 1) * jobPerPage;
                                let totalPages = Math.ceil(Count / jobPerPage);



                                let selectQuery = `SELECT * from  job LIMIT ${startLimit},${jobPerPage}`;
                                con.query(selectQuery, (err, data) => {
                                    if (err) throw err;
                                    else {

                                    }
                                    if (request.session.user_role == "ADMIN") {
                                        let selectQuery = `SELECT * from  job LIMIT ${startLimit},${jobPerPage}`;
                              
                                        con.query(selectQuery, (err, data) => {

                                            response.render("admin", { data: data ,message:request.flash('message'),page, jobPerPage, startLimit, totalPages});

                                        })
                                    }
                                    else {
                                        if (register == "false") {
                                            var code = generate();
                                            var mailOptions = {
                                                from: "talentedpak008@gmail.com",
                                                to: request.session.user_email,
                                                subject: "Password Verification Pin Code",
                                                text: "The Verfication code  is : "+code 
                                               
                                              }
                                           
                                            request.session.user_code =code;
                                            mailTransporter.sendMail(mailOptions,(err)=>
                                            {
                                                if(err)console.log(err);
                                                else
                                                console.log("Mail Send");
                                            }
                                                );
                             response.redirect("/signin/verify");

                                        }
                                        else {

                                           
                                            response.render("home", { data: data, page, jobPerPage, startLimit, totalPages,message:request.flash('message') })
                                        }



                                    }

                                })

                            }
                        })


                    }
                    else {
                        response.render('signin',{message:'Password is Incorrect !', message_type: 'alert-danger'});
                    }
                }
            }
            else {
                response.render('signin',{message:'Email not Found', message_type: 'alert-danger'});
                     }

        });
    }
    else {
        response.render('signin',{message:'Please Enter Email Address and Password Details', message_type: 'alert-danger'});
                
        

    }

}


exports.about = (req, res) => {
    if (req.session.user_role) {

        res.sendFile(staticpage);
    }
    else {
        res.render('signin')
    }
}

exports.logout = (req, res) => {
  
    req.session.destroy();
    res.redirect("/");
}
exports.search = (req, res) => {

    var Query = "SELECT COUNT(*) FROM job";
    con.query(Query, function (err, data) {
    let Count = data[0]["COUNT(*)"];
    let page = 1;
    let jobPerPage = 10;
    let startLimit = (page - 1) * jobPerPage;
    let totalPages = Math.ceil(Count / jobPerPage);



    let selectQuery = `Select * from job where JOBNAME like "%${req.body.JOBSEARCH}%"`;
    con.query(selectQuery, (err, data) => {
        res.render("search", { data: data })
                                         
    })
    })

   
}
exports.showaddjob = (req, res) => {
    res.render('addjob');
}
exports.addjob = (req, res) => {
    var JOBNAME = req.body.JOBNAME;
    var JOBTPYE = req.body.JOBTYPE;
    var CATEGORY = req.body.CATEGORY;
    var CITY = req.body.CITY;
    var DATE = req.body.DATE;
    var Description = req.body.Description;
   
    var PUBLISHER = "Admin";
   
    var query =`INSERT INTO job( JOBTYPE, JOBNAME, PUBLISHER, CATEGORY, CITY, DATE, Description) VALUES 
    ('${JOBTPYE}','${JOBNAME}','Admin','${CATEGORY}','${CITY}','${DATE}','${Description}')`;
   
    
    con.query(query, (error, result) => {
        if (error) throw error
        else {
req.flash('message','Job Added Succesfully');
            res.redirect("/");        }
    })
}
exports.delete = (req, res) => {
    console.log(req.params.id);
    var query=`Select * from job Where ID = "${req.params.id}"`
    con.query(query,(err,result)=>
    {
fs.unlink(deleteimg+result[0].JOBIMG,(err)=>
{
    if(err) throw err;
    console.log("file delete");
});

    })
    var query = "DELETE FROM job WHERE ID =" + `"` + req.params.id + `"`;
con.query(query, (error, result) => {
    if (error) throw error
    else {

        req.flash('message','Job Deleted Succesfully');
        res.redirect("/");
    }
})
   
}

exports.edit = (req, res) => {
    var query = "Select * FROM job WHERE ID =" + `"` + req.params.id + `"`;
    con.query(query, (error, data) => {
        if (error) throw error
        else {


            res.render("edit", { data: data });
        }
    })
}
exports.editdata = (req, res) => {
    var JOBNAME = req.body.JOBNAME;
    var JOBTPYE = req.body.JOBTYPE;
    var CATEGORY = req.body.CATEGORY;
    var CITY = req.body.CITY;
    var DATE = req.body.DATE;
    var Description = req.body.Description;
    
    var PUBLISHER = "Admin";    
          var query=  ` UPDATE job SET JOBTYPE='${JOBTPYE}',JOBNAME='${JOBNAME}',PUBLISHER='${PUBLISHER}',CATEGORY='${CATEGORY}',CITY='${CITY}',DATE='${DATE}',Description='${Description}' WHERE ID = "${req.params.id}"`
      con.query(query,(err,data)=>
      {
        req.flash('message','Job Edited Succesfully');
        res.redirect('/');
      })
}

exports.blog = (req, res) => {

    var query ="Select * from blog";
    con.query(query,(err,data)=>
    {
        var query ="Select * from comments";
        con.query(query,(err,result)=>
        {
            res.render('blog',{data:data,result:result,title:"blog"});
    
        })
    })
    
    
    }

    exports.rating = (req,res)=>
    {
 var query=  ` UPDATE blog SET rating='${req.body.rating}' where Blog_ID = '${req.params.id}'`
   con.query(query,(err,data)=>
   {
    res.redirect('/blog');
   })
    }
    
exports.addblog = (req, res) => {
res.render('addblog');
}
exports.addblogpost =(req,res,fn)=>
{
    var Post_title = req.body.Post_title;
    var Date = req.body.Date;
    var TAG1 = req.body.TAG1;
    var TAG2 = req.body.TAG2;
    var description = req.body.description;
    var BLOGIMG = fn; 
    var query =`INSERT INTO blog( Post_title, Date, TAG1, TAG2, description, BLOGIMG,rating) VALUES ('${Post_title}','${Date}','${TAG1}','${TAG2}','${description}','${BLOGIMG}','0') `
    con.query(query,(err,data)=>
    {
if(err)throw err;
else
{
    req.flash('message','Blog Posted Succesfully');
    res.redirect("/");
}
    })
}
exports.postcomment=(req,res)=>
{
    console.log(req.session);
    var email;
var query = `select Email from user where ID = "${req.session.user_id}" `
con.query(query,(err,data)=>
{

 var query =`INSERT INTO comments(Blog_ID, Comment, User_email,rating) VALUES ('${req.params.id}','${req.body.Comment}','${data[0].Email}','${req.body.rating}')`;

con.query(query,(err,data)=>
{
   
   res.redirect("/blog");
})
})


 
}
exports.review =(req,res)=>
{
    var query = `INSERT INTO review( Email, review) VALUES ('${req.body.review}','${req.session.user_email}')`;
    con.query(query,(req,res)=>
    {
       
        res.redirect("/blog");
    })
}
exports.verify= (req,res)=>
{
    req.flash('message','');
    console.log(req.session);
    res.render("verification",{message:req.flash('message')});
}
exports.verifycode= (req,res)=>
{
    if(req.body.code == req.session.user_code)
    {
        var query =`UPDATE user SET register='True' WHERE ID = '${req.session.user_id}'`;
        con.query(query,(err,data)=>
        {
            req.flash('message','Login Successfull');
            res.redirect('/');
        })
        
    }
    else
        {
            req.flash('message','Pin Code is Incorrect'); 
            res.render('verification',{message:req.flash('message')});
        }
    
}
exports.register=(req,res)=>
{
    res.render("register");
}
exports.postregister=(req,res)=>
{
    var FNAME=req.body.FNAME;
    var LNAME=req.body.LNAME;
    var EMAIL =req.body.Email;
    var date =req.body.DOB;
    var pwd =req.body.Password;
    var ques =req.body.SecurityQ;
  var q= ` INSERT INTO user( FNAME, LNAME, DOB, Password, Email, register, user_session_id, role, SecurityQues) VALUES  ('${FNAME}','${LNAME}','${date}','${pwd}','${EMAIL}','false','','USER','${ques}')`
   con.query(q,(err,data)=>
   {
res.redirect("/");
   });
};

exports.ManageUser = (req,res)=>
{
    var query ="Select * from user";
    con.query(query,(err,data)=>
    {
        
        res.render("USER",{data:data});
    })
}
exports.security= (req,res)=>
{
 var query =`Select SecurityQues from user where Email = ${req.body.email}`;
 con.query(query,(err,data)=>
 {

     if(req.body.forgetAnswer == data[0].SecurityQues) 
     {
        res.redirect("/resetpasword");
     } 
     else
     {
        res.redirect("/reset");
     }
 })
 
 

}

exports.reset=(req,res)=>
{
    req.session.email=req.body.email;
    var mailOptions = {
        from: "talentedpak008@gmail.com",
        to: req.body.email,
        subject: "Reset Link",
          html: '<p>Click <a href="http://localhost:3000/forgetpwd">here</a> to reset your password</p>'
      }
   
    
    mailTransporter.sendMail(mailOptions);
    res.redirect("/");
}
exports.resetpwd=(req,res)=>
{
    
    
    res.render("reset");
}
exports.pwdreset=(req,res)=>
{
   var query =   ` UPDATE user SET Password='${req.body.password}' WHERE Email = "${req.session.email}"`
 con.query(query,(err,data)=>
 {
    res.redirect("/");
 })
    
   
}
exports.latest =(req,res)=>
{
    var Query = "SELECT COUNT(*) FROM job";
    con.query(Query, function (err, data) {
    let Count = data[0]["COUNT(*)"];
    let page = 1;
    let jobPerPage = 10;
    let startLimit = (page - 1) * jobPerPage;
    let totalPages = Math.ceil(Count / jobPerPage);



    let selectQuery = `SELECT * from  job LIMIT ${startLimit},${jobPerPage} `;
    con.query(selectQuery, (err, data) => {
        res.render("latest", { data: data, page, jobPerPage, startLimit, totalPages,message:req.flash('message') })
                                         
    })
})
     
}
exports.reply=(req,res)=>
{
    var query ="Select * from review";
    con.query(query,(err,data)=>
    {
        res.render("reply",{data:data});
        
    })
}


function generate()
{
    var min = 100000;
var max = 900000;
var num = Math.floor(Math.random() * min) + max;
return num;
}