const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const morgan = require('morgan');

const app = express();

// Create a write stream for Morgan to log into access.log (append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

// Enable CORS
app.use(cors());

//  View engine + body parsing + static
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//  Morgan logger for all routes except static asset 404s
app.use(morgan('combined', {
    stream: accessLogStream,
    skip: function (req, res) {
        return path.extname(req.url); // skip static assets (e.g., .css, .js, images)
    }
}));

//  File paths
const contactFilePath = path.join(__dirname, 'contact1.json');
const eventFilePath = path.join(__dirname, 'data.json');
const dashboardFilePath = path.join(__dirname, 'dashboard.json');

//  Ensure required files exist
[contactFilePath, eventFilePath, dashboardFilePath].forEach(file => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '[]');
    }
});

// 🛣 Routes
app.get('/', (req, res) => res.render('index'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/about', (req, res) => res.render('About'));
app.get('/portfolio', (req, res) => res.render('portfolio'));

//  Dynamic Dashboard Route - We'll fetch data here!
app.get('/dashboard', (req, res) => {
    fs.readFile(dashboardFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading dashboard data:', err);
            return res.status(500).send('Error loading dashboard data.');
        }
        let dashboardData = [];
        try {
            dashboardData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing dashboard data:', parseError);
            return res.status(500).send('Error parsing dashboard data.');
        }
        // Render the dashboard and pass the data
        res.render('dashboard', { dashboardEntries: dashboardData });
    });
});

app.get('/celebration', (req, res) => res.render('celebration'));
app.get('/ceremonie', (req, res) => res.render('ceremonie'));
app.get('/reception', (req, res) => res.render('reception'));
app.get('/mitzvhans', (req, res) => res.render('mitzvhans'));
app.get('/corporate1', (req, res) => res.render('corporate1'));
app.get('/services', (req, res) => res.render('services'));

// Save contact data
app.post('/contactone', (req, res, next) => {
    const newUser = req.body;
    console.log("New Contact Submission:", newUser);

    fs.readFile(contactFilePath, 'utf8', (err, data) => {
        if (err) return next(err);
        let users = [];

        try {
            users = data ? JSON.parse(data) : [];
        } catch (parseError) {
            parseError.status = 500;
            return next(parseError);
        }

        users.push(newUser);

        fs.writeFile(contactFilePath, JSON.stringify(users, null, 2), err => {
            if (err) return next(err);
            res.send('Contact Data Saved Successfully!');
        });
    });
});

// Save event data
app.post('/formdata', (req, res, next) => {
    const { eventPurpose, guests, date, budget } = req.body;
    const missingFields = [];

    if (!eventPurpose) missingFields.push('eventPurpose');
    if (!guests) missingFields.push('guests');
    if (!date) missingFields.push('date');
    if (!budget) missingFields.push('budget');

    if (missingFields.length > 0) {
        const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
        error.status = 400;
        error.details = missingFields;
        return next(error);
    }

    const newEvent = req.body;
    console.log(" New Event Submission:", newEvent);

    fs.readFile(eventFilePath, 'utf8', (err, data) => {
        if (err) return next(err);
        let events = [];

        try {
            events = data ? JSON.parse(data) : [];
        } catch (parseError) {
            parseError.status = 500;
            return next(parseError);
        }

        events.push(newEvent);

        fs.writeFile(eventFilePath, JSON.stringify(events, null, 2), err => {
            if (err) return next(err);
            res.send('Event Data Saved Successfully!');
        });
    });
});

// Save dashboard data (separate logging)
const dashboardLogger = morgan(':method :url :status :res[content-length] - :response-time ms');

app.post('/dashboard-submit', dashboardLogger, (req, res, next) => {
    const newDashboardEntry = req.body;
    console.log("New Dashboard Entry:", newDashboardEntry);

    fs.readFile(dashboardFilePath, 'utf8', (err, data) => {
        if (err) return next(err);
        let dashboardEntries = [];

        try {
            dashboardEntries = data ? JSON.parse(data) : [];
        } catch (parseError) {
            parseError.status = 500;
            return next(parseError);
        }

        dashboardEntries.push(newDashboardEntry);

        fs.writeFile(dashboardFilePath, JSON.stringify(dashboardEntries, null, 2), err => {
            if (err) return next(err);
            res.redirect('/dashboard'); // Redirect back to the dashboard to see the updated data
        });
    });
});

// Fetch events with filtering
app.get('/events', (req, res, next) => {
    fs.readFile(eventFilePath, 'utf8', (err, data) => {
        if (err) return next(err);
        let events = [];

        try {
            events = JSON.parse(data);
        } catch (parseError) {
            parseError.status = 500;
            return next(parseError);
        }

        for (let key in req.query) {
            if (req.query[key]) {
                events = events.filter(event => event[key]?.toString().toLowerCase() === req.query[key].toLowerCase());
            }
        }

        res.json(events);
    });
});

// Handle 404 for non-static routes
app.use((req, res, next) => {
    const ext = path.extname(req.url);
    if (ext) {
        return res.status(404).end();
    }

    const error = new Error("Page Not Found");
    error.status = 404;
    next(error);
});

//  Centralized Error Handler
app.use((err, req, res, next) => {
    if (!path.extname(req.url)) {
        console.error('Error:', err.message);
    }

    if (err.status === 404) {
        return res.status(404).send('Page Not Found');
    }

    res.status(err.status || 500).send(err.message);
});

// Start server
app.listen(3000, () => {
    console.log(' Server running on http://localhost:3000');
});