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

await connectToDatabase();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/createtable', async function (req, res) {
  await client.connect();
  try {
    const query = 'CREATE TABLE Persons (PersonID int, LastName varchar(255), FirstName varchar(255), City varchar(30))';
    await client.query(query);
  } catch (e) {
    res.send('Table Already Created');
  }
});

app.get('/insertdata', async function (req, res) {
    const text = 'INSERT INTO Persons(LastName, FirstName, City) VALUES($1, $2, $3)';
    const values = ['Kotha', 'Hemanth', 'Hyderabad'];
    await client.query(text, values);
    res.send("Data Inserted");

});

app.get('/readdata', async function (req, res){
  result = await client.query('SELECT * from Persons');
  res.send(result);
});

const port = process.env.PORT || 3000;

app.listen(port, async function () {
  await connectToDatabase(); // Connect to the database when the app starts
  console.log('myapp listening on port ' + port);
});
