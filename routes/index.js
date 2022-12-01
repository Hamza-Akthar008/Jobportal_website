const express = require('express');
const routes = express.Router();
const path = require('path');
const multer =require('multer');

const controller =require("../Controllers/controllers.js");
var user_email_address;
var fn="";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/databaseimg");
    },
    filename: (req, file, cb) => {
    fn=Date.now() + path.extname(file.originalname)
        cb(null,fn );
    }
})
const upload = multer({ storage: storage });

routes.post('/', function(request, response, next){
    controller.home(request,response);
});
routes.get("/",(req,res)=>controller.signin(req,res));
routes.get('/about',(req,res)=>controller.about(req,res));
routes.post('/signout',(req,res)=>controller.logout(req,res));
routes.get('/signout',(req,res)=>controller.logout(req,res));
routes.post('/search',(req,res)=>controller.search(req,res));
routes.get('/addjob',(req,res)=>controller.showaddjob(req,res))
routes.post('/addjob',upload.single("JOBIMG"),(req,res)=>controller.addjob(req,res,fn))
routes.get('/delete/:id',(req,res)=>controller.delete(req,res));
routes.get('/edit/:id',(req,res)=>controller.edit(req,res));
routes.post('/edit/:id',upload.none(),(req,res)=>controller.editdata(req,res));
routes.get('/blog',(req,res)=>controller.blog(req,res));
routes.post('/blog/:id',upload.none(),(req,res)=>controller.postcomment(req,res));
routes.get('/addblog',(req,res)=>controller.addblog(req,res));
routes.post('/addblog',upload.single("BLOGIMG"),(req,res)=>controller.addblogpost(req,res,fn));
routes.get('/signin/verify',(req,res)=>controller.verify(req,res));
routes.post('/signin/verify',(req,res)=>controller.verifycode(req,res));
routes.post('/rating/:id',(req,res)=>controller.rating(req,res));
routes.post('/review/:review',(req,res)=>controller.review(req,res));
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




  
module.exports = routes; 
