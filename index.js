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

	pool.connect((error, client, done) => {
		if (error) {
			throw error;
		}
		client.query("SELECT * FROM item;", function callback(err, res) {
			done();
			if (err) {
				console.log(err.stack);
			}
			else {
				//console.log("Select Statement Successful");
				//console.log(res.rows[0]);
  				response.setHeader('Content-Type', 'application/json');
  				response.send(JSON.stringify({ result: res.rows }));
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
	/*
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
				//console.log("Select Statement Successful");
				//console.log(res.rows[0]);
  				response.setHeader('Content-Type', 'application/json');
  				response.send(JSON.stringify({ result: res.rows }));
  				console.log("created task?");
			}
		});
	});
	*/
});

app.put('/updateTask', (req, res) => {
	console.log("Updated Task");

});

app.delete('/deleteTask', (req, res) => {
	console.log("Deleted Task");
});

app.get('/calculateRate', function(request, response) {
  console.dir('test');
  var result = 0;
  var base = 0;
  //get the package type....
  var package = request.query.package;
  //get the numbers.. 
  var weight = request.query.weight;
  var weight = parseInt(weight);
  var rounded = Math.ceil(weight);
  var pounds = Math.ceil(weight / 16);

  //perform the calculation
  if (weight < 3.5 && package != 'flat') {
    if (package == 'stamped') {
      base = .28;
      result = base + rounded * .21;
    } else if (package == 'metered') {
      base = .25;
      result = base + rounded * .21;
    } else {
      result = 0;
    } 
  } else if (package != 'parcel') {
      base = .77;
      result = base + rounded * .21;
  } else {
    if (pounds < 5) {
      result = 3.00;
    } else {
      base = 3.00;
      rounded = rounded - 4;
      result = base + rounded * .16;
    }
  }
  //console the output
  console.log(result);
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify({ result: result }));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



/*
var express = require('express')
var app = express();
const path = require('path')
const PORT = process.env.PORT || 5001

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect((error, client, done) => {
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

app.get('/todoList', (req, res) => {
	// client.connect((error, client, done) => {
	// if (error) {
	// 	throw error;
	// }
	// client.query("SELECT * FROM item;", function callback(err, res) { 
	// 	console.log("Good Job");
	// 	done();
	// 	});
	// });
	//client.query("SELECT * FROM item;", function callback(err, res) {
	//	done();
	//	console.log("Called todo List");
	//});
	res.json({message: "testing"})
});

app.post('/createTask', (req, res) => {
	client.query("INSERT INTO item VALUES (DEFAULT, 'task', false);", function callback(err, res) {
		done();
		console.log("Created Task");
	});
});

app.put('/updateTask', (req, res) => {
	done();
	console.log("Updated Task");
});

app.delete('/deleteTask', (req, res) => {
	done();
	console.log("Deleted Task");
});

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/