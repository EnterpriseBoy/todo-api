var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req,res){
	res.send('To Do API Root');
});

app.get('/todos',function(req,res){
	res.json(todos);
});

app.get('/todos/:id',function(req,res){
	
	for (var i in todos) {
		if(todos[i].id == req.params.id){
			res.json(todos[req.params.id -1]);
		}
	}
	//res.send('Asking for todo with id of :' + req.params.id);
	res.status(404).send('No information');	
});

app.post('/todos',function(req,res){
	var body = req.body;
	body.id = todoNextId;
	todoNextId++;
	todos.push(body);
	console.log(todos);
	res.json(body);
});

app.listen(PORT, function(){
	console.log('Express Running on port: ' + PORT +'!');
});
