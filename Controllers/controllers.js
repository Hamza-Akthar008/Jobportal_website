var con = require("./db");
const path =require('path');
const staticpage = path.join(__dirname, "../public", "about.html");
con.connect();
var found =true;
var jobsearch;
function homedata(req,res)
  {
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
if(found)
{
    var selectQuery = `SELECT * from  job LIMIT   ${startLimit},${jobPerPage}`;
    
    console.log(" done");
}
else
{
    var selectQuery = `SELECT * from  job WHERE JOBNAME LIKE ${jobsearch}  LIMIT   ${startLimit},${jobPerPage}`;
    
}

            con.query(selectQuery, (err, data) => {
                if (err) throw err;
                else {

                }
            if(req.session.user_role=="ADMIN")
            {
                res.render("admin",{data:data,page,jobPerPage,startLimit,totalPages});

            }
            else
            {
                res.render("home",{data:data,page,jobPerPage,startLimit,totalPages});

            }
                
                
                
                
            })
            
        }
    })
  }



exports.signin =function(req,res)
{
    if(req.session.user_role)
    {
        found=true;
        homedata(req,res);
    }
    
    else{
        res.render('signin');

    }
}
exports.home =function(request,response)
{

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
                        request.session.user_id = data[count].ID;
                         
                        request.session.user_role = data[count].role;
                    
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
                if(request.session.user_role=="ADMIN")
                {

                 response.render("admin",{data:data,page,jobPerPage,startLimit,totalPages});
                }
                else{
                    if(register=="false")
                    {
                        
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

}

    
exports.about =(req,res)=>
{
    if(req.session.user_role)
    {
        
    res.sendFile(staticpage);
    }
    else
    {
        res.render('signin');
    }
}

exports.logout =(req,res)=>
{
    req.session.destroy();
    res.redirect("/");
}
exports.search =(req,res)=>
{
   
    res.redirect('/');
}



   

