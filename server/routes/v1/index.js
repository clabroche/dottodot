var express = require('express');
var router = express.Router();
const drawRouter = require('./draws')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ hello: 'Welcome !' });
});
router.use('/draws', drawRouter)
module.exports = router;
