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
	//getting query params
	var queryParams = req.query;

	var filteredTodos = todos;

	if (queryParams.completed === 'true'){
		filteredTodos = _.where(todos,{'completed':true});
	}else{
		filteredTodos = _.where(todos,{'completed':false});
	}
	res.json(filteredTodos);
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

	//Removing any bad fields that are entered
	var body = _.pick(req.body,'description','completed')

	// Validation of data coming in using underscore
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().lenght === 0 ){
		return res.status(400).send();
	}
	
	//Removing the spaces at the start and end of field, not middle
	body.description = body.description.trim()

	//Add the id to the todos array
	body.id = todoNextId++;

	//Push the body into the array
	todos.push(body);

	//Return the array
	res.json(body);
});

app.delete('/todos/:id',function(req,res){

	//converting the id to an Int for comparison
	var todoId = parseInt(req.params.id, 10);
	//Finding the item in the array
	var matchedToDo = _.findWhere(todos,{id: todoId})

	if(matchedToDo){
		todos = _.without(todos,matchedToDo)
		//Send back status and item deleted
		res.json(matchedToDo);
	}else{
		//sending back and object so this can be used in main program
		res.status(404).json({"error":"not todo found wiht that id"})
	}
	
});


app.put('/todos/:id',function(req,res){

	//converting the id to an Int for comparison
	var todoId = parseInt(req.params.id, 10);

	var matchedToDo = _.findWhere(todos,{id: todoId})

	if(matchedToDo){
		//pick the description and completed from the body
		var body = _.pick(req.body,'description','completed')

		var validAttributes = {};

		if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
			validAttributes.completed = body.completed;
		}else if(body.hasOwnProperty('completed')){
			return res.status(400).send();
		}

		if(body.hasOwnProperty('description') && _.isString(body.description)  && body.description.trim().length > 0 ){
			validAttributes.description = body.description;
		}else if(body.hasOwnProperty('description')){
			return res.status(400).send();
		}

		_.extend(matchedToDo,validAttributes);

		res.json(matchedToDo);

	}else{
		res.status(404).send('No information');	
	}
	
});


app.listen(PORT, function(){
	console.log('Express Running on port: ' + PORT +'!');
});
