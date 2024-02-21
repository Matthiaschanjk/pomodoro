import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
const API_GEO = "https://get.geojs.io/v1/ip/geo.json"
const API_WEA = "https://api.met.no/weatherapi/locationforecast/2.0/complete?lat="

app.get("/", async (req, res) => {
    try {
        const geoResult = await axios.get(API_GEO);
        const weatherResult = await axios.get(`${API_WEA}${geoResult.data.latitude}&lon=${geoResult.data.longitude}`, {
            headers: {'User-agent': "weatherapp"}
        } );
        const weatherResults = weatherResult.data.properties.timeseries[1].data.instant.details;
        res.render("index.ejs", {
            country: geoResult.data.country,
            data: weatherResults
        });
    } catch(error){
        console.log(error.response);
    }
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

