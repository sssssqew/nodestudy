var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.set('view engine', 'jade');	
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/form', function(req, res){
	res.render('form');
});

app.get('/form_receiver', function(req, res){
	// res.send('Hello Get !!');
	var title = req.query.title;
	var description = req.query.description;
	res.send(title + ", " + description);
});

app.post('/form_receiver', function(req, res){
	res.send(req.body.title + ', ' + req.body.description);
})

app.get('/topic/:id', function(req, res){
	var topics = [
		'Javascript is...',
		'Node.js is...',
		'Express is...'
	];
	var output = `
		<a href="/topic/0">Javascript</a><br>
		<a href="/topic/1">Nodejs</a><br>
		<a href="/topic/2">Express</a><br>
		${topics[req.params.id]}
	`
	res.send(output);
})

app.get('/topic/:id/:mode', function(req, res){
	res.send(req.params.id + ', ' + req.params.mode)
})

app.get('/template', function(req, res){
	res.render('temp', {time: Date(), title: 'My Express app'});
})

app.get('/', function(req, res){
	res.send('Hello, sylee!!');
})

app.get('/login', function(req, res){
	res.send('<h1>Login Please...</h1>');
})

app.get('/route', function(req, res){
	res.send('<img src="/jungsomin.png">')
})

app.get('/dynamic', function(req, res){
	var time = Date();
	lis = ''
	for (var i = 0; i <5; i++) {
		lis = lis + '<li>coding</li>'
	}
	var output = `
	<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>Document</title>
		</head>
		<body>
			<h1>Dynamic HTML File !!</h1>
			${lis}
			${time}
		</body>
		</html>
	`
	res.send(output);
})
app.get('/mp', function(req, res){
	res.render('mp')
})
app.listen(3000, '192.168.0.9', function(){
	console.log('Connected 3000 port !');
}); 
