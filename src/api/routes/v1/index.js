const express = require('express');
const authRoutes = require('./auth.route');
const caseRoutes = require('./case.route');
const countryRoutes = require('./country.route');
const customerRoutes = require('./customer.route');
const userRoutes = require('./user.route');
const businessPartnerRoutes = require('./businessPartner.route');
const storyRoutes = require('./story.route');
const businessEnquiryRoutes = require('./business.enquiry.route');
const supportRoutes = require('./support.route');
const conditionRoutes = require('./condition.route');
const helpRoutes = require('./help.question.route');
const pageContentRoutes = require('./page.content.route');
const deviceInstanceRoutes = require('./device.instance.route');
const medicalDetailsRoutes = require('./medicalDetails.route');
const buildInfoRoute = require("./build.info.route");

const router = express.Router();

/**
 *@swagger
 * /v1/doctor/status:
 *   get:
 *      summary: Get Service status
 *      description: Get Service status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));
router.use('/build-info', buildInfoRoute);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/case', caseRoutes);
router.use('/countries', countryRoutes);
router.use('/customer', customerRoutes);
router.use('/business', businessPartnerRoutes);
router.use('/story', storyRoutes);
router.use('/businessEnquiry', businessEnquiryRoutes);
router.use('/referAPatient', supportRoutes);
router.use('/conditions', conditionRoutes)
router.use('/help', helpRoutes)
router.use('/pageContent', pageContentRoutes);
router.use('/deviceInstance', deviceInstanceRoutes);
router.use('/medicalDetails', medicalDetailsRoutes);

module.exports = router;
