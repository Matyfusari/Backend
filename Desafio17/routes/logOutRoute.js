const logOutRoute = require('express').Router()



logOutRoute.get('/',async (req,res) => {
    req.session.destroy((err) => {
        console.log(err);
        console.log('Hasta luego');
    })
    res.render('logOut')
})

module.exports = logOutRoute;