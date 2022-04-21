require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');
const router = require('./routes/index');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const db = require('./config/mongoose');
const flash = require('connect-flash');
const customMware = require('./config/flashWare');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const viewPath = path.join(__dirname, './views/');
const assetPath = path.join(__dirname, './assets/');

app.set('view engine', 'ejs');
app.set('views', viewPath);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static(assetPath));
app.use(express.urlencoded({extended: false}));
app.use(expressLayouts);
app.use(cookieParser())
app.use(session({
    name:"restaurant",
    secret: process.env.SESSION_SECRET,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
app.use('/', router);

app.listen(port, (err) => {
    if(err){
        console.log('Error in starting server!');
        return;
    }
    console.log(`Server listening at port: ${port}`)
})