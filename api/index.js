const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const weatherAPIUrl = 'https://api.openweathermap.org/data/2.5/onecall';
const weatherAPIKey = process.env.WEATHER_API_KEY;
const geoAPIKey = process.env.GEO_API_KEY;

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
);

app.get('/', (req, res) => {
  res.json('local weather backend');
});

app.get('/search', async (req, res) => {
  try {
    const geoApiOptions = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': geoAPIKey,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    };
    const geoAPIUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';

    const response = await axios.get(geoAPIUrl, { params: req.query, ...geoApiOptions });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// /search?namePrefix=seattle&sort=name

app.get('/weather', async (req, res) => {
  try {
    const response = await axios.get(weatherAPIUrl, {
      params: { ...req.query, appid: weatherAPIKey }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// /weather?lat=47.60621&lon=-122.33207&exlude={part}&units=imperial
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
