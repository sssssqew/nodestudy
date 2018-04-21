require('dotenv').config()
var CERTPASS = process.env.CERTPASS;

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var passport = require('passport');
var fs = require('fs');
var https = require('https');
var LocalStrategy = require('passport-local').Strategy;
FacebookStrategy = require('passport-facebook').Strategy;
var FileStore = require('session-file-store')(session);

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: '1234567890!@#$%^&*()_+=-abcdefghijklmnopqrstuvwxyz',
	resave: false,
	saveUninitialized: true,
    store: new FileStore(),
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/count', function(req, res){
	// 사용자 id 와 연결되는 세션값을 서버에 저장함
	if(req.session.count){
		req.session.count += 1;
	}else{ 
		req.session.count = 1;
	}
	res.send('session count: '+ req.session.count);
})

app.get('/tmp', function(req, res){
	// 같은 사용자가 세션값을 요청하면 id를 확왼하고 
	// 해당 세션값을 브라우저에 넘겨줌 
	res.send("result: "+req.session.count);
})

app.get('/auth/logout', function(req, res){
	req.logout();
	// 로그아웃되면서 세션이 제거되는 시간이 필요함 
	// 세션이 제거되면 리디렉션한다 
	req.session.save(function(){
		res.redirect('/welcome');
	})
})
app.get('/welcome', function(req, res){
	// 로그인된 상태라면 재접속할때마다 
	// deserializeUser 함수가 실행되면서 req.user가 반환한다 
	if(req.user && req.user.displayName){
		res.send(`
			<h1>Hello, ${req.user.displayName}</h1>
			<h2>email: ${req.user.email}</h2>
			<a href="/auth/logout">Log out</a>
		`)
	}else{
		res.send(`
			<h1>Welcome</h1>
			<ul>
				<li><a href="/auth/login">Login</a></li>
				<li><a href="/auth/register">Register</a></li>	
			</ul> 
			`)
	}
})

// 두번째로 이 코드가 실행됨 
// 로그인에 성공하면 이 코드가 실행되면서 세션에 사용자 id 저장
passport.serializeUser(function(user, done) {
	console.log('serializeUser ', user)
  	done(null, user.authId);
});

// 로그인 이후에 다시 사이트에 접속하면 이 코드가 실행됨 
passport.deserializeUser(function(id, done) {
	console.log('deserializeUser ', id)
  for (var i = 0; i < users.length; i++) {
  	var user = users[i];
  	// 재접속할때마다 connect.id 쿠키와 대응되는 
  	// 세션에 저장된 user.authId 값을 찾고, user.authId 값으로  
  	// db를 검색해서 접속한 사용자 정보를 가져온다  
  	if(user.authId === id){
  		console.log("session exists with "+user.displayName);
  		// passport는 db에서 가져온 사용자 정보를 req.user로 반환한다 
  		return done(null, user);
  	}
  }
  done('There is no user :(')
});

// 처음으로 이 코드가 실행됨 
passport.use(new LocalStrategy(
	function(username, password, done){
		var uname = username;
		var pwd = password;
		for (var i = 0; i < users.length; i++) {
			var user = users[i];
			if(uname === user.username){
				return hasher({password: pwd, salt: user.salt}, function(err, pass, salt, hash){
					if(hash === user.password){
						console.log('LocalStrategy ', user)
						done(null, user);
					}else{
						done(null, false);
					}
				})
			}
		}
		done(null, false);
	}
));
passport.use(new FacebookStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'email', 'gender', 'link', 'locale',
    	'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log("i'm back from facebook !!")
    console.log(profile);
    var authId = 'facebook:'+profile.id;
    for (var i = 0; i < users.length; i++) {
    	var user = users[i];
    	if(user.authId === authId){
    		return done(null, user);
    	}
    }
    var newuser = {
    	'authId':authId,
    	'displayName':profile.displayName,
    	'email':profile.emails[0].value,
    }
    users.push(newuser);
    done(null, newuser); 
  }
));

// 미들웨어 실행 
app.post('/auth/login',
	// 인증과정 
  passport.authenticate('local', { successRedirect: '/welcome',
                                   failureRedirect: '/auth/login',
                                   failureFlash: false })
)

// 페이스북 앱 검수 -> 승인된 항목 -> 로그인 권한 리스트에 있는 것들만 scope으로 요청 가능함
app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
// 이 부분에서 /auth/facebook/callback으로 페이스북에 인증을 요청한다
// 사용자 정보가 표시된 팝업창을 클릭하면 이 부분으로 돌아온다 
// 그래서 페이스북 로그인 설정 -> 유효한 OAuth 리디렉션 URI에 
// 다시 돌아올 URL인 https://www.example.com/auth/facebook/callback을 등록해준다
// 만약 성공하면 welcome으로 가고 실패하면 다시 로그인 페이지로 간다 
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/welcome',
                                      failureRedirect: '/auth/login' }));

var users = [
	{
		authId: 'local:sylee',
		username: 'sylee',
		password: 'TIYQCQjvg9glCX3mRBomt65gmupKMhcCv1epaOFjcmFOnPSKr+pHDzDGjgW34yBL2QrW2ckYzXJ8kZzjDmkYhub7dyPzakH6Bap5JmuFBZqqnZO6CqMu9ZlrVHo8LytFzXYRXwRZ48siS/foCyhFYm6UvA3jhN2dgnNxZinyarw=',
		salt: 'TGvkrMdr/WiZoFxKmohsTvspKwKc6RuHFu44QstmFdstOJg2g+B4CVCMdHfl0Hd5QVmCC5qybrPzM0i/+wF17Q==',
		displayName: 'SyleeLove'
	},
];
app.post('/auth/register', function(req, res){
	hasher({password: req.body.password}, function(err, pass, salt, hash){
		var user = {
			authId: 'local:'+req.body.username,
			username: req.body.username,
			password: hash,
			salt: salt,
			displayName: req.body.displayName
		};
		users.push(user); // db에 사용자 등록함 
		// 자동으로 로그인 시킨다 
		req.login(user, function(err){
			// 세션이 생성되는 시간이 필요함 
			// 세션이 생성되면 리디렉션함 
			req.session.save(function(){
				res.redirect('/welcome');
			})
		})
	})
})
app.get('/auth/register', function(req, res){
	var output = `
		<h1>Register</h1>
		<form action="/auth/register" method="post">
			<p>
				<input type="text" name="username" placeholder="username">
			</p>
			<p>
				<input type="password" name="password" placeholder="password">
			</p>
			<p>
				<input type="text" name="displayName" placeholder="displayName">
			</p>
			<p>
				<input type="submit">
			</p>
		</form>
	`;
	res.send(output);
})
app.get('/auth/login', function(req, res){
	var output = `
		<h1>Login</h1>
		<form action="/auth/login" method="POST">
			<p>
				<input type="text" name="username" placeholder="username">
			</p>
			<p>
				<input type="password" name="password" placeholder="password">
			</p>
			<p>
				<input type="submit">
			</p>
		</form>
		<a href="/auth/facebook">facebook</a>
	`;
	res.send(output)
})
	
var options = { 
	ca: fs.readFileSync('ssl/ca-chain.cert.pem'),
    key: fs.readFileSync('ssl/www.example.com.key.pem'), 
    cert: fs.readFileSync('ssl/www.example.com.cert.pem'), 
    passphrase: CERTPASS
}; 

https.createServer(options, app).listen(443, () => {
	console.log('Connected 443 port !');
});

// app.listen(3000, function(){
// 	console.log('Connected 3000 port !');
// })

