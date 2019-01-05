import path from 'path';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import passport from 'passport';
import PassportConf from './config/passport';

dotenv.config(); //init .env
const app = express();

// -------------MongoDB setups-------------
mongoose.Promise = Promise; //overwrite default mongoose promise library into bluebird promise library
mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true })
    .then(()=>console.log(`MongoDB Connected successfully`))
    .catch(err=>console.log(err));
mongoose.set('useCreateIndex', true);
// -----------------------------------------

// Passport Config
PassportConf(passport);
//require('./config/passport')(passport);

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//body parser, is now part of express
app.use(express.urlencoded({extended:true}));



//Express session midleware
app.use(session({
    secret:process.env.SESSION_SECRET_KEY,
    resave:true,
    saveUninitialized:true
}));

//passport middlerware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Globals vars middleware
app.use((req,res,next)=>{
    //--------custom flash messages---------
    res.locals.flash_success_msg = req.flash('flash_success_msg');
    res.locals.flash_error_msg = req.flash('flash_error_msg');
    //--------------------------------------

    //----passport failure flash errors--------
    res.locals.error = req.flash('error');
    //-----------------------------------------
    
    next();
});


//Routes
app.use('/',require('./routes/index.js'));
app.use('/auth',require('./routes/auth.js'));
app.use('/dashboard',require('./routes/dashboard.js'));

const PORT = process.env.LISTEN_PORT || 5000;

app.listen(PORT,console.log(`server started on port ${PORT}`));