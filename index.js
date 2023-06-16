//123
const express = require('express');
const path = require('path');
const port = 8001;
const cookie = require('cookie-parser');
// const db = require('./config/mongodb');
const mongoose = require('mongoose')

const url = "mongodb+srv://parasbanbhiya:paras123@cluster0.znqpssm.mongodb.net/admin_pr";

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

// passport
const passport_local=require('./config/passport');
const passport=require('passport');
const session=require('express-session');

const flash = require('express-flash');
const middle = require('./config/flash_middle');

const app = express();
app.use(cookie());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use('/uplod', express.static(path.join(__dirname, 'uplod')))

app.use(express.urlencoded());

app.use(express.static('user_assets'));
app.use(express.static('assets'));

app.use(session({   
    name:'passport',
    secret:'pass',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:100*60*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser); 

app.use(flash());
app.use(middle.setflash);  

app.use('/', require('./router/index'));

app.listen(port, (err) => {
    if (err) {
        console.log("server not running ", err);
        return false;
    }
    console.log(`server is running on localhost:${port}`);
});