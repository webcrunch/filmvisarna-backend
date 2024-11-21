const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dataFilePath = path.join(__dirname, 'json', 'data.json');

// Endpoint för att läsa JSON-filen
app.get('/data', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint för att skriva till JSON-filen
app.post('/data', (req, res) => {
    const newData = req.body;
    fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
        if (err) {
            return res.status(500).send('Error writing file');
        }
        res.send('Data saved successfully');
    });
});

module.exports.handler = serverless(app);
