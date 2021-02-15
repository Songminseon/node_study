var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password : '!t1621711',
	database : 'funation'
})

connection.connect(); //db 연결하기

router.get('/', function(req,res){
	var msg;
	var errMsg = req.flash('error')
	if(errMsg) msg = errMsg;

    res.render('join.ejs', {'message':msg});
})

passport.serializeUser(function(user, done){
	console.log("serial")
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	console.log("deserial")
	done(null, id);
})

passport.use('local-join', new LocalStrategy({
	usernameField:'email',
	passwordField:'password',
	passReqToCallback : true
},function(req, email, password,done){
	var query = connection.query('select * from user where email=?', [email], function(err,rows){
		if(err) return done(err);

		if(rows.length){
			console.log("exiseted dataset")
			return done(null, false, {message:'your email is already existed.'})
		} else{
			var sql = {email:email, password:password};
			var query = connection.query('insert into user set?', sql, function(err,rows){
				if(err) throw err
				return done(null, {'email':email, 'id':rows.insertId});
			})
		}
		console.log(email)
		console.log(rows)
	})	
	console.log('lcoal-join callback called')
}
));

router.post('/', passport.authenticate('local-join', {
	successRedirect:'/main',
	failureRedirect:'/join',
	failureFlash : true
}))


// router.post('/', function(req,res){
// 	var body = req.body;
// 	var email = body.email;
// 	var name = body.name;
// 	var password = body.password; 

// 	var sql = {email : email, name:name, password:password};

// 	var query = connection.query('insert into user set ?', sql ,function(err, rows) {
// 		if(err) throw err
// 		else res.render('welcome.ejs', {'name':name, "id":rows.insertId})
// 		console.log(rows + "aaaa")
// 	})
	

// })


module.exports = router;