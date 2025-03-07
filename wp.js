// const express= require('express');
// const app =express();

// app.use(express.json())                        //for post method
// app.use(express.urlencoded({extended:true}))    //for post method

// app.use(express.static("public"))   //css files
// app.set("view engine", "ejs");//html rendering

// app.get('/',(req,res,next)=>{
//     console.log("middleware1")           //middleware
//     return next()
// }
//    , (req,res)=>{
//     res.send("home")
// })
// app.get('/portfolio',(req,res)=>{
//     res.render('portfolio')
// })
// app.get('/dashboard',(req,res)=>{
//     res.render('index')
// })
// app.post('/formdata',(req,res)=>{          //post method specially req.body 
//     console.log(req.body)
//     res.send('data recieved')
// })


// app.get('/Celebration',(req,res)=>{
//     res.render('celebration')
// })
// app.get('/Ceremonie',(req,res)=>{
//     res.render('ceremonie')
// })
// app.get('/Reception',(req,res)=>{
//     res.render('reception')
// })
// app.get('/Mitzvhans',(req,res)=>{
//     res.render('mitzvhans')
// })
// app.get('/Corporate',(req,res)=>{
//     res.render('corporate1')
// })
// app.listen(3000);



const express = require('express');
const fs = require('fs'); // File System module
const path = require('path');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Form data parsing
app.use(express.json()); // JSON data parsing
app.use(express.static('public')); // Static files ke liye

// 🏠 Route: Home Page (Form dikhega)
app.get('/', (req, res) => {
    res.render('index'); // Render EJS form
});

// 📩 Route: Form submit hone par data save karna
app.post('/formdata', (req, res) => {
    console.log("hiiiii");
    
    const newUser = req.body; // Form ka data yaha milega
    const filePath = path.join(__dirname, 'data.json');

    // Pehle check karein ki file exist karti hai ya nahi
    fs.readFile(filePath, 'utf8', (err, data) => {
        let users = [];

        if (!err && data) {
            users = JSON.parse(data); // Purana data parse karo
        }

        users.push(newUser); // Naya user add karo

        // Data file me dobara likho
        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Server Error');
            }
            res.send('Data Saved Successfully!');
        });
    });
});

// 🎉 Event Routes
app.get('/portfolio', (req, res) => res.render('portfolio'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/celebration', (req, res) => res.render('celebration'));
app.get('/ceremonie', (req, res) => res.render('ceremonie'));
app.get('/reception', (req, res) => res.render('reception'));
app.get('/mitzvhans', (req, res) => res.render('mitzvhans'));
app.get('/corporate', (req, res) => res.render('corporate1'));

// 🟢 Server Listen
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
