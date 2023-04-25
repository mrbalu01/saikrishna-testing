const express = require('express');
const controller = require('@controllers/businessPartner.controller');
const { authorize } = require('@middlewares/auth');
const BusinessPartnerService = require('@services/businessPartner.service')
const doctorService = require('@services/doctor.service');
const caseSummaryService = require('@services/case/case.summary.service')
const platformPartnerService = require('@services/platformPartner.service');
const caseService = require("@services/case/case.service")

const router = express.Router();

/**
 * @swagger
 * /v1/doctor/business:
 *   get:
 *     tags:
 *       - Business
 *     summary: Get business partner details.
 *     description: Getting business partner details of the hospital under which doctor is being enrolled.
 *     operationId: getBusinessPartners
 *     responses:
 *       '200':
 *         description: Successful loading of busieness partners.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 businessPartners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       platformPartner:
 *                         type: string
 *                       id:
 *                         type: string
 *                       uniqueId:
 *                         type: string
 *                       associatedGroup:
 *                         type: string
 *                       contact:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             mobile:
 *                               type: string
 *                             permission:
 *                               type: string
 *                             firstName:
 *                               type: string
 *                             lastName:
 *                               type: string
 *                             email: 
 *                               type: string
 *                       layout:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             layoutName:
 *                               type: string
 *                               enum:
 *                                 - FLOOR
 *                                 - WARD
 *                                 - DEPARTMENT
 *                             layoutValues:
 *                               type: array
 *                               items:
 *                                 type: string
 *                       location:
 *                         type: string
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *     security:
 *       - bearerAuth: []
 */

router
   .route('/')
   .get(authorize(), platformPartnerService.addPlatformPartnerToQuery, controller.list)
   .post(authorize(),
      platformPartnerService.addPlatformPartnerToQuery,
      BusinessPartnerService.addBusinessPartnerToQuery,
      caseService.setServiceEnabler,
      BusinessPartnerService.create)

/**
 * @swagger
 * /v1/doctor/business/{id}:
 *   get:
 *     summary: Get Business/Hospital Details
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Business ID
 *        schema:
 *           type: string
 */
router
   .route('/:id')
   .get(authorize(), BusinessPartnerService.getBusinessPartner, controller.get)

/**
 * @swagger
 * /v1/doctor/business/case/count:
 *   get:
 *     summary: Get case count by business partner.
 *     responses:
 *       200:
 *         description: Get case count by business partner.
 *         content:
 *           application/json:
 */
router.route('/case/count')
   .get(authorize(), doctorService.addExternalDoctorToQuery,
      platformPartnerService.addPlatformPartnerToQuery,
      caseSummaryService.getCaseCountByBusinessPartner)

router.route('/:id/statistics')
   .get(authorize(), BusinessPartnerService.getBusinessPartner,
      caseSummaryService.getCaseStatisticsByBusinessPartner)

module.exports = router;
