




const today = new Date().toISOString().substring(0, 10)
lastweek = new Date(new Date() - 1000 * 3600 * 24 * 7).toISOString().substring(0, 10)

const sortFunctions = {
  size: {
    ascending: (a, b) => a.estimated_diameter.meters.estimated_diameter_min - b.estimated_diameter.meters.estimated_diameter_min,
    descending: (a, b) => b.estimated_diameter.meters.estimated_diameter_min - a.estimated_diameter.meters.estimated_diameter_min
  },
  time: {
    ascending: (a, b) => a.close_approach_data[0].epoch_date_close_approach - b.close_approach_data[0].epoch_date_close_approach,
    descending: (a, b) => b.close_approach_data[0].epoch_date_close_approach - a.close_approach_data[0].epoch_date_close_approach
  },
  speed: {
    ascending: (a, b) => a.close_approach_data[0].relative_velocity.kilometers_per_hour - b.close_approach_data[0].relative_velocity.kilometers_per_hour,
    descending: (a, b) => b.close_approach_data[0].relative_velocity.kilometers_per_hour - a.close_approach_data[0].relative_velocity.kilometers_per_hour
  },
  magnitude: {
    ascending: (a, b) => a.absolute_magnitude_h - b.absolute_magnitude_h,
    descending: (a, b) => b.absolute_magnitude_h - a.absolute_magnitude_h
  },
  missDistance: {
    ascending: (a, b) => a.close_approach_data[0].miss_distance.kilometers - b.close_approach_data[0].miss_distance.kilometers,
    descending: (a, b) => b.close_approach_data[0].miss_distance.kilometers - a.close_approach_data[0].miss_distance.kilometers
  },
}

let image = "./images/earth.png"
const Apikey = "cer2dvldobbRkV7lXg2b8Nx0c1ezNCdUyZJVbEju"
fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${lastweek}&api_key=cer2dvldobbRkV7lXg2b8Nx0c1ezNCdUyZJVbEju`, {
  method: "Get",
  Headers: {
    "Authorization": `Basic ${Apikey}`
  }
})
  .then(response => response.json())
  .then(data => {
    console.log(data)

    const lastWeekNEOs = Object.entries(data.near_earth_objects).reduce((prev, [date, neo]) => {
      return new Date() - new Date(date) < 1000 * 3600 * 24 * 7 ? [...prev, ...neo] : prev
    }, [])
    document.querySelectorAll("#sortBy, #lowOrHigh").forEach(element => element.addEventListener("change", (e) => {
      const sortType = document.getElementById("sortBy").value
      const sortTypeasdes = document.getElementById("lowOrHigh").value
      
      renderNEOs(lastWeekNEOs, sortFunctions[sortType][sortTypeasdes], data)
    }))
    renderNEOs(lastWeekNEOs, sortFunctions.time.descending, data)
  })

function renderNEOs(data, sortFunction, a) {
  document.getElementById("container").innerHTML = ""
 
  data.sort(sortFunction).forEach(NEO => {
    const card = document.createElement("div")

    card.classList.add("card", "small")
    card.innerHTML += `
      <img src="./images/earth.png" class="card-image">
      <div class="card-title">${NEO.name}</div>
      <div class="card-time">${moment(NEO.close_approach_data[0].epoch_date_close_approach).format("MMM Do, h:mm a")}</div>
      <div class="card-distance card-extra">Miss distance:~${Math.round(NEO.close_approach_data[0].miss_distance.kilometers * 0.0001)}0,000 km</div>
      <div class="card-kmh card-extra">Km/h: ~${Math.round(NEO.close_approach_data[0].relative_velocity.kilometers_per_hour * 0.001)},000</div>
      <div class="card-size card-extra">Size min/max:  ${Math.round(NEO.estimated_diameter.meters.estimated_diameter_min)}/${Math.round(NEO.estimated_diameter.meters.estimated_diameter_max)}m</div>
      <div class="card-magnitude card-extra">Magnitude: ${NEO.absolute_magnitude_h}</div>
      <div class="card-hazardous card-extra">Potentially hazardous: ${NEO.is_potentially_hazardous_asteroid} </div>
      <div class="card-planet card-extra">Planet: ${NEO.close_approach_data[0].orbiting_body} </div>
      <div class="card-id card-extra">Id: ${NEO.id} </div>

      `
      console.log(moment(NEO.close_approach_data[0].epoch_date_close_approach).format("h:mm"))
      console.log(moment(new Date().toISOString()).format("h:mm"))
      const now = moment(new Date().toISOString()).format("h:mm")
      document.getElementById("statsP").innerHTML = `
         Objects from last 7 days: ${a.element_count} <br>
        `
    card.addEventListener("click", (e) => {
      card.classList.toggle("small")
    })
    document.getElementById("container").append(card)
  })
}

