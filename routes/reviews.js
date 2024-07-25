const express = require('express')
const router = express.Router({ mergeParams: true })
const { campgroundSchema, reviewSchema } = require('../Joischemas.js')
const Review = require('../models/review')
const catchAsync = require('../utils/catchasync')
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError')
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js')
const reviews = require('../controllers/reviews.js')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;