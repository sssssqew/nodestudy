var express = require('express');
var session = require('express-session');
var OrientoStore = require('connect-oriento')(session);
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: '1234567890!@#$%^&*()_+=-abcdefghijklmnopqrstuvwxyz',
	resave: false,
	saveUninitialized: true,
    store: new OrientoStore({
            server: "host=localhost&port=2424&username=root&password=rkrrlska&db=02"
        }),
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
	req.session.save(function(){
		res.redirect('/welcome');
	})
})
app.get('/welcome', function(req, res){
	if(req.session.displayName){
		res.send(`
			<h1>Hello, ${req.session.displayName}</h1>
			<a href="/auth/logout">Log out</a>
		`)
	}else{
		res.send(`Welcome <a href="/auth/login">Login</a>`)
	}
	// res.send(req.session);
})
app.post('/auth/login', function(req, res){
	var user = {
		username: 'sylee',
		password: '111',
		displayName: 'Sylee'
	}
	var uname = req.body.username;
	var pwd = req.body.password;
	if(uname === user.username && pwd === user.password){
		req.session.displayName = user.displayName;
		// 세션작업이 완료되었을때 자동으로 시스템이 리디렉션하는게 좋다
		req.session.save(function(){
			res.redirect('/welcome');
		})
	}else{
		res.send('Who are you? <a href="/auth/login">Login</a>');
	}
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