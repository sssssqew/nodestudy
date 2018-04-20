var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var OrientDB = require('orientjs');

var server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   'rkrrlska'
});

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views_orientdb');
app.set('view engine', 'jade');

var db = server.use('o2')
console.log('Using Database:', db.name);

app.get('/topic/add', function(req, res){
	var sql = 'SELECT FROM topic';
	db.query(sql).then(function(topics){
		res.render('add', {topics:topics});
	});
})
app.post('/topic/add', function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var sql = 'INSERT INTO topic (title, description, author) VALUES(:title, :desc, :author)';
	db.query(sql, {
		params:{
			title:title,
			desc:description,
			author:author
		}
	}).then(function(results){
		res.redirect('/topic/'+ encodeURIComponent(results[0]['@rid']));
	})
})

app.get('/topic/:id/edit', function(req, res){
	var sql = 'SELECT FROM topic';
	var id = req.params.id;
	db.query(sql).then(function(topics){
		var sql = 'SELECT FROM topic WHERE @rid=:id';
		db.query(sql, {params:{id: id}}).then(function(topic){
			res.render('edit', {topics:topics, topic:topic[0]})
		})
	});
})

app.post('/topic/:id/edit', function(req, res){
	var sql = 'UPDATE topic SET title=:t, description=:d, author=:a WHERE @rid=:id';
	var id = req.params.id;
	var title = req.body.title;
	var desc = req.body.description;
	var author = req.body.author;
	db.query(sql, {
		params:{
			t: title,
			d: desc,
			a: author,
			id: id
		}
	}).then(function(topics){
		res.redirect('/topic/'+encodeURIComponent(id));
	});
})
app.get('/topic/:id/delete', function(req, res){
	var sql = 'SELECT FROM topic';
	var id = req.params.id;
	db.query(sql).then(function(topics){
		var sql = 'SELECT FROM topic WHERE @rid=:id';
		db.query(sql, {params:{id: id}}).then(function(topic){
			res.render('delete', {topics:topics, topic:topic[0]})
		})
	});
})

app.post('/topic/:id/delete', function(req, res){
	var id = req.params.id;
	var sql = 'DELETE FROM topic WHERE @rid=:id';
	db.query(sql, {
		params:{
			id:id
		}
	}).then(function(results){
		res.redirect('/topic/');
	})
})

app.get(['/topic', '/topic/:id'], function(req, res){
	var sql = 'SELECT FROM topic';
	db.query(sql).then(function(topics){
		var id = req.params.id;
		if(id){
			var sql = 'SELECT FROM topic WHERE @rid=:id';
			db.query(sql, {params:{id: id}}).then(function(topic){
				res.render('list', {topics:topics, topic:topic[0]})
			})
		}else{
			res.render('list', {topics:topics})
		}
		
	});
})


app.listen(3000, function(){
	console.log('connected port 3000 !!');
})