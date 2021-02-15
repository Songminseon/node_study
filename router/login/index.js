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

    res.render('login.ejs', {'message':msg});
})

passport.serializeUser(function(user, done){
	console.log("serial")
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	console.log("deserial")
	done(null, id);
})

passport.use('local-login', new LocalStrategy({
	usernameField:'email',
	passwordField:'password',
	passReqToCallback : true
},function(req, email, password,done){
	var query = connection.query('select * from user where email=?', [email], function(err,rows){
		if(err) return done(err);

		if(rows.length){
			return done(null, {'email':email, 'id':rows[0].UID})
		} else{
			
			return done(null, false, {'message':'your email is not existed.'})
			
		}}
		)	
	
}
));

router.post('/', function(req,res,next){
    passport.authenticate('local-login', function(err, user, info){
        if(err) res.status(500).json(err);
        if(!user) {
            return res.status(401).json(info.message);
        }
        req.logIn(user, function(err){
            if(err) {
                return next(err);
            }
            return res.json('/users/' + user.username);
        });
    })(req,res,next);
})


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