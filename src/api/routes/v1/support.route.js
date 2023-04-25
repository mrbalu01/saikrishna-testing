const express = require('express');
const service = require('@services/support.service');
const platformPartnerService = require('@services/platformPartner.service');
const router = express.Router();
const { authorize } = require('@middlewares/auth');


/**
 * @swagger
 * /v1/doctor/referAPatient:
 *   post:
 *     summary: Refer a patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema: # Request body contents
 *            type: object
 *            properties:
 *              customer:
 *                type: object
 *                properties:
 *                   firstName:
 *                      type: string
 *                   lastName:
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
 *              noOfDays:
 *                type: integer
 *              condition:
 *                type: object
 *                properties:
 *                   id:
 *                      type: string
 *                   name:
 *                      type: string
 *     responses:
 *       200:
 *         description: Refer a patient details.
 *         content:
 *           application/json:
 */
router
   .route('/')
   .post(authorize(), platformPartnerService.addPlatformPartnerToQuery, service.referAPatient);

module.exports = router;