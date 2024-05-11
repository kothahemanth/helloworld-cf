const express = require('express');
const app = express();
const pg = require('pg');

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to database', err);
  }
}

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/createtable', async function (req, res) {
  try {
    const query = 'CREATE TABLE IF NOT EXISTS Persons (PersonID SERIAL PRIMARY KEY, LastName varchar(255), FirstName varchar(255), City varchar(30))';
    await client.query(query);
    res.send('Table Created');
  } catch (e) {
    console.error('Error creating table', e);
    res.status(500).send('Error creating table');
  }
});

app.get('/insertdata', async function (req, res) {
  try {
    const text = 'INSERT INTO Persons(LastName, FirstName, City) VALUES($1, $2, $3)';
    const values = ['Kotha', 'Hemanth', 'Hyderabad'];
    await client.query(text, values);
    res.send("Data Inserted");
  } catch (e) {
    console.error('Error inserting data', e);
    res.status(500).send('Error inserting data');
  }
});

app.get('/readdata', async function (req, res){
  try {
    const result = await client.query('SELECT * from Persons');
    res.json(result.rows);
  } catch (e) {
    console.error('Error reading data', e);
    res.status(500).send('Error reading data');
  }
});

const port = process.env.PORT || 3000;

app.listen(port, async function () {
  await connectToDatabase(); // Connect to the database when the app starts
  console.log('myapp listening on port ' + port);
});
