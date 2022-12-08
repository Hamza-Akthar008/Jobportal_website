const express = require('express');
const routes = express.Router();

const multer =require('multer');

const controller =require("../Controllers/controllers.js");
var user_email_address;
var fn="";
const path =require("path");
const staticpage = path.join(__dirname, "../public", "chat.html");
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
routes.post('/addjob',(req,res)=>controller.addjob(req,res))
routes.get('/delete/:id',(req,res)=>controller.delete(req,res));
routes.get('/edit/:id',(req,res)=>controller.edit(req,res));
routes.post('/edit/:id',(req,res)=>controller.editdata(req,res));
routes.get('/blog',(req,res)=>controller.blog(req,res));
routes.post('/blog/:id',upload.none(),(req,res)=>controller.postcomment(req,res));
routes.get('/addblog',(req,res)=>controller.addblog(req,res));
routes.post('/addblog',upload.single("BLOGIMG"),(req,res)=>controller.addblogpost(req,res,fn));
routes.get('/signin/verify',(req,res)=>controller.verify(req,res));
routes.post('/signin/verify',(req,res)=>controller.verifycode(req,res));
routes.post('/rating/:id',(req,res)=>controller.rating(req,res));
routes.post('/review/:review',(req,res)=>controller.review(req,res));
routes.get('/register',(req,res)=>controller.register(req,res));
routes.post('/register',upload.none(),(req,res)=>controller.postregister(req,res));
routes.get('/forget',(req,res)=>controller.forget(req,res));
routes.get('/manageuser',(req,res)=>controller.ManageUser(req,res));
routes.get("/forgetpwd",(req,res)=>controller.security(req,res))
routes.post("/forgetpwd",(req,res)=>controller.postsecurity(req,res))
routes.get("/reset",(req,res)=>controller.resetpwd(req,res));
routes.post("/reset",(req,res)=>controller.reset(req,res));
routes.get("/resetpasword",(req,res)=>controller.pwdreset(req,res));
routes.get("/latest",(req,res)=>controller.latest(req,res));
routes.get("/replyreview/:email",(req,res)=>controller.replyreview(req,res))
routes.get('/chat',(req,res)=>
{
    res.sendFile(staticpage);
})
routes.get("/apply/:id",(req,res)=>controller.apply(req,res));
routes.post("/apply/:id",upload.single("CV"),(req,res)=>controller.postapply(res,res));
routes.get("/reply",(req,res)=>controller.reply(req,res));
module.exports=routes;