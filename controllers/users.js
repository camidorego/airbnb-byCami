const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerCreate = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const newUser = await User.register(user, password)
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Airbnb by Cami!');
            res.redirect('/stays');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('users/register')
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectUrl = res.locals.returnTo || '/stays';
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/stays');
    });
}