'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const PORT = 9292;
const imdb = require('./imdb');

//Connect to Mongo Database
const url = "mongodb+srv://jdlbq:1234@cluster0-uplq2.mongodb.net/Denzel?retryWrites=true&w=majority";
mongoose.connect(url, { useUnifiedTopology: true,useNewUrlParser: true }).then(() => console.log('DB connection successful!'));;

//Create our schema then naturally modelize it
//id : false because we don't specially want id as it already exist 
const schema = new mongoose.Schema({}, {id: false}, 'movies');
const movies = mongoose.model('movies', schema);

// Use express to create gave routing to our project
const app = express();
const router = express.Router();

console.log("test")

router.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello from Express.js!Hello</h1>');
    res.end();
  });
  router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
  router.post('/', (req, res) => res.json({ postBody: req.body }));
  
  app.use(bodyParser.json());
  app.use('/.netlify/functions/server', router);  // path must route to lambda
  app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
  
  module.exports = app;
  module.exports.handler = serverless(app);
  