const express =require('express');
const session =require('express-session');
const app =express();
const routes =require('./routes/index')
var bodyparser=require('body-parser');


app.use(session({
  
    secret:'123asdqwe@&%23asd',
    resave:false,
    saveUninitialized:false,
    
}))

app.set("view engine","ejs");
app.use('/',express.static('./public'));
app.use('/css',express.static('./public/css'));
app.use('/js',express.static('public/js'));
app.use('/img',express.static('public/img'));
app.use(bodyparser.json());
 app.use(bodyparser.urlencoded({extended:true}));
app.use('/',routes);

app.listen(3000,()=>console.log("Listening to port 3000"));