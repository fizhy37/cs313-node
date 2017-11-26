/**
 * @file A basic Express application that serves static files and JSON.
 */
'use strict';

// Required Node.js modules.
const express = require('express');
const path    = require('path');

// Sample JSON data. This file takes the place of some server-side data store,
// like a PostgreSQL database.
const data = require('./data.json');

// Application constants.
const PORT = process.env.PORT || 3000;

// Create a new application.
let app = express();

// Serve static files only.
app.use('/', express.static(path.join(__dirname, 'static')));

// Handle GET requests to /data.
app.get('/data', function(request, response) {

  // Retrieve the person from the URI query string.
  let person = request.query.person;

  // If there is a person, and the raw JSON data has such a key, return the
  // associated data.
  // If there is no person, or the raw JSON data has no such key, return
  // an error object.
  if (person !== undefined && data.hasOwnProperty(person)) {
    response.json(data[person]);
  } else {
    response.json(data['error']);
  }

  // End the response.
  response.end();
});

// Listen on the specified port.
app.listen(PORT, function() {
  console.log(`The application is now listening on port ${PORT}`);
});

/*
var express = require('express')
var app = express();
const path = require('path')
const PORT = process.env.PORT || 5000

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

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
  */