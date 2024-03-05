const express = require('express')
const router = express.Router();

const { isLoggedIn, isAuthor, validateStay } = require('../middleware')
const stayController = require('../controllers/stays')

const multer = require('multer')
const { storage } = require('../cloudinary/cloudinary');
const upload = multer({ storage })


router.route('/')
    .get(stayController.index)
    .post(isLoggedIn, upload.array('image'), validateStay, stayController.newCreate)
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files)
//     res.send('funciono')
// })

router.get('/new', isLoggedIn, stayController.newForm);

router.route('/:id')
    .get(stayController.showStay)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateStay, stayController.editStay)
    .delete(isLoggedIn, isAuthor, stayController.delete)

router.get('/:id/edit', isLoggedIn, isAuthor, stayController.editForm);

//router.get('/', catchAsync(stayController.index))
//router.post('/', isLoggedIn, validateStay, stayController.newCreate)
//router.get('/:id', stayController.showStay);
//router.put('/:id', isLoggedIn, isAuthor, validateStay, stayController.editStay);
//router.delete('/:id', isLoggedIn, isAuthor, stayController.delete)

module.exports = router;