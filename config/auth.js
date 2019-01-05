//AUTH MIDDLEWARE
const AUTH = {
    isAuthenticated: (req, res, next) => {

      if (!req.isAuthenticated()) // passport isAuthenticated() func
        return res.redirect('/auth/login');
      
      next();
      
    }
};

export default AUTH;