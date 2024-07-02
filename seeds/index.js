const mongoose = require('mongoose');
const Campground = require('../models/campground');

const {places,descriptors} = require('./seedhelp');
const destinations = require('./cities');
connectdb().then(()=>console.log("Connection Successfull with database")).catch((err)=>{
    console.log("Error Connecting to database");
});


async function connectdb()
{
    await mongoose.connect('mongodb://localhost:27017/Campground');
};





const sample = (arr)=> arr[Math.floor(Math.random()*arr.length)];

const seedDB = async function()
{
    await Campground.deleteMany({});
    for(let i=1;i<=50;i=i+1)
    {
        const newnum = Math.floor(Math.random()*1000);
        const newground = new Campground({title:`${sample(places)} ${sample(descriptors)}`,
        location: `${destinations[newnum].city} ${destinations[newnum].state}`});
        await newground.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close();
}).catch(err=>{
    console.log(err);
});


