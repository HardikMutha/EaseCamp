const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.set('view engine','ejs');
app.set(bodyParser.urlencoded({extended:true}));
app.set('views',path.join(__dirname,'views'));


app.listen(3000,()=>{
    console.log("Listening on port 3000");
});

app.get("/",(req,res)=>{
    res.render('homepg');
});

