import express from 'express';
import Validator from 'validator';
import passport from 'passport';
import User from '../models/User';
import CONF from '../config/conf';

const router = express.Router();


router.get('/login',(req,res) => res.render('auth/login')); //render login page

router.get('/register',(req,res) => res.render('auth/register'));   //render register page

router.post('/login',(req,res,next)=>{  //login post action

    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req,res,next);

});

router.get('/logout',(req,res) => {

    req.logout(); //passport logout() func;
    res.redirect('/auth/login');

});



router.post('/register',(req,res) => {
    //form inputs data
    const {name,email,password,passwordConf} = req.body;

    const validationErrors = Array();

    const pass_min_length = CONF.password_min_length;

    if(!name || name === '') validationErrors.push({field:'name',msg:'empty name'});
    if(!Validator.isEmail(email)) validationErrors.push({field:'email','msg':'email ivalid'});
    if(password.length < pass_min_length ) validationErrors.push({field:'password','msg':`password must consist min ${pass_min_length} simbols`});
    if(!Validator.equals(password,passwordConf)) validationErrors.push({field:'passwordConf','msg':'password isn`t match'});


    if(validationErrors.length > 0)
        return res.render('auth/register',{validationErrors,name,email,password,passwordConf});
        
    //Validation OK;
        
    User.findOne({email}).then(user=>{

        if(user){
            
            validationErrors.push({msg:`email ${email} already registered`});

            return res.render('auth/register',{validationErrors,email,password,passwordConf});
        }

        const userObj = new User(); //mongoose userSchema
        userObj.name = name;
        userObj.email = email;
        userObj.setPassword(password);

        userObj.save().then((user)=>{

            if(!user){
                
                validationErrors.push({msg:'registration failed'});
                return res.render('auth/register',{validationErrors,name,email,password,passwordConf});
                
            }

            req.flash('flash_success_msg','user registration successfully');
            res.redirect('/auth/login');

        }).catch(err=>console.log(err));

    });
    

});

module.exports = router;