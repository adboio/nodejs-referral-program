var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var shortid = require('shortid');

/* New POST route for form submissions */
router.post('/', function(req, res, next) {

  /* establish mysql connection */
  var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  /* user's email address */
  let email = req.body.email;

  /* a unique referral code the user can share */
  let referral_code = shortid.generate();

  /* the referral code a user submitted (might be null) */ 
  let referrer = req.body.referrer;

  /* add user to the database with INSERT */
  let query = "INSERT INTO `users` (`email`, `referral_code`, `referrer`) VALUES (?, ?, ?)";
  connection.query(query, [email, referral_code, referrer], (err, rows) => {
    connection.end(function() {
      if (err) return next();
      return res.send({referralCode: referral_code});
    });
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
