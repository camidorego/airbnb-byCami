const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
    .then(() => {
        console.log('conectado a la bd');
    })
    .catch((err) => {
        console.log('error ocurred', err)
    })

const sample = arr => arr[Math.floor(Math.random() * arr.length
)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '657500b6ba15b39aecbbee6d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude] },
            images: [
                {
                    url: 'https://res.cloudinary.com/diztlyb0g/image/upload/v1702501015/YelpCamp/myj8eukz76nbgfl9pcaz.jpg',
                    filename: 'YelpCamp/myj8eukz76nbgfl9pcaz',
                },
                {
                    url: 'https://res.cloudinary.com/diztlyb0g/image/upload/v1702501014/YelpCamp/rtd6rfsanxqd2q6jm9dc.jpg',
                    filename: 'YelpCamp/rtd6rfsanxqd2q6jm9dc',
                }
            ],
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque nemo quod ipsam sit veritatis iure voluptatum atque suscipit amet. Rem cumque ipsum cum quo molestias fugiat enim veritatis nulla tenetur.',
            price,
        })
        await camp.save();
        console.log('guardado')

    }
}
seedDB().then(() => {
    mongoose.connection.close();
})