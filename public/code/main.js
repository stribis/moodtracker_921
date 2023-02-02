function setup () {
  // Disable Canvas
  noCanvas()

  // Video Capture
  const video = createCapture()
  video.parent('main-container')
  video.size(320, 240)



let lat, lon, temp, description, aqi

if ('geolocation' in navigator) {
  // console.log(navigator)

  navigator.geolocation.getCurrentPosition(async position => {

    try {

      lat = position.coords.latitude
      lon = position.coords.longitude

      const response = await fetch(`/weather/${lat},${lon}`)
      const data = await response.json()
      
      // create template
      temp = data.weather.main.temp
      description = data.weather.weather[0].description
      aqi = data.aqi

      const template = `
      <div class="more-info">
        <div>Temperature: ${temp}°C</div>
        <div>${description}</div>
        <div>AQI: ${aqi}</div>
      </div>
      `
      const weatherDiv =  document.createElement('div')
      weatherDiv.innerHTML = template
      document.querySelector('#main-container').append(weatherDiv)


    } catch (error) {
      console.error(error)
    }


  })
} else { 
  console.error('Browser does not support Geolocation')
}

document.querySelector('form button').addEventListener('click', async (e) => {
  e.preventDefault()

  // Read mood from input
  const mood = document.querySelector('#mood').value

  // Get image as base64 
  video.loadPixels()
  const image64 = video.canvas.toDataURL()

  // TODO: ADD AQI DATA
  const data = {
    mood,
    temp,
    description,
    aqi,
    image64
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const response = await fetch('/api', options)
  const json = await response.json()

  console.log(json)
})

}