const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const sauceRoute = require('../back-end/routes/sauce');
const userRoute = require('../back-end/routes/user');
const path = require('path');



const app = express();

mongoose.connect('mongodb+srv://jimbob:<DADAhana@002>@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/auth', userRoute);
app.use('/api/sauces', sauceRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;





















































module.exports = app;