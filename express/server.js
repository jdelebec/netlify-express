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
const movies_model = mongoose.model('movies', schema);

// Use express to create gave routing to our project
const app = express();
const router = express.Router();


//Add data to our database
async function collect(req, res) {
  try {
    const id = req.params.id;
    const movies = await imdb(id);

    await movies_model.insertMany(movies);

    res.status(200).json({
      Total: movies.length
     });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
}
router.route('/movies/database').get(collect);





router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Welcome to the Denzel project of Jean-Louis Delebecque</h1>');
  res.write('<p>Here are netlify url of different fucntionnalities offert by this web app: ');
  res.end();
  });

  router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
  router.post('/', (req, res) => res.json({ postBody: req.body }));
  
  app.use(bodyParser.json());
  app.use('/.netlify/functions/server', router);  // path must route to lambda
  app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
  
  module.exports = app;
  module.exports.handler = serverless(app);
  