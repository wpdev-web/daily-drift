const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path= require('path');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname,'images'))); // Serve static files from 'images' directory

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.error('Error:', error);
    const status = error.statusCode || 500;
    const message = error.message || 'An error occurred.';
    res.status(status).json({ message: message });
});

mongoose.connect('mongodb+srv://haidersoft2020:XTd1F4nY36pZq0sm@cluster0.qkxzxym.mongodb.net/bloging?retryWrites=true&w=majority&appName=Cluster0')    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

app.listen(8080);