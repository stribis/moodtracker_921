const express = require('express')
const fetch = require('node-fetch')
//const Datastore = require('nedb')
const Datastore = require('@seald-io/nedb')
require('dotenv').config()


const app = express()

const port = process.env.PORT || 3002

app.listen(port, () => {
  console.log(`App started on: http://127.0.0.1:${port}`)
})

app.use(express.static('public'))
app.use(express.json({
  limit:'30mb'
}))

const database = new Datastore('database/database.db')
database.loadDatabase()

app.post('/api', (req, res) => {
  const data = req.body
  //console.log(data)
  data.timestamp = Date.now()
  database.insert(data)
  data.success = true
  res.json(data)
})

app.get('/api', (req, res)=> {
  // Get data from database
  database.find({}, (err, data) => {
    if (err) {
      console.error(err)
    } else {
      res.json(data)
    }
  })
})

app.get('/weather/:latlon', async (req, res) => {
  const latlon = req.params.latlon.split(',')
  console.log(latlon)

  // AQI Url Data
  const aqi_key = process.env.API_KEY_AQI
  const aqi_url = `https://api.waqi.info/feed/geo:${latlon[0]};${latlon[1]}/?token=${aqi_key}`

  // Weather API url data
  const weather_key = process.env.API_KEY_WEATHER
  const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${latlon[0]}&lon=${latlon[1]}&appid=${weather_key}&units=metric`

  // Request Weather data
  const weatherResponse = await fetch(weather_url)
  const weatherData = await weatherResponse.json()

  // Request AQI data
  const aqiResponse = await fetch(aqi_url)
  const aqiData = await aqiResponse.json()

  console.log(aqiData)

  const data = {
    weather: weatherData,
    aqi: aqiData.data.aqi
  }

  res.json(data)
})