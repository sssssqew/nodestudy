var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser('1234567890abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+=-'))

var products = {
	1: {title: 'apple'},
	2: {title: 'banana'},
	3: {title: 'orange'},
	4: {title: 'melon'}
}
app.get('/products', function(req, res){
	var output = '';
	for(var id in products){
		output += `
			<li>
				<a href="/cart/${id}">${products[id].title}</a>
			</li>`
	}
	res.send(`<h1>Proudcts</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
})
/*
cart = {
	id : qty,
}
*/
app.get('/cart/:id', function(req, res){
	var id = req.params.id;
	if(req.signedCookies.cart){
		var cart = req.signedCookies.cart;
	}else{
		var cart = {};
	}
	if(!cart[id]){
		cart[id] = 0;
	}
	cart[id] = parseInt(cart[id]) + 1;
	res.cookie('cart', cart, {signed:true})
	res.redirect('/cart');
})

app.get('/cart', function(req, res){
	var cart = req.signedCookies.cart;
	if(!cart){
		res.send('Empty!');
	}else{
		var output = '';
		for(var id in cart){
			output += `<li>${products[id].title} (${cart[id]})</li>`;
		}
	}
	res.send(`<h1>Cart</h1><ul>${output}</ul><a href="/products">Products List</a>`);
})
app.listen(3000, function(){
	console.log('Connected 3000 port !');
})