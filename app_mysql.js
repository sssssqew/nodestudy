var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'rkrrlska',
  database : 'o2'
});

conn.connect();
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views_mysql');
app.set('view engine', 'jade');

app.get('/topic/add', function(req, res){
	var sql = 'SELECT id, title FROM topic';
	conn.query(sql, function(err, topics, fields){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}else{
			res.render('add', {topics:topics});
		}
	});
})
app.post('/topic/add', function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ? ,?)';
	var params = [title, description, author];
	conn.query(sql, params, function(err, result, fields){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}else{
			res.redirect('/topic/'+result.insertId);
		}
	})
})

app.get('/topic/:id/edit', function(req, res){
	var sql = 'SELECT id, title FROM topic';
	conn.query(sql, function(err, topics, fields){
		var id = req.params.id;
		if(id){
			var sql = 'SELECT * FROM topic WHERE id=?';
			var params = [id];
			conn.query(sql, params, function(err, topic, fields){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				}else{
					res.render('edit', {topics:topics, topic:topic[0]});
				}
			})
		}else{
			res.render('edit', {topics:topics});
		}
	})
})
app.post('/topic/:id/edit', function(req, res){
	var sql = 'UPDATE topic SET title=?, description=?, author=? \
	WHERE id=?';
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var id = req.params.id;
	conn.query(sql, [title, description, author, id], function(err, result, fields){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}else{
			res.redirect('/topic/'+id);
		}
	})
})
app.get('/topic/:id/delete', function(req, res){
	var sql = 'SELECT id, title FROM topic';
	var id = req.params.id;
	conn.query(sql, function(err, topics, fields){
		var sql = 'SELECT * FROM topic WHERE id=?';
		conn.query(sql, [id], function(err, topic){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			}else{
				if(topic.length === 0){
					console.log('There is no record.')
					res.status(500).send('Internal Server Error');
				}else{
					res.render('delete', {topics:topics, topic:topic[0]});
				}
			}
		})
	})
})

app.post('/topic/:id/delete', function(req, res){
	var id = req.params.id;
	var sql = 'DELETE FROM topic WHERE id=?';
	conn.query(sql, [id], function(err, result){
		res.redirect('/topic/')
	})
})
app.get(['/topic', '/topic/:id'], function(req, res){
	var sql = 'SELECT id, title FROM topic';
	conn.query(sql, function(err, topics, fields){
		var id = req.params.id;
		if(id){
			var sql = 'SELECT * FROM topic WHERE id=?';
			var params = [id];
			conn.query(sql, params, function(err, topic, fields){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				}else{
					res.render('list', {topics:topics, topic:topic[0]});
				}
			})
		}else{
			res.render('list', {topics:topics});
		}
	})
})


app.listen(3000, function(){
	console.log('connected port 3000 !!');
})