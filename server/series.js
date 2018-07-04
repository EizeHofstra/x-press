const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


//Router param for seriesId
seriesRouter.param('seriesId', (req, res, next, seriesId) => {
  const sql = `SELECT * FROM Series WHERE Series.id = $seriesId`;
  const values = {$seriesId: seriesId};
  db.get(sql, values, (error, series) => {
    if (error) {
      next(error);
    } else if (series) {
      req.series = series;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//api/series
//GET Returns a 200 response containing all saved series on the
//series property of the response body.
seriesRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Series`, (err, rows) => {
    if (err || !rows) {
      return res.sendStatus(404);
    }
    res.send({series: rows});
  });
});



//POST Creates a new series with the information from the series
//property of the request body and saves it to the database.
//Returns a 201 response with the newly-created series on the series
//property of the response body.
//If any required fields are missing, returns a 400 response.



//api/series/:seriesId
//GET Returns a 200 response containing the series with the supplied
//series ID on the series property of the response body
//If a series with the supplied series ID doesn't exist, return 404 response.

//PUT Updates the series with the specified series ID using the information
//from the series property of the request body and saves is to the
//database. Returns a 200 response with the updated series on the
//series property of the response body.
//If any required fields are missing, returns 400 response
//If a series with the supplied series ID doesn't exist return 404 response.

//DELETE Deletes the series with the supplied series ID from the database if
//that series has no related issues. Returns a 204 response.
//If the series with the supplied series ID has related issues, return 400 response.
//If a series with the supplied series ID doesn't exist, return 404 response.



//api/series/seriesId/issues
//GET Returns a 200 response containing all saved issues related
//to the series with the supplied series ID on the issues property
//of the response body.
//If a series with the supplied series ID doesn't exist, return 404 response.

//POST Creates a new issues, related to the series with the supplied
//series ID, with the information from the issue property of the request body
//and saves it to the database. Returns a 201 response with the newly-created
//issue on the issue property of the response body.
//IF any required fields are missing or an artist with the supplied
//artist ID doesn't exist, return a 400 response.
//If a series with the supplied series ID doesn't exist, return 404 response.



//api/series/:seriesId/issues/:issueId
//PUT Updates the issue with the specified issue ID using the information
//from the issue property of the request body and saves it to the
//database. Returns a 200 response with the updated issue on the
//issue property of the response body.
//If any required fields are missing, returns a 400 response.
//If a series with the supplied series ID doesn't exist, returns a 404 response.
//If an issue with the supplied issue ID doesn't exist, returns a 404 response.
//DELETE Deletes the issue with the supplied issue ID from the database.
//Returns a 204 response.
//If a series with the supplied series ID doesn't exist, return 404 response.
//If an issue with the supplied issue ID doesn't exist, return 404 response.




module.exports = seriesRouter;
