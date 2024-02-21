import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
const API_KEY = ""
const API_GEO = "http://api.openweathermap.org/geo/1.0/direct?"
const API_WEA = "https://api.met.no/weatherapi/locationforecast/2.0/complete?lat="

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/", async (req, res) => {
    try {
        const geoResult = await axios.get(`${API_GEO}q=${req.body.country}&limit=1&appid=${API_KEY}`);
        const weatherResult = await axios.get(`${API_WEA}${geoResult.data[0].lat}&lon=${geoResult.data[0].lon}`, {
            headers: {'User-agent': "weatherapp"}
        } );
        const weatherResults = weatherResult.data.properties.timeseries[1].data.instant.details;
        res.render("index.ejs", {
            country: geoResult.data[0].name,
            data: weatherResults
        });
    } catch(error){
        console.log(error.response);
        res.render("index.ejs");
    };
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

