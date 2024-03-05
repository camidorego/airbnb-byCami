const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review')
const Stay = require('../models/stays');

module.exports.create = catchAsync(async (req, res) => {
    const stay = await Stay.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    stay.reviews.push(review);
    await review.save();
    await stay.save();
    req.flash('success', 'Created new Review');
    res.redirect(`/stays/${stay._id}`)

})

module.exports.delete = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Stay.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succesfully deleted review');
    res.redirect(`/stays/${req.params.id}`)
})