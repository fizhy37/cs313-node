var express = require('express')
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', ejs);
app.get('/', function(request, response) {
	response.render('pages/index');
});


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
	client.query("SELECT * FROM item;", function callback(err, res) {
		done();
		console.log("Called todo List");
	});
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

/*
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});