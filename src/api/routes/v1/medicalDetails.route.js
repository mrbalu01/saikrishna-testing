const express = require('express');
const controller = require('@controllers/medicalDetails.controller');
const platformPartnerService = require('@services/platformPartner.service');
const { authorize } = require('@middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /v1/doctor/medicalDetails/medicalDetailsByText:
 *   get:
 *      summary: Get list of ECG records
 *      parameters:
 *      - in: query
 *        name: text
 *        required: true
 *        description: text of the medicalDetails
 *        schema:
 *           type: string
 *      responses:
 *        200:
 *         description: MedicalDetails options
 *         content:
 *           application/json:
 *        401:
 *         description: Unauthorized. Provide valid Authorization in the header.
 *         content:
 *           application/json:
 */

router
   .route('/medicalDetailsByText')
   .get(authorize(),
      platformPartnerService.addPlatformPartnerToQuery,
      controller.getMedicalDetailsByText);

module.exports = router;
