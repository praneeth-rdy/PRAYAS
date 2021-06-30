require('dotenv').config({ path: './config.env' });
const express = require('express');
const path = require("path");

// Connect DB

const app = express();

// App Config
app.set("views", path.join(__dirname, "views"));
// By setting view engine here, there is no need to mention file extension again in controllers
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.set('port', process.env.PORT || 5050);

app.use('/', require('./routes/main'));

app.listen(app.get('port'), () => {
    console.log(`Server Running at http://${(process.env_NODE_ENV==='production')?'172.105.49.237':'localhost'}:${app.get('port')}/`)
});
