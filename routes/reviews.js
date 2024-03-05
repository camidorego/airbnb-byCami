const express = require('express')
const router = express.Router({ mergeParams: true });

const { isLoggedIn, validateReview, storeReturnTo, isReviewAuthor } = require('../middleware')
const reviewController = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, reviewController.create)

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviewController.delete)

module.exports = router
