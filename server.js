// Third party imports
require('dotenv').config({ path: './config.env' });
const express = require('express');
const bodyParser = require('body-parser');
// const upload = require('multer')();
const session = require('express-session');
const sqlite = require('sqlite3');

// node inbuilt package imports
const path = require('path');

// filesystem imports

const models = require('./models'); // import all the models

// Creating an express app
const app = express();

global.__basedir = __dirname;

// Configuring the views folder using which the controllers serve the webpages
app.set("views", path.join(__dirname, "views"));
// By setting view engine here, there is no need to mention file extension again in controllers
app.set('view engine', 'ejs');

// Setting up the static files
app.use(express.static(path.join(__dirname, "public")));

// Adding a json middleware for parsing application/json data
app.use(express.json());
// For parsing application/xwww-form-urlencoded data
app.use(bodyParser.urlencoded({ extended: true }));
// For parsing multipart/form-data
// app.use(upload.array());
// Adding express-session middleware

app.use(session({
    name: process.env.SESSION_NAME || 'sid',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // max age is in milliseconds. So, here maxAge is 24 hrs
        sameSite: true,
        secure: (process.env.NODE_ENV === 'production' ? false : false)
    }
}));
// Setting port as a key 'port' to the app
app.set('port', process.env.PORT || 5050);

// Adding user to the response locals.
// So that, it can be accessible in the other routes
app.use(async (request, response, next) => {
    const { userId } = request.session;
    if (userId) {
        await models.User.findOne({ where: { id: userId } }).then((user) => {
            response.locals.user = user;
        });
    }
    next();
});

// Setting up the routes
app.use('/', require('./routes/main'));
app.use('/admin', require('./routes/admin/index'));



// 404 middleware
app.use((request, response, next) => {
    response.status(404)
        .send("Oops! The page you are looking for doesn't exist");
    next();
});


// Listening at the port set before
app.listen(app.get('port'), () => {

    // Creates all the tables required, if not exist
    models.sequelize.sync().then(() => {
        // Logging after promise resolve
        console.log('DB sequelized\n');
    }).catch((err) => {
        // loggin if there is any error while sequelizing
        console.log(err.message);
    });
    // Loggin the server host name and port
    console.log(`Server Running at http://${(process.env.NODE_ENV === 'production') ? '172.105.49.237' : 'localhost'}:${app.get('port')}/`)
});


