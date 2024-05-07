// adminRoutes.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const Quotation = require('../models/quotation');
const wrapAsync = require('../utils/Wrapasync');
const nodemailer = require('nodemailer');
const transporter = require('../utils/emailConfig');
// Admin Signup
router.get('/admin/signup',  wrapAsync(async (req, res) => {
  res.render('./admin/signup');
}));;
// Admin Login
router.get('/admin/login', wrapAsync( async(req, res) => {
  res.render('./admin/login');
}));;
router.post('/admin/login', passport.authenticate('admin', {
    failureRedirect: '/admin/login',
    failureFlash: true
  }), (req, res) => {
    req.flash('success', 'Welcome back, admin!');
    res.redirect('/admin/category');
  });
  
// Handling the new user request
router.post('/admin/signup', wrapAsync( async (req, res, next) => {
    const { username, password } = req.body;
    
    const foundUser = await Admin.find({ username });
    if (foundUser.length) {
        // Setup flash and call it here
        req.flash('error', 'Email already in use. Try different Email or Login instead.')
        return res.redirect('/admin/signup')
    }
    const admin = new Admin({ ...req.body });
    const registeredUser = await Admin.register(admin, password, function (err, newUser) {
        if (err) {
            next(err);
        }
        req.logIn(newUser, () => {
            res.redirect('/admin/category');
        })
    });
}));

router.get('/admin/quotations', wrapAsync(async (req, res) => {
  const quotations = await Quotation.find().populate('user').populate('product'); // Populate both user and product fields
  res.render('./admin/orders', { quotations });
}));
// Update the status of a quotation to "Approved"
router.put('/admin/quotations/:quotationId/approve', wrapAsync(async (req, res) => {
const {quotationId} = req.params.quotationId;
  // Find the quotation and update its status
  await Quotation.findByIdAndUpdate(quotationId, { status: 'Approved' });
  req.flash('success', 'Quotation approved successfully');
  res.redirect('/admin/quotations');
}));

// Delete a quotation by ID (only if the quotation is pending)
router.delete('/admin/quotations/delete/:quotationId', wrapAsync(async (req, res) => {
  const {quotationId} = req.params;
  // Find the quotation by ID
  const quotation = await Quotation.findByIdAndDelete(quotationId);
  req.flash('success', 'Quotation deleted successfully');
  res.redirect('/admin/quotations');
}));

module.exports = router;
