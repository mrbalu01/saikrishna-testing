const express = require('express');
const controller = require("@controllers/customer.controller")
const service = require("@services/users/customer.service")
const { authorize } = require('@middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /v1/doctor/customer/{id}:
 *   get:
 *     summary: Get customer details
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Customer ID
 *        schema:
 *           type: string
 *     responses:
 *       200:
 *         description: customer details.
 *         content:
 *           application/json:
 */
router.route('/:id')
  .get(authorize(), controller.getCustomerById)

/**
 * @swagger
 * /v1/doctor/customer/{id}/reports:
 *   get:
 *     summary: Get List of ecg reports 
 *     parameters:
 *      - name: id
 *        in: path
 *        description: customer Id
 *        required: true
 *        schema:
 *           type: string
 *      - name: page
 *        in: query
 *        description: List the specific page.
 *        required: false
 *        schema:
 *           type: integer
 *      - name: perPage
 *        in: query
 *        description: Number of attribute records per page.
 *        required: false
 *        schema:
 *           type: integer
 *     responses:
 *        200:
 *         description: List of reports grouped by CaseNumber
 *         content:
 *           application/json:
 *        401:
 *         description: Unauthorized. Provide valid jwt token in the header.
 *         content: {}
 */
router.route('/:id/reports')
  .get(authorize(), controller.getCaseReportGroupByCaseNumber)

/**
 * @swagger
 * /v1/doctor/customer/mobile/{mobileNumber}:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get customer details.
 *     description: Getting customer details by mobile number and country code.
 *     operationId: getCustomerDetailsByMobileNumber
 *     parameters:
 *       - name: mobileNumber
 *         in: path
 *         description: mobile number
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *       - name: countryCode
 *         in: query
 *         description: country code
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful loading of customer details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   patientId:
 *                     type: string
 *                   height:
 *                     type: object
 *                     properties:
 *                       feet:
 *                         type: string
 *                       inches:
 *                         type: string
 *                   weight:
 *                     type: string
 *                   activeCase:
 *                     type: object
 *                     properties:
 *                       caseNumber:
 *                         type: string
 *                       condition:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           duration:
 *                             type: object
 *                             properties:
 *                               isFixed:
 *                                 type: boolean
 *                               value:
 *                                 type: integer
 *                               durationUnits:
 *                                 type: string
 *                                 enum:
 *                                   - Days
 *                                   - SECONDS
 *                                   - MINUTES
 *                                   - MILLISECONDS
 *                                   - HOURS
 *                           metadata:
 *                             type: object
 *                             properties:
 *                               showLiveVitals:
 *                                 type: boolean
 *                               enabled:
 *                                 type: boolean
 *                               order:
 *                                 type: integer
 *                               analysisEngine:
 *                                 type: string
 *                               targetedClients:
 *                                 type: array
 *                                 items:
 *                                   type: string  
 *                       vitals:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             monitoringFrequency:
 *                               type: object
 *                               properties:
 *                                 duration:
 *                                   type: string
 *                                 durationUnits:
 *                                   type: string
 *                                   enum:
 *                                     - Days
 *                                     - SECONDS
 *                                     - MINUTES
 *                                     - MILLISECONDS
 *                                     - HOURS
 *                                 periodicity: 
 *                                   type: string
 *                                 periodicityUnits:
 *                                   type: string
 *                             isMonitored:
 *                               type: boolean
 *                             code:
 *                               type: string
 *                               enum:
 *                                 - HR
 *                                 - RR
 *                                 - TEMP
 *                                 - ECG
 *                       totalDuration:
 *                         type: object
 *                         properties:
 *                           duration:
 *                             type: integer
 *                           durationUnits:
 *                             type: string
 *                             enum:
 *                               - Days
 *                               - SECONDS
 *                               - MINUTES
 *                               - MILLISECONDS
 *                               - HOURS
 *                       platformPartner:
 *                         type: string
 *                       stage:
 *                         type: string
 *                         enum:
 *                           - ADDDEVICE
 *                           - INITIALIZED
 *                           - LIVESTREAMING
 *                           - MONITORING
 *                           - DATASYNC
 *                           - COMPLETED
 *                       status:
 *                         type: string
 *                         enum:
 *                           - ONGOING
 *                           - SUCCESS
 *                       history:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             stage:
 *                               type: string
 *                               enum:
 *                                 - ADDDEVICE
 *                                 - INITIALIZED
 *                                 - LIVESTREAMING
 *                                 - MONITORING
 *                                 - DATASYNC
 *                                 - COMPLETED
 *                             status:
 *                               type: string
 *                               enum:
 *                                 - ONGOING
 *                                 - SUCCESS
 *                             statusHistory:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   status:
 *                                     type: string
 *                                     enum:
 *                                       - ONGOING
 *                                       - SUCCESS
 *                                   createdAt:
 *                                     type: string
 *                             createdAt:
 *                               type: string
 *                       customer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                       isActive:
 *                         type: boolean
 *                       hasMonitoringPeriodElapsed: 
 *                         type: boolean
 *                       feedback:
 *                         type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       id: 
 *                         type: string
 *                       business:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       doctor:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                       layoutOccupancy:
 *                         type: object
 *       '500':
 *         description: Cast Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 */

  router.route('/mobile/:mobileNumber')
  .get( service.getCustomerListByPhoneNumber)

/**
 * @swagger
 * /v1/doctor/customer/registerPatient:
 *   post:
 *     tags:
 *       - Customer
 *     summary: patient registration.
 *     description: Registering a new patient.
 *     operationId:  registerPatient
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                   type: object
 *                   properties:
 *                     countryCode: 
 *                       type: string
 *                     number:
 *                       type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum:
 *                   - MALE
 *                   - FEMALE
 *               dob:
 *                 type: string
 *                 format: date
 *               uhid:
 *                 type: string
 *               height:
 *                 type: object
 *                 properties:
 *                   feet:
 *                     type: string
 *                   inches:
 *                     type: string
 *               weight:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful registration of patient.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mobile:
 *                     type: object
 *                     properties:
 *                       countryCode: 
 *                         type: string
 *                       number:
 *                         type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 mobileDeviceInfo:
 *                   type: object
 *                 gender:
 *                   type: string
 *                   enum:
 *                     - MALE
 *                     - FEMALE
 *                 role:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 patienId:
 *                   type: string
 *                 uhid:
 *                   type: string
 *                 height:
 *                   type: object
 *                   properties:
 *                     feet:
 *                       type: string
 *                     inches:
 *                       type: string
 *                 weight:
 *                   type: string
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
 *       '500':
 *         description: Cast Error for gender.
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

  router.route('/registerPatient')
  .post(authorize(), service.registerPatient)


module.exports = router;