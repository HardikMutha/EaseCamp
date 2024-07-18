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
        const price = Math.floor(Math.random()*30)+10;
        const newground = new Campground({
            title:`${sample(places)} ${sample(descriptors)}`,
            location: `${destinations[newnum].city} ${destinations[newnum].state}`,
            img : [
                {
                  url: 'https://res.cloudinary.com/dxjbmtq0h/image/upload/v1721236317/EaseCamp/yfma2orzg85qthov9cyi.jpg',
                  filename: 'EaseCamp/yfma2orzg85qthov9cyi'
                },
                {
                  url: 'https://res.cloudinary.com/dxjbmtq0h/image/upload/v1721236318/EaseCamp/mzgzi9oj4b6vwxqj2lp7.jpg',
                  filename: 'EaseCamp/mzgzi9oj4b6vwxqj2lp7'
                }
              ],
            price:price,
            description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, similique! Necessitatibus velit voluptate omnis molestiae praesentium. Magni, quod sed molestias ipsa nostrum et adipisci culpa, voluptas alias at rerum corrupti!',
            author : '66958784c6a9335490cc2748'
        }
    );
        await newground.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close();
}).catch(err=>{
    console.log(err);
});



