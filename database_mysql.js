var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'rkrrlska',
  database : 'o2'
});

conn.connect();

// var sql = 'SELECT * FROM topic';
// conn.query(sql, function(err, rows, fields){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		for (var i = 0; i < rows.length; i++) {
// 			console.log(rows[i].title);
// 			console.log(rows[i].description);
// 			console.log(rows[i].author);
// 		}
// 	}
// })
// var sql = 'INSERT INTO topic (title, description, author) \
// VALUES(?, ?, ?)';
// var params = ['Supervisor', 'Watcher', 'egoing'];
// conn.query(sql, params, function(err, rows, fields){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log(rows.insertId);
// 	}
// })
// var sql = 'UPDATE topic SET description=?, author=? \
// WHERE id=?';
// var params = ['watch out', 'wow', 4];
// conn.query(sql, params, function(err, rows, fields){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log(rows.insertId);
// 	}
// })
var sql = 'DELETE FROM topic WHERE id=?';
var params = [4];
conn.query(sql, params, function(err, rows, fields){
	if(err){
		console.log(err);
	}else{
		console.log(rows.insertId);
	}
})

conn.end();