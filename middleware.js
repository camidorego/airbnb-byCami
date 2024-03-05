module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.session.returnTo, req.originalUrl)
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo, req.originalUrl)
        req.flash('error', 'You must be signed in');
        return res.redirect('/login')

    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const Stay = require('./models/stays')

module.exports.isAuthor = async (req, res, next) => {
    const stay = await Stay.findById(req.params.id);
    if (!stay.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that');
        return res.redirect(`/stays/${req.params.id}`);
    }
    next();
}

const Review = require('./models/review');
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId);
    if (review.author && !review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that');
        return res.redirect(`/stays/${id}`);
    }
    next()
}

const ExpressError = require('./utils/ExpressError');
const { reviewSchema, staySchema } = require('./schemas')

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateStay = (req, res, next) => {

    const { error } = staySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}