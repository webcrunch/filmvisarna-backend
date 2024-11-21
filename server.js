import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.normalize(__dirname.split("src")[0]);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = 5000;

const getPath = file => path.join(rootPath, 'json', file);

// Utility function to read JSON files
const readJsonFile = async (filePath) => {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
};

// Utility function to write JSON files
const writeJsonFile = async (filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// API Endpoints
app.get("/api/hello", (req, res) => {
    res.status(200).json(true);
});

app.post("/api/handle_bookings", async (req, res) => {
    const filePath = getPath('bookings.json');
    const bookings = await readJsonFile(filePath);
    bookings.push(req.body);
    await writeJsonFile(filePath, bookings);
    res.status(200).json({ status: "confirmed" });
});

app.post("/api/handle_booking/:id", async (req, res) => {
    const filePath = getPath('bookings.json');
    const bookings = await readJsonFile(filePath);
    const booking = bookings.find(book => book.id === req.params.id);
    Object.assign(booking, req.body);
    await writeJsonFile(filePath, bookings);
    res.status(200).json({ status: "updated" });
});

app.get('/api/bookings_informations', async (req, res) => {
    const bookings = await readJsonFile(getPath('bookings.json'));
    res.status(200).json(bookings);
});

app.get("/api/bookings_information/:id", async (req, res) => {
    const bookings = await readJsonFile(getPath('bookings.json'));
    res.status(200).json(bookings.find(b => b.id == req.params.id));
});

app.get('/api/movies', async (req, res) => {
    const movies = await readJsonFile(getPath('movies.json'));
    res.status(200).json(movies);
});

app.post('/api/book', async (req, res) => {
    const filePath = getPath('screening.json');
    const screenings = await readJsonFile(filePath);
    screenings.forEach(screen => {
        if (screen.id === req.body.id) {
            screen.occupiedSeats = req.body.bookedArray;
        }
    });
    await writeJsonFile(filePath, screenings);
    res.status(200).json({ data: screenings, message: "places booked" });
});

app.get('/api/saloons', async (req, res) => {
    const saloons = await readJsonFile(getPath('saloons.json'));
    res.status(200).json(saloons);
});

app.get('/api/screenings', async (req, res) => {
    const screenings = await readJsonFile(getPath('screening.json'));
    res.status(200).json(screenings);
});

app.get('/api/movie/:id', (req, res) => {
    res.status(200).json(req.params.id);
});

app.get('/api/users', async (req, res) => {
    const users = await readJsonFile(getPath('users.json'));
    res.status(200).json(users);
});

app.get('/api/user/:id', async (req, res) => {
    const users = await readJsonFile(getPath('users.json'));
    const user = users.users.find(user => user.id === Number(req.params.id));
    res.status(200).json(user);
});

app.post('/api/userbooking', async (req, res) => {
    const filePath = getPath('users.json');
    const users = await readJsonFile(filePath);
    const user = users.users.find(user => user.id === req.body.id);
    user.bookings.push(req.body.booking);
    await writeJsonFile(filePath, users);
    res.status(200).json({ status: "movie booked", data: users });
});

app.post('/api/register', async (req, res) => {
    const filePath = getPath('users.json');
    const users = await readJsonFile(filePath);
    users.users.push(req.body);
    await writeJsonFile(filePath, users);
    res.status(200).json({ status: `user: ${req.body.username} registered`, data: users });
});

app.listen(PORT, () => console.log(`Express server listening on http port: ${PORT}`));
