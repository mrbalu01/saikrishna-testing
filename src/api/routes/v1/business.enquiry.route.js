const express = require('express');
const service = require('@services/business.enquiry.service');
const platformPartnerService = require('@services/platformPartner.service');
const router = express.Router();
const { authorize } = require('@middlewares/auth');

/**
 * @swagger
 * /v1/doctor/businessEnquiry:
 *   post:
 *     summary: Create a business enquiry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema: # Request body contents
 *            type: object
 *            properties:
 *              business:
 *                type: object
 *                properties:
 *                   name:
 *                      type: string
 *                   website:
 *                      type: string
 *                   email:
 *                      type: string
 *                   mobile:
 *                      type: object
 *                      properties:
 *                         number:
 *                            type: string
 *                         countryCode:
 *                            type: string
 *              message:
 *                type: string
 *     responses:
 *       200:
 *         description: Created business enquiry.
 *         content:
 *           application/json:
 */
router
   .route('/')
   .post(authorize(), platformPartnerService.addPlatformPartnerToQuery, service.createBusinessEnquiry);

module.exports = router;