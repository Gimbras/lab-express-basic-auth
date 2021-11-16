
const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get('/signup', (req,res,next)=>{
    res.render('auth/signup.hbs')
})

router.post('/signup', (req,res,next)=>{
    const {username, password} = req.body
    let salt = bcrypt.genSaltSync(12);
    let hash = bycypt.hashSync(password, salt);
    UserModel.create({username, password: hash})
    .then(() => {
        res.redirect('/')
        
    }).catch((err) => {
        next(err)
    });
   
})

router.get('/signin', (req,res,next)=>{
    res.render('auth/signin.hbs')
})

router.post('/signin', (req, res, next) => {
    const { username, password } = req.body
    UserModel.find({ username })
        .then((data) => {
            if (data.length) {
                let userObj = data[0];
                
                let isMatching = bcrypt.compareSync(password, userObj.password)
                if (isMatching) {
                    req.session.info = userObj
                    res.redirect('/profile');
                } else {
                    res.render('auth/signin', { error: 'Password not matching' })
                    return;
                }
            } else {
                res.render('auth/singin', { error: 'Invalid Username' })
                return;
        }
        
    }).catch((err) => {
        next(err);
    });
})

const checkLogIn = (req, res, next) => {
    if (req.session.info) {
      //invokes the next available function
      next();
    } else {
      res.redirect("/signin");
    }
  };

router.get('/profile', checkLogIn, (req,res,next)=>{
    let useInfo = req.session.info;
    res.render('auth/profile.hbs',{name: userInfo.username})
})

router.get('/main',checkLogIn, (req,res,next)=>{
    
    res.render('auth/profile.hbs')
})

router.get('/private',checkLogIn, (req,res,next)=>{
   
    res.render('auth/profile.hbs')
})



module.exports = router;
