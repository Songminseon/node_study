var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var main = require('./main')
var email = require('./email')
var login = require('./login/index')
var join = require('./join/index')

router.get('/', function(req, res){
    console.log('index js / path loaded')
	res.sendFile(path.join(__dirname, "../public/main.html"))  //dirname => root directory
});

router.use('/main', main)
router.use('/email', email)
router.use('/join', join)
router.use('/login', login)

module.exports = router;
