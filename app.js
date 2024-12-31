require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.static('public'));

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Mount routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

// 404 Page Not Found handler
app.use((req, res) => {
    const locals = {
        title: "404 - Page Not Found",
        description: "The page you are looking for does not exist."
    };
    res.status(404).render('404', { locals });
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});


// require('dotenv').config();

// const express = require('express');
// const expressLayout = require('express-ejs-layouts');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const methodOverride = require('method-override');


// const connectDB = require('./server/config/db');

// const app = express();
// const PORT = process.env.PORT || 5001;

// app.use(express.static('public'));

// //connect to DB
// connectDB();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(methodOverride('_method'));

// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI
//     }),
//     //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
// }));

// // Templating Engine
// app.use(expressLayout);
// app.set('layout', './layouts/main');
// app.set('view engine', 'ejs');

// app.use('/', require('./server/routes/main'));
// app.use('/', require('./server/routes/admin'));

// app.listen(PORT, ()=> {
//     console.log(`App listening on port ${PORT}`);
// });
