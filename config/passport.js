import LocalStrategy from 'passport-local';
import User from '../models/User';

LocalStrategy.Strategy;


const PassportConf = (passport) => {  //include passport library

  passport.use(

    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({email}).then(user => {

        if (!user || !user.isValidPassword(password) ) 
          return done(null, false, { message: 'credentials invalid' });

        //credentials OK;
        return done(null, user);

      });
    })
  );


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

};

export default PassportConf;

