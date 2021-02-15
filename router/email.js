var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password : '!t1621711',
	database : 'funation'
})

connection.connect(); //db 연결하기

console.log("aa")


router.get('/', function(req,res){
	res.sendFile(path.join(__dirname, "../public/form.html"))
});

router.post('/form', function(req,res){
	console.log(req.body.email)
	//res.send("<h1>Welcome " + req.body.email + " siball zip gogo</h1>" )
	res.render('email.ejs', {'email':req.body.email})
});

router.post("/ajax",function(req,res){
	var email = req.body.email;
	var responseData = {};

	var query = connection.query('select name from user where email="' + email+ '"', function(err, rows){
		if(err) throw err;
		if(rows[0]){
			console.log(rows[0])
			responseData.result = "ok";
			responseData.name = rows[0].name;
		} else{
			responseData.result = "none";
			responseData.name = ""
			console.log('none:' +rows[0])
		}
		res.json(responseData)
	})
});

module.exports = router;