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
router.route('/movies/collect/:id').get(collect);

//My function to gave random Movie from Denzel movies (must watch movie)
async function RandomMovie(req, res) {
  try {
    const query = {metascore: {$gt: 70}};
    const movie = await Movies.aggregate([{$match:query},{$sample: {size: 1}}]);
    var jsonMovie = JSON.stringify(movie);

    const infoTab = Layout(jsonMovie);
    const link = infoTab[0];
    const title = infoTab[1];
    const metascore = infoTab[2];
    const poster = infoTab[3];
    const rating = infoTab[4];
    const synopsis = infoTab[5];
    const votes = infoTab[6];
    const year = infoTab[7];
    const myReviewsStart = infoTab[8];
    
    res.writeHead(200, { 'Content-Type': 'text/html'});
    res.write('<h1>' + title + '</h1>');
    res.write('<p>Metascore : ' + metascore + '</p>');
    res.write('<p><a>IMDB Link : </a><a href="' + link + '">IMDB Link : ' + link + '</a></p>');
    res.write('<p>Rating : ' + rating + '</p>');
    res.write('<p>Synopsis : ' + synopsis + '</p>');
    res.write('<p>Votes : ' + votes + '</p>');
    res.write('<p>Year : ' + year + '</p>');

    if( myReviewsStart != -1) {
      const jsonReviews = jsonMovie.substring(myReviewsStart + 13, jsonMovie.length - 4);

      const reviews = jsonReviews.split("},{");
      for(var i = 0; i < reviews.length; i++)
      {
        const date = reviews[i].substring(8,18);
        const review = reviews[i].substring(30, reviews[i].length -1);
        res.write('<p>Review ' + (i+1) + ' - ' + date + ' : ' + review + '</p>');
      }
    }
    res.end();
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
}
router.route('/movies').get(RandomMovie);



//Here is main display in our express web app
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Welcome to the Denzel-project of Jean-Louis Delebecque</h1>');
  res.write('<p>Here are netlify url of different fucntionnalities offert by this web app: </p>');
  
  res.write('<p>- Fetch a random must-match movie : <a href = http://project-denzel-delebecque.netlify.com/.netlify/functions/server/movies> http://project-denzel-delebecque.netlify.com/.netlify/functions/server/movies </a> <a href = http://localhost:9292/.netlify/functions/server/movies> http://localhost:9292/.netlify/functions/server/movies </a></p>');

  res.write('<p>- Populate the database with  Denzel movies from IMDb. You can change the actor id at the end of the url, by default is Denzel id, it only works in localhost due to time request : <a href= http://project-denzel-delebecque.netlify.com/.netlify/functions/server/movies/database/nm0000243> http://project-denzel-delebecque..netlify.com/.netlify/functions/server/movies/database/nm0000243</a> <a href= http://localhost:9292/.netlify/functions/server/movies/populate/nm0000243> http://localhost:9292/.netlify/functions/server/movies/populate/nm0000243</a></p>');

  res.write('<p>Thanks for using denzel web app</p>')
  res.end();
  });

  router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
  router.post('/', (req, res) => res.json({ postBody: req.body }));
  
  app.use(bodyParser.json());
  app.use('/.netlify/functions/server', router);  // path must route to lambda
  app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
  
  module.exports = app;
  module.exports.handler = serverless(app);
