const express =require('express');
const app =express();
const routes =require('./routes/index')
var bodyparser=require('body-parser');
const cookieParser = require("cookie-parser");
var session=require('express-session');

app.use(cookieParser());
app.set("view engine","ejs");
app.use('/',express.static('./public'));
app.use('/css',express.static('./public/css'));
app.use('/js',express.static('public/js'));
app.use('/img',express.static('public/img'));
app.use(bodyparser.json());
 app.use(bodyparser.urlencoded({extended:true}));
app.use('/',routes);
app.use(session({
	secret: 'iamhamzarajajlalgorayaabdullahkhan',
	resave: true,
	saveUninitialized: true
}));
app.listen(3000,()=>console.log("Listening to port 3000"));