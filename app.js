const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// 🛡 Middleware for Logging Requests
const requestLogger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

// 🛡 Middleware to Validate Event Form Data Before Submitting
const validateFormData = (req, res, next) => {
    const { eventPurpose, guests, date, budget } = req.body;

    if (!eventPurpose || !guests || !date || !budget) {
        return res.status(400).send('Please fill out all required fields.');
    }

    next();
};

// 🛡 Middleware to Validate Dashboard Form Data
const validateDashboardFormData = (req, res, next) => {
    const { eventName, organizer, venue, date, attendees, budget } = req.body;

    if (!eventName || !organizer || !venue || !date || !attendees || !budget) {
        return res.status(400).send('All fields are required. Please fill out every field before submitting.');
    }

    next();
};

// Apply Logging Middleware Globally
app.use(requestLogger);

const contactFilePath = path.join(__dirname, 'contact1.json');
const eventFilePath = path.join(__dirname, 'data.json');
const dashboardFilePath = path.join(__dirname, 'dashboard.json');

// Ensure required JSON files exist
if (!fs.existsSync(contactFilePath)) {
    fs.writeFileSync(contactFilePath, '[]');
}

if (!fs.existsSync(eventFilePath)) {
    fs.writeFileSync(eventFilePath, '[]');
}

if (!fs.existsSync(dashboardFilePath)) {
    fs.writeFileSync(dashboardFilePath, '[]');
}

//  Route: Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// Save Contact Form Data
app.post('/contactone', (req, res) => {
    const newUser = req.body;

    fs.readFile(contactFilePath, 'utf8', (err, data) => {
        let users = [];

        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            return res.status(500).send('Server Error');
        }

        try {
            users = data ? JSON.parse(data) : [];
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return res.status(500).send('Server Error');
        }

        users.push(newUser);

        fs.writeFile(contactFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Server Error');
            }
            res.send('Contact Data Saved Successfully!');
        });
    });
});

//  Save Event Form Data with Validation and Log Only the New Event
app.post('/formdata', validateFormData, (req, res) => {
    const newEvent = req.body;

    fs.readFile(eventFilePath, 'utf8', (err, data) => {
        let events = [];

        if (!err && data) {
            events = JSON.parse(data);
        }

        events.push(newEvent);

        fs.writeFile(eventFilePath, JSON.stringify(events, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Server Error');
            }

            console.log('New Event Data:', newEvent); // Log only the new event data
            res.send('Event Data Saved Successfully!');
        });
    });
});

// Save Dashboard Form Data with Validation
app.post('/dashboard-submit', validateDashboardFormData, (req, res) => {
    const newDashboardEntry = req.body;

    fs.readFile(dashboardFilePath, 'utf8', (err, data) => {
        let dashboardEntries = [];

        if (!err && data) {
            dashboardEntries = JSON.parse(data);
        }

        dashboardEntries.push(newDashboardEntry);

        fs.writeFile(dashboardFilePath, JSON.stringify(dashboardEntries, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Server Error');
            }

            console.log('New Dashboard Entry:', newDashboardEntry); // Log only the new dashboard data
            res.send('Dashboard Data Submitted Successfully!');
        });
    });
});

//  Fetch Events with Query Parameters
app.get('/events', (req, res) => {
    fs.readFile(eventFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Server Error');
        }

        let events = JSON.parse(data);

        // Apply filters based on query parameters
        for (let key in req.query) {
            if (req.query[key]) {
                events = events.filter(event => event[key]?.toString().toLowerCase() === req.query[key].toLowerCase());
            }
        }

        res.json(events);
    });
});

//  Additional Routes
app.get('/contact', (req, res) => res.render('contact'));
app.get('/about', (req, res) => res.render('About'));
app.get('/portfolio', (req, res) => res.render('portfolio'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/celebration', (req, res) => res.render('celebration'));
app.get('/ceremonie', (req, res) => res.render('ceremonie'));
app.get('/reception', (req, res) => res.render('reception'));
app.get('/mitzvhans', (req, res) => res.render('mitzvhans'));
app.get('/corporate1', (req, res) => res.render('corporate1'));
app.get('/services', (req, res) => res.render('services'));

// Server Listen
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// Example API Calls:
// ➜ http://localhost:3000/events
// ➜ http://localhost:3000/events?eventPurpose=wedding
// ➜ http://localhost:3000/events?date=2025-03-12
// ➜ http://localhost:3000/events?budget=100000
// ➜ http://localhost:3000/events?eventPurpose=Wedding&date=2025-03-12&budget=100000
