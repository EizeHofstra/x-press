const express = require('express');
const artistsRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


//Router param for artistId
artistsRouter.param('artistId', (req, res, next, artistId) => {
  const sql = `SELECT * FROM Artist WHERE Artist.id = $artistId`;
  const values = {$artistId: artistId};
  db.get(sql, values, (error, artist) => {
    if (error) {
      next(error);
    } else if (artist) {
      req.artist = artist;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});


// GET api/artists Returns a 200 response containing all saved
//currently-employed artists (is_currently_employed is equal to 1)
//on the artists property of the response body.
artistsRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Artist WHERE is_currently_employed = 1;`, (err, rows) => {
    if (err || !rows) {
      return res.sendStatus(404);
    }
    res.send({artists: rows});
  });
});


//POST api/artists Creates a new artists with the information from
//the artists property of the request body and saved it to the
//database. Returns a 201 response with the newly-created artist
//on the artist property of the response body.
//If any required fields are missing, returns a 400 response.
artistsRouter.post('/', (req, res, next) => {
  const newArtist = req.body.artist;
  if (!newArtist.name || !newArtist.dateOfBirth || !newArtist.biography) {
    res.status(400).send();
  }
  db.run(`INSERT INTO Artist (name, date_of_birth, biography)
  VALUES ($name, $date_of_birth, $biography)`, {
    $name: newArtist.name,
    $date_of_birth: newArtist.dateOfBirth,
    $biography: newArtist.biography
  },
  function (error) {
    if (error) {
      return res.status(400).send();
    }
    db.get(`SELECT * FROM Artist WHERE id = ${this.lastID}`,
      (err, row) => {
        if (err || !row) {
          res.status(400).send();
        }
        res.status(201).send({artist: row})
    });
  });
});


// api/artists/:artistId

//GET Returns a 200 response containing the artist with the supplied
//artist ID on the artist property of the response body
//If an artist with the supplied artist ID doesn't exist, returns a 404 response
artistsRouter.get('/:artistId', (req, res, next) => {
  res.status(200).json({artist: req.artist});
});

//PUT Updates the artist with the specified artist ID using
//the information from the artist property of the request body
//and saved it to the database. Returns a 200 response with the
//updated artist on the artist property of the response body
//If any required fields are missing, returns a 400 response
//If an artist with the supplied artist ID doesn't exist, returns a 404 response.
artistsRouter.put('/:artistId', (req, res, next) => {
  const updatedArtist = req.body.artist;
  if (!updatedArtist.name || !updatedArtist.dateOfBirth || !updatedArtist.biography) {
    res.status(400).send();
  }
  db.run(`UPDATE Artist SET name = $name, date_of_birth = $date_of_birth, biography = $biography WHERE id = ${req.params.artistId}`, {
    $name: updatedArtist.name,
    $date_of_birth: updatedArtist.dateOfBirth,
    $biography: updatedArtist.biography
  },
  function(err) {
    if(err) {
      res.status(400).send();
    }
    db.get(`SELECT * FROM Artist WHERE id = ${req.params.artistId}`,
      (err, row) => {
        res.status(200).send({artist: row});
      });
  });
});


//DELETE Updates the artist with the specified artist ID to be unemployed
//(is_currently_employed equal to 0). Returns a 200 response.
//If an artist with the supplied artist ID doesn't exist, returns a 404 response.
artistsRouter.delete('/:artistId', (req, res, next) => {
  db.run(`UPDATE Artist SET is_currently_employed = 0 WHERE id = ${req.params.artistId}`,
    function (err) {
      if (err) {
        return res.status(404).send()
      }
      db.get(`SELECT * FROM Artist WHERE id = ${req.params.artistId}`,
        (err, row) => {
          res.status(200).send({artist: row});
        }
      )
  })
})


module.exports = artistsRouter;
