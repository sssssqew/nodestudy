var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var app = express();
var app = express()
app.use(bodyParser.urlencoded({ extended: true }));

var FileStore = require('session-file-store')(session);
 
app.use(session({
	secret: '1234567890!@#$%^&*()_+=-abcdefghijklmnopqrstuvwxyz',
	resave: false,
	saveUninitialized: true,
    store: new FileStore(),
}));

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
	delete req.session.displayName;
	res.redirect('/welcome')
})
app.get('/welcome', function(req, res){
	if(req.session.displayName){
		res.send(`
			<h1>Hello, ${req.session.displayName}</h1>
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
	// res.send(req.session);
})
app.post('/auth/login', function(req, res){
	var uname = req.body.username;
	var pwd = req.body.password;
	for (var i = 0; i < users.length; i++) {
		var user = users[i];
		if(uname === user.username){
			return hasher({password: pwd, salt: user.salt}, function(err, pass, salt, hash){
				if(hash === user.password){
					req.session.displayName = user.displayName;
					req.session.save(function(){
						res.redirect('/welcome');
					})
				}else{
					res.send('Please check out password again !! <a href="/auth/login">Login</a>');	
				}
			})
		}
	}
	res.send('Who are you? <a href="/auth/login">Login</a>');	
})

var users = [
	{
		username: 'sylee',
		password: 'TIYQCQjvg9glCX3mRBomt65gmupKMhcCv1epaOFjcmFOnPSKr+pHDzDGjgW34yBL2QrW2ckYzXJ8kZzjDmkYhub7dyPzakH6Bap5JmuFBZqqnZO6CqMu9ZlrVHo8LytFzXYRXwRZ48siS/foCyhFYm6UvA3jhN2dgnNxZinyarw=',
		salt: 'TGvkrMdr/WiZoFxKmohsTvspKwKc6RuHFu44QstmFdstOJg2g+B4CVCMdHfl0Hd5QVmCC5qybrPzM0i/+wF17Q==',
		displayName: 'SyleeLove'
	},
];
app.post('/auth/register', function(req, res){
	hasher({password: req.body.password}, function(err, pass, salt, hash){
		var user = {
			username: req.body.username,
			password: hash,
			salt: salt,
			displayName: req.body.displayName
		};
		users.push(user);
		req.session.displayName = user.displayName;
		req.session.save(function(){
			res.redirect('/welcome');
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
	`;
	res.send(output)
})
app.listen(3000, function(){
	console.log('Connected 3000 port !');
})