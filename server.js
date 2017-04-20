var express = require('express');
var bodyParser = require('body-parser');
var _ = require ('underscore');

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
	
	//converting the id to an Int for comparison
	var todoId = parseInt(req.params.id, 10);

	var matchedToDo = _.findWhere(todos,{id: todoId})

	if(matchedToDo){
		res.json(matchedToDo);
	}else{
		res.status(404).send('No information');	
	}
	
});

app.post('/todos',function(req,res){

	var body = req.body;

	// Validation of data coming in using underscore
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().lenght === 0 ){
		return res.status(400).send();
	}

	//Add the id to the todos array
	body.id = todoNextId++;

	//Push the body into the array
	todos.push(body);

	res.json(body);
});

app.listen(PORT, function(){
	console.log('Express Running on port: ' + PORT +'!');
});
