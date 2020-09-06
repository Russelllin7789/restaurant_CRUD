const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantData = require('./restaurant.json')

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
  Restaurant.create(Object.assign(restaurantData.results, restaurantData))
})
