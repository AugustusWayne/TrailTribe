const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchasync')
const User = require('../models/user')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        console.log(registeredUser)
        req.flash('success', 'Welcome to TrailTribe')
        res.redirect('/campgrounds')
    } catch (e) {
        req.flash('error', 'A user with that username is already registered')
        res.redirect('register')
    }

}))




module.exports = router;
