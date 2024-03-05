const catchAsync = require('../utils/catchAsync');
const Stay = require('../models/stays');
const token = process.env.mapbox_token;
const mbxGeoconding = require('@mapbox/mapbox-sdk/services/geocoding');

const { cloudinary } = require('../cloudinary/cloudinary');
const { query } = require('express');

const geocoder = mbxGeoconding({ accessToken: token });

module.exports.index = catchAsync(async (req, res) => {
    const stays = await Stay.find({});
    res.render('stays/index', { stays });
})

module.exports.newForm = (req, res) => {
    res.render('stays/new')
}

module.exports.newCreate = catchAsync(async (req, res) => {
    const { location } = req.body.stay
    const geoData = await geocoder.forwardGeocode({
        query: location,
        limit: 1
    }).send()
    const stay = new Stay(req.body.stay);
    stay.geometry = geoData.body.features[0].geometry
    stay.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    stay.author = req.user._id;
    await stay.save();
    console.log(stay)
    req.flash('success', 'Succesfully made a Stay');
    res.redirect('/stays');
})

module.exports.showStay = catchAsync(async (req, res) => {
    const stay = await Stay.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!stay) {
        req.flash('error', 'Stay not found')
        res.redirect('/stays')
    }
    res.render('stays/show', { stay });
})

module.exports.editForm = catchAsync(async (req, res) => {
    const stay = await Stay.findById(req.params.id);
    if (!stay) {
        req.flash('error', 'Stay not found')
        res.redirect('/stay')
    }
    res.render('stays/edit', { stay });
})

module.exports.editStay = catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const newStay = await Stay.findByIdAndUpdate(id, { ...req.body.stay })
    const imgArray = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newStay.images.push(...imgArray)
    await newStay.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await stay.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Succesfully updated the Stay');
    res.redirect(`/stays/${newStay._id}`);
})

module.exports.delete = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Stay.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted the Stay');
    res.redirect('/stays');
})