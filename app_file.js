var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views_file');
app.set('view engine', 'jade');

app.get('/topic/new', function(req, res){
	fs.readdir('data', function(err, files){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.render('new', {topics:files});
	});
})
app.get(['/topic', '/topic/:item'], function(req, res){
	fs.readdir('data', function(err, files){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		var item = req.params.item;
		if(item){
			fs.readFile('data/'+item, 'utf8', function(err, data){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				}
				res.render('list', {topics:files, title:item, desc:data});
			})
		}else{
			res.render('list', {topics:files, title:'Hello', desc:'Welcome to my site'});	
		}
	})
})
app.post('/topic', function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	fs.writeFile('data/'+title, description, function(err){
		if(err){
			res.status(500).send('Internal Server Error');
		}
		res.redirect('/topic/'+title);
	})
})

app.listen(3000, function(){
	console.log('connected port 3000 !!');
})