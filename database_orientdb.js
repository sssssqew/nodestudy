var OrientDB = require('orientjs');

var server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   'rkrrlska'
});

var db = server.use('o2')
console.log('Using Database:', db.name);

// var rec = db.record.get('#21:0')
//    .then(
//       function(record){
//          console.log('Loaded Record:', record);
//        }
//    );
// var sql = 'SELECT FROM topic WHERE @rid=:id';
// var param = {
// 	params:{
// 		id: '#21:0'
// 	}
// }
// db.query(sql, param).then(function(res){
// 	console.log(res);
// })
// var sql = 'INSERT INTO topic (title, description) VALUES(:title, :desc)';
// db.query(sql, {
// 	params:{
// 		title: 'Express',
// 		desc: 'Express is framework for web'
// 	}
// }).then(function(res){
// 	console.log(res)
// })
// var sql = 'UPDATE topic SET title=:title WHERE @rid=:id';
// db.query(sql, {
// 	params:{
// 		title: 'Express Update',
// 		id: '#21:1'
// 	}
// }).then(function(res){
// 	console.log(res);
// })
var sql = 'DELETE FROM topic WHERE @rid=:id';
db.query(sql, {params:{id: '#21:0'}}).then(function(res){
	console.log(res);
})