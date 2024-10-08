const express = require('express')
const app = express();
const port = 3000;
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('../models/campground');
const { Places, descriptors } = require('./seedHelpers');
const cities = require('./cities')
//const campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('MONGO Connection Open');
    })
    .catch((error) => {
        console.error('MONGO Error!!!:', error);
    });


// array[Math.floor(Math.random()* array.length)] : used to find a random element in an array

const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const random = Math.floor(Math.random() * 100) + 1;
        const price = Math.floor(Math.random() * 100) + 1
        const camp = new Campground({
            //MY USER ID
            author: '66a0f4e09ec182a313528da4',
            title: `${sample(descriptors)} ${sample(Places)}`,
            location: `${cities[random].city}, ${cities[random].admin_name}`,
            //image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti nostrum quibusdam eius atque accusantium in dignissimos. Iusto, hic enim sequi quae consequuntur harum aut nobis labore nemo provident. Fuga, similique?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random].lng,
                    cities[random].lat
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dtczgrboc/image/upload/v1722022747/TrailTribe/cg8l3yfczhrk6ukkcss3.png',
                    filename: 'TrailTribe/cg8l3yfczhrk6ukkcss3',

                },
                {
                    url: 'https://res.cloudinary.com/dtczgrboc/image/upload/v1722022749/TrailTribe/al6sjdc5jmbmeoignu4c.jpg',
                    filename: 'TrailTribe/al6sjdc5jmbmeoignu4c',

                },
                {
                    url: 'https://res.cloudinary.com/dtczgrboc/image/upload/v1722022751/TrailTribe/fey2djr0gcytxsnvhvpw.png',
                    filename: 'TrailTribe/fey2djr0gcytxsnvhvpw',

                }
            ]
        })
        await camp.save();

    }
}
seedDB().then(() => {
    mongoose.connection.close();
})
