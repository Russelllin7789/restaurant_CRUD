const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const restaurantList = require('./restaurant.json')
const Restaurant = require('./models/restaurant.js')
const mongoose = require('mongoose')
const app = express()
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true }, { useUnifiedTopology: true })
const port = 3000
let lastId = 8

// setting connection
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// handelbars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

// routes setting
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// add new restaurant
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  lastId++
  const id = lastId
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const rating = req.body.rating
  const google_map = req.body.google_map
  const description = req.body.description

  return Restaurant.create({ id, name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => { res.redirect('/') })
    .catch(error => console.log(error))
})

// view restaurant
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// edit restaurant
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const rating = req.body.rating
  const google_map = req.body.google_map
  const description = req.body.description

  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.id = id
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.rating = rating
      restaurant.google_map = google_map
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// delete restaurant
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// start and listen to the Express server
app.listen(port, () => {
  console.log(`Express is listening to Localhost: ${port}`)
})

