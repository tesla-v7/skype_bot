var express = require('express');
var router = express.Router();
var users = require('../web_controller/user');

/* GET users listing. */
router.get('/view', users.user_view);
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;