// const debug = require('debug')('weathermap');

const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || '';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

const fetchWeather = async () => {
  const response = await fetch(`${mapURI}/forecast?q=${targetCity}&appid=${appId}`);

  return response ? response.json() : {};
};

const fetchWeatherWithLocation = async (lat, lon) => {
  const response = await fetch(`${mapURI}/forecast?lat=${lat}&lon=${lon}&appid=${appId}`);

  return response ? response.json() : {};
};

router.get('/api/weather/', async ctx => {
  ctx.type = 'application/json; charset=utf-8';

  const weatherData = await fetchWeather();

  ctx.body = weatherData.list ? [ targetCity,
    weatherData.list, ] : {};

  // ctx.body = weatherData.list ? weatherData.list[1].weather[0] : {};
});

router.get('/api/weather/:latitude/:longitude', async ctx => {
  ctx.type = 'application/json; charset=utf-8';

  const weatherData = await fetchWeatherWithLocation(ctx.params.latitude,
                                                     ctx.params.longitude);

  ctx.body = weatherData.list ? [ ctx.params,
    weatherData.list, ] : {};
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
