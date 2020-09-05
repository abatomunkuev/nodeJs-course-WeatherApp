const path = require('path');
const express = require('express');
const hbs = require('hbs');

// requiring utils
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location          https://expressjs.com/en/4x/api.html
app.set('view engine', 'hbs'); // setting up handlebars
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));


// setting up the root
app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Andrei Batomunkuev'
    });
});

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About',
        name: 'Andrei Batomunkuev'
    });
});

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        name: 'Andrei Batomunkuev',
        message: 'This is some help text'
    });
});

app.get('/weather', (req,res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        });
    }
    const address = req.query.address;

    if(typeof address == 'string') {
        geoCode(address, (error, {longitude, latitude, location} = {}) => {
            if (error) {
                return res.send({
                    error
                });
            }
            forecast(longitude, latitude, (error, forecastData) => {
                if(error) {
                    return res.send({
                        error
                    });
                }
                res.send({
                    address,
                    forecast:forecastData,
                    location
                });
            })
        });
    }
});

app.get('/products', (req,res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }
    console.log(req.query);
    res.send({
        products: []
    });
})

app.get('/help/*', (req,res) => { // match any page that starts with /help/ 
    res.render('404' ,{
        title: '404',
        name: 'Andrei Batomunkuev',
        errorMessage: 'Help article not found'
    })
});

// setting up 404 page by using * character that match anything
app.get('*', (req, res) => { 
    res.render('404', {
        title: '404',
        name: 'Andrei Batomunkuev',
        errorMessage: 'Page not found.'
    });
});

// starting server up
app.listen(port, () => {
    console.log('Server is up on port 3000!');
});