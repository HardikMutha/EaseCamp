const URL = 'mongodb://localhost:27017/Campground';


const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const campground = require('./models/campground');
const campgrounds = require(path.join(__dirname,'/models/campground'));
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');




mongoose.connect(URL).then(()=>{
    console.log("Connected to Database");
 }).catch((err)=>{
    console.log("Error Connecting to Database");
    console.log(err);
 });

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',ejsMate);

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));




app.listen(3000,()=>{
    console.log("Listening on port 3000");
});

app.get("/",(req,res)=>{
    res.render('homepg');
});

app.get('/campgrounds',async (req,res)=>{
    const allcampgrounds = await campgrounds.find({});
    //res.send("Beautiful");
    res.render('campgrounds/index',{allcampgrounds});
});


app.get('/campgrounds/new',(req,res)=>{
    res.render('./campgrounds/newcamp');
});

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/newcamp');
});

app.get('/campgrounds/:id',async (req,res)=>{
    const camground = await campgrounds.findById(req.params.id);
    res.render('campgrounds/show',{camground});
});

app.post('/campgrounds',async(req,res)=>{
    const newcg = req.body;
    const newcg1 = new campground(newcg);
    await newcg1.save();
    res.redirect(`/campgrounds/${newcg1._id}`);
});

app.get('/campgrounds/:id/edit',async(req,res)=>{
    const camground = await campgrounds.findById(req.params.id);
    res.render('campgrounds/edit',{camground});
});

app.put('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    const nice = req.body;
    const newvalue = await campground.findByIdAndUpdate(id,nice);
    res.redirect(`/campgrounds/${id}`);
});


app.delete('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

