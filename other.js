
const today = new Date().toISOString().substring(0, 10)
lastweek = new Date(new Date() - 1000 * 3600 * 24 * 7).toISOString().substring(0, 10)

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
    document.getElementById("container").innerHTML = JSON.stringify(data)
    })
