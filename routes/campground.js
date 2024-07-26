if (process.env.NODE_ENV !== 'production') { // if I am in development mode, the contents of the env file are added to my node environment and accesssible across all files under 'process.env'
    require('dotenv').config()
}

const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchasync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const { campgroundSchema, reviewSchema } = require('../Joischemas.js')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer') // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
// .post(upload.single('image'), (req, res) => { //multer method: upload single and look for the 'image' field
//     res.send(req.body)
//     console.log(req.file)
// })

router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground))

module.exports = router;