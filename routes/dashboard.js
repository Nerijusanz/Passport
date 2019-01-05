import express from 'express';
import AUTH from '../config/auth';

const router = express.Router();


router.get('/', AUTH.isAuthenticated, (req,res) => {
    res.render('dashboard',{
        user: req.user
    });
});

module.exports = router;