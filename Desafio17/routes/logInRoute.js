const logInRoute = require('express').Router()
const passport = require('../passport.js');


logInRoute.get('/',async (req,res) => {
    res.render('logIn')
    // res.send(`NGINX corriendo en el puerto ${puerto} por PID ${process.pid}`);
});

logInRoute.post('/',passport.authenticate('login',{ failureRedirect: '/signIn',failureMessage: true }),passport.authenticate('autenticado',{ failureRedirect: '/',failureMessage: true }),async (req,res) => {
    res.redirect('/formulario/' + req.body.username)
})

module.exports = logInRoute;