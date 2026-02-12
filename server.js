const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'events.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/events', (req, res) => {
    const events = readData();
    res.json(events);
});

app.get('/events/:id', (req, res) => {
    const events = readData();
    const event = events.find(e => e.id == req.params.id);
    if (event) res.json(event);
    else res.status(404).send('Événement non trouvé');
});

app.post('/events', (req, res) => {
    const events = readData();
    const newEvent = {
        id: Date.now(),
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        votes: 0
    };
    events.push(newEvent);
    writeData(events);
    res.status(201).json(newEvent);
});

app.post('/events/:id/vote', (req, res) => {
    const events = readData();
    const index = events.findIndex(e => e.id == req.params.id);
    const { action } = req.body;

    if (index !== -1) {
        if (action === 'add') {
            events[index].votes += 1;
        } else if (action === 'remove' && events[index].votes > 0) {
            events[index].votes -= 1;
        }
        
        writeData(events);
        res.json(events[index]);
    } else {
        res.status(404).send('Événement non trouvé');
    }
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});