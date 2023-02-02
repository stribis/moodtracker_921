
getData ()
async function getData () {
  const response = await fetch('/api')
  const data = await response.json()

  console.log(data)

  data.forEach(mood => {
    const mood_container = document.createElement('div')
    mood_container.classList.add('mood')

    let aqiClass
    let aqiText
    if ( mood.aqi < 51 ) {
      aqiClass = 'good'
      aqiText = 'Good'
    } else if (mood.aqi > 50 && mood.aqi < 101){
      aqiClass = 'moderate'
      aqiText = 'Moderate'
    } else if (mood.aqi > 100 && mood.aqi < 151){
      aqiClass = 'unhealthySensitive'
      aqiText = 'Unhealthy for Sensitive Groups'
    } else if (mood.aqi > 150 && mood.aqi < 201){
      aqiClass = 'unhealthy'
      aqiText = 'Unhealthy'
    } else if (mood.aqi > 200 && mood.aqi < 301){
      aqiClass = 'veryUnhealthy'
      aqiText = 'Very Unhealthy'
    } else if (mood.aqi > 299){ 
      aqiClass = 'hazardous'
      aqiText = 'Hazardous'
    }

    
    const template = `
      <img src="${mood.image64}" alt="${mood.mood}">
      <h2>${mood.mood}</h2>
      <ul>
        <li>${mood.temp}</li>
        <li>${mood.description}</li>
      </ul>
      <small>${mood.timestamp}</small>
      <div class="aqi ${aqiClass}">AQI: ${mood.aqi} - ${aqiText}</div>
      
    `
    mood_container.innerHTML = template
    document.querySelector('.moods').appendChild(mood_container)
  })


}

