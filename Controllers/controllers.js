var con = require("./db");
const path = require('path');
const multer = require('multer');
const staticpage = path.join(__dirname, "../public", "about.html");
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
                if (req.session.user_role == "ADMIN") {
                    var selectQuery = `SELECT * from  job `;
                    con.query(selectQuery, (err, data) => {

                        res.render("admin", { data: data });

                    })


                }
                else {
                    res.render("home", { data: data, page, jobPerPage, startLimit, totalPages });

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
        res.render('signin');

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
                        request.session.user_id = data[count].ID;

                        request.session.user_role = data[count].role;

                        var register = data[count].register;

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
                                    if (request.session.user_role == "ADMIN") {
                                        var selectQuery = `SELECT * from  job `;
                                        con.query(selectQuery, (err, data) => {

                                            response.render("admin", { data: data });

                                        })
                                    }
                                    else {
                                        if (register == "false") {

                                        }
                                        else {

                                            response.render("home", { data: data, page, jobPerPage, startLimit, totalPages })
                                        }



                                    }

                                })

                            }
                        })


                    }
                    else {
                        response.send('Incorrect Password');
                    }
                }
            }
            else {
                response.send('Incorrect Email Address');
            }

        });
    }
    else {
        response.send('Please Enter Email Address and Password Details');

    }

}


exports.about = (req, res) => {
    if (req.session.user_role) {

        res.sendFile(staticpage);
    }
    else {
        res.render('signin');
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
}
exports.search = (req, res) => {

    res.redirect('/');
}
exports.showaddjob = (req, res) => {
    res.render('addjob');
}
exports.addjob = (req, res, fn) => {
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

            res.redirect("/");


        }
    })
}
exports.delete = (req, res) => {
    console.log(req.params.id);
    var query = "DELETE FROM job WHERE ID =" + `"` + req.params.id + `"`;
    con.query(query, (error, result) => {
        if (error) throw error
        else {
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
    var COUNTRY = req.body.COUNTRY;
    var MIN_SAL = req.body.MIN_SAL;
    var MAX_SAL = req.body.MAX_SAL;
    var PUBLISHER = "Admin";    
          var query=  ` UPDATE job SET JOBTYPE='${JOBTPYE}',JOBNAME='${JOBNAME}',PUBLISHER='${PUBLISHER}',CATEGORY='${CATEGORY}',CITY='${CITY}',COUNTRY='${COUNTRY}',MIN_SAL='${MIN_SAL}',MAX_SAL='${MAX_SAL}' WHERE ID = "${req.params.id}"`
      con.query(query,(err,data)=>
      {
        res.redirect('/');
      })
}
exports.blog = (req, res) => {

var query ="Select * from blog";
con.query(query,(err,data)=>
{

    res.render('blog',{data:data});
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
    var query =`INSERT INTO blog( Post_title, Date, TAG1, TAG2, description, BLOGIMG) VALUES ('${Post_title}','${Date}','${TAG1}','${TAG2}','${description}','${BLOGIMG}') `
    con.query(query,(err,data)=>
    {
if(err)throw err;
else
{
    res.redirect("/");
}
    })
}