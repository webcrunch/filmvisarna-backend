const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const dataFilePath = './json/data.json';

// Endpoint för att läsa JSON-filen
app.get('/data', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.send(JSON.parse(data));
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
