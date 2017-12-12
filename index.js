require('dot-env');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var router = express.Router();

const {Pool} = require('pg');
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const pool = new Pool({
	connectionString : connectionString,
});

pool.connect((error, client, done) => {
	if (error) {
		throw error;
	}
	client.query("SELECT 1 from information_schema.tables WHERE table_name = 'item';", function callback(err, res) { 
		if (res.rowCount == 0) {
			client.query("CREATE TABLE IF NOT EXISTS item (id SERIAL, task VARCHAR(255), is_done BOOLEAN);", function callback(err, res) {
				client.query("INSERT INTO item (id, task, is_done) VALUES (DEFAULT, 'homework', false);", function callback(err, res) {
					done();
					console.log("Table initialized");
				});
			})
		} else {
			console.log("Table Exists");
		}
	});
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/todoList', function(request, response) {
  console.log('todoList');
  
  var order = request.query.order;
  // var filter_order = 'SELECT * FROM item ORDER BY is_done ASC, id ' +order+ ';';
  var filter_done = "";

  if (request.query.hide_done == 'true') {
  	filter_done = 'SELECT * FROM item WHERE is_done = false ORDER BY id ' +order+ ';';
  } else {
  	filter_done = 'SELECT * FROM item ORDER BY id ' +order+ ';';
  }

	pool.connect((error, client, done) => {
		if (error) {
			throw error;
		}
		client.query(filter_done, function callback(err, res) {
			done();
			if (err) {
				console.log(err.stack);
			}
			else {
  				response.setHeader('Content-Type', 'application/json');
  				response.send(JSON.stringify({ result: res.rows, success: true, status: 200 }));
  				console.log("sent results");
			}
		});
	});
  	//response.render('pages/results', { result: result });
});

app.post('/createTask', (request, response) => {
	console.log("Create Task");
	var task = request.body.task;
	console.log(task);
	pool.connect((error, client, done) => {
		if (error) {
			throw error;
		}
		client.query("INSERT INTO item VALUES ( DEFAULT, '" + task + "', false);", function callback(err, res) {
			done();
			if (err) {
				console.log(err.stack);
			}
			else {
  				response.setHeader('Content-Type', 'application/json');
  				response.send(JSON.stringify({ result: res.rows, success: true, status: 200 }));
  				console.log("created task");
			}
		});
	});
});

app.put('/setDone', (request, response) => {
	console.log("Setting Done");
	//var taskID = request.body.taskList;
	//var taskName = request.body.taskName;
	var given_id = request.body.id;
	var is_done = request.body.is_done;
	//console.log(taskID);
	//console.log(taskName);
	console.log(given_id);
	pool.connect((error, client, done) => {
		if (error) {
			throw error;
		}
		client.query("UPDATE item SET is_done = " +is_done+ " WHERE id = " +given_id+ ";", function callback(err, res) {
			done();
			if (err) {
				console.log(err.stack);
			} else {
  				console.log("Set Done");
  				response.json({ success: true, status: 200 });
			}
		});
	});
});

app.put('/updateTask', (request, response) => {
	console.log("Updating Task");
	//var taskID = request.body.taskList;
	var taskName = request.body.taskName;
	var given_id = request.body.id;
	//console.log(taskID);
	console.log(taskName);
	console.log(given_id);
	pool.connect((error, client, done) => {
		if (error) {
			throw error;
		}
		client.query("UPDATE item SET task = '" +taskName+ "' WHERE id = " + given_id + ";", function callback(err, res) {
			done();
			if (err) {
				console.log(err.stack);
			} else {
  				console.log("Updated task");
  				response.json({ success: true, status: 200 });
			}
		});
	});
});

app.delete('/deleteTask', (request, response) => {
	console.log("Deleting Task");
	var taskID = request.body.id;
	console.log(taskID);

	pool.connect((error, client, done) => {
		if (error) {
			throw error;
		}
		client.query("DELETE FROM item WHERE id = " +taskID+ ";", function callback(err, res) {
			done();
			if (err) {
				console.log(err.stack);
			} else {
				console.log("Deleted task");
				response.json({ success: true, status: 200 });
			}
		});
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});