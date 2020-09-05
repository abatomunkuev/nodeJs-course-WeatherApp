const request = require('postman-request');

const forecast = function forecast(longitude,latitude, callback) {
    const url = `http://api.weatherstack.com/current?access_key=751fb78b1b3aeb6a7f03aaab22dd4016&query=${latitude},${longitude}&units=m`;
    request({ url, json: true}, (error,{body}) => {
        if(error) {
            callback('Unable to connect to the weather service!', undefined);
        } else if(body.error) {
            callback('Unable to find location', undefined);
        } else {
            const currentWeather = body.current;
            callback(undefined,`${currentWeather.weather_descriptions[0]}. It is currently ${currentWeather.temperature} degrees out. There is a ${currentWeather.precip}% chance of rain.It feels like ${currentWeather.feelslike} degrees out`);
        }
    })
}

module.exports = forecast;