const signInRoute = require('express').Router()
const passport = require('../passport.js');


signInRoute.get('/',async (req,res) => {
    res.render('signIn')
})

signInRoute.post('/',passport.authenticate('registracion',{ failureRedirect: '/',failureMessage: true }),async (req,res) => {
    res.redirect('/formulario/' + req.body.username)
})

module.exports = signInRoute;