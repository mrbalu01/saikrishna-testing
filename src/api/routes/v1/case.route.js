const express = require('express');
const service = require("@services/case/case.service")
const caseSummaryService = require("@services/case/case.summary.service")
const caseMessageService = require("@services/case/case.message.service")
const controller = require("@controllers/case.controller")
const { authorize } = require('@middlewares/auth');
const inferVitalService = require("@services/case/infer.vital.service")
const platformPartnerService = require('@services/platformPartner.service');
const businessPartnerService = require('@services/businessPartner.service');
const liveStreamService = require("@services/data/livestream.service")
const doctorService = require('@services/doctor.service');
const EcgEventsService = require("@services/ecg.events.service");
const CardiologsSummaryController = require("@controllers/cardiologs.summary.controller");
const CaseEventsController = require("@controllers/case.events.controller");

const router = express.Router();

/**
 * @swagger
 * /v1/doctor/case/:
 *   get:
 *     summary: Get List of cases for the Doctor / Associate / Admin
 *     parameters:
 *      - name: business
 *        in: header
 *        description: Business Partner ID
 *        required: true
 *        schema:
 *           type: string
 *      - name: search
 *        in: query
 *        description: Search with in First Name, Last Name, uhid and caseNumber
 *        required: false
 *        schema:
 *           type: string
 *      - name: customer
 *        in: query
 *        description: List only cases for the specific customerId
 *        required: false
 *        schema:
 *           type: string
 *      - name: condition
 *        in: query
 *        description: Filter by specific conditionId
 *        required: false
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
 *         description: List of cases
 *         content:
 *           application/json:
 *        401:
 *         description: Unauthorized. Provide valid jwt token in the header.
 *         content: {}
 */

router.route('/')
  .get(authorize(),
    businessPartnerService.addBusinessPartnerToQuery,
    platformPartnerService.addPlatformPartnerToQuery,
    doctorService.addExternalDoctorToQuery,
    service.getCustomerCases)

/**
 * @swagger
 * /v1/doctor/case/caseReports:
 *   get:
 *     summary: Get List of ecg reports group by caseNumber [for cases created in last 30 days]
 *     parameters:
 *      - name: business
 *        in: header
 *        description: Business Partner ID
 *        required: true
 *        schema:
 *           type: string
 *      - name: search
 *        in: query
 *        description: Search with in First Name, Last Name, uhid and caseNumber
 *        required: false
 *        schema:
 *           type: string
 *      - name: customer
 *        in: query
 *        description: List only ecg reports for the specific customerId
 *        required: false
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
 *         description: List of reports grouped by caseNumber
 *         content:
 *           application/json:
 *        401:
 *         description: Unauthorized. Provide valid jwt token in the header.
 *         content: {}
 */
router.route('/caseReports')
  .get(authorize(),
    businessPartnerService.addBusinessPartnerToQuery,
    platformPartnerService.addPlatformPartnerToQuery,
    doctorService.addExternalDoctorToQuery,
    service.getCaseReportGroupByCaseNumber)

/**
 * @swagger
 * /v1/doctor/case/isActiveCasePresent:
 *   get:
 *     summary: Checks if the active case is present for the mobile number
 *     parameters:
 *      - name: number
 *        in: query
 *        description: PhoneNumber
 *        required: true
 *        schema:
 *           type: string
 *      - name: countryCode
 *        in: query
 *        description: countryCode
 *        required: true
 *        schema:
 *           type: string
 *     responses:
 *        200:
 *         description: returns true if active case is present
 *         content:
 *           application/json:
 *        401:
 *         description: Unauthorized. Provide valid jwt token in the header.
 *         content: {}
 */
router.route('/isActiveCasePresent')
  .get(authorize(), controller.isActiveCasePresentForMobile)

/**
 * @swagger
 * /v1/doctor/case/{id}:
 *   get:
 *     summary: Get Case Details
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Case ID
 *        schema:
 *           type: string
 *     responses:
 *        200:
 *         description: Case Details
 *         content:
 *           application/json:
 *        401:
 *         description: Unauthorized. Provide valid jwt token in the header.
 *         content: {}
 */
router.route('/:id')
  .get(authorize(), service.getCustomerCase, controller.getCaseById)

/**
 * @swagger
 * /v1/doctor/case/{id}/GetAllVitalLatestData:
 *   get:
 *     summary: Get All Latest vitals for a case
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Case ID
 *        schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All latest vitals for a case.
 *         content:
 *           application/json:
 */
router
  .route('/:id/GetAllVitalLatestData')
  .get(authorize(), service.getCustomerCase, inferVitalService.getAllVitalLatestData)

/**
 * @swagger
 * /v1/doctor/case/{caseId}/vitalDetails:
 *    get:
 *     tags:
 *       - Case
 *     summary: Get vitals for a caseId.
 *     description: Getting list of vitals under mentioned caseId.
 *     operationId: getvitalsByCaseId
 *     parameters:
 *       - name: caseId
 *         in: path
 *         description: Case-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful loading of vitals of mentioned caseId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average:
 *                   type: integer
 *                 count:
 *                   type: integer
 *                 pages:
 *                   type: integer
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
 *         description: Patient caseId doesnot exist.
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
  .route('/:id/vitalDetails')
  .get(authorize(), service.getCustomerCase, inferVitalService.getVitalDetails)

/**
 * @swagger
 * /v1/doctor/case/{id}/vitalSummary:
 *   post:
 *     summary: Get Historical Data for a Case
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Case ID
 *        schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema: # Request body contents
 *            type: object
 *            properties:
 *              from:
 *                type: string
 *              to:
 *                type: string
 *     responses:
 *       200:
 *         description: Historical Data for a Case.
 *         content:
 *           application/json:
 */
router
  .route('/:id/vitalSummary')
  .post(authorize(), service.getCustomerCase, inferVitalService.getVitalSummary)

/**
 * @swagger
 * /v1/doctor/case/{id}/reports:
 *   get:
 *     summary: Get List of ecg reports 
 *     parameters:
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
 *         description: List of reports
 *         content:
 *           application/json:
 *        401:
 *         description: Unauthorized. Provide valid jwt token in the header.
 *         content: {}
 */
router
  .route('/:id/reports')
  .get(authorize(), service.getCustomerCase, controller.getCustomerReports)

/**
 * @swagger
 * /v1/doctor/case/customerCasesSummary/caseStage?stage=livemonitoring:
 *   get:
 *      - name: business
 *        in: header
 *        description: Business Partner ID
 *        required: true
 *        schema:
 *           type: string
 *      - name: condition
 *        in: query
 *        description: Filter by specific conditionId
 *        required: false
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
 *   summary: Get case summary of live cases
 *   responses:
 *       200:
 *         description: case summary of live cases.
 *         content:
 *           application/json:
 */
router.route('/customerCasesSummary/caseStage')
  .get(authorize(),
    businessPartnerService.addBusinessPartnerToQuery,
    platformPartnerService.addPlatformPartnerToQuery,
    doctorService.addExternalDoctorToQuery,
    caseSummaryService.getCustomerCasesSummaryByStage)

/**
 * @swagger
 * /v1/doctor/case/customerCases/caseStage:
 *   get:
 *     tags:
 *       - Case
 *     summary: Get patient cases.
 *     description: Getting patient cases under mentioned business-Id.
 *     operationId: getPatientCases
 *     parameters:
 *       - name: business
 *         in: header
 *         description: Business partnere Id of corresponding logged in doctor.
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful loading of patient cases.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average:
 *                   type: integer
 *                 count:
 *                   type: integer
 *                 pages:
 *                   type: integer
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
 *       '404':
 *         description: Not found or Invalid business-Id.
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

router.route('/customerCases/caseStage')
  .get(authorize(),
    businessPartnerService.addBusinessPartnerToQuery,
    platformPartnerService.addPlatformPartnerToQuery,
    doctorService.addExternalDoctorToQuery,
    service.getCustomerCasesByStage)

/**
 * @swagger
 * /v1/doctor/case/createCase:
 * post:
 *   tags:
 *     - Case
 *   summary: Create patient case.
 *   description: Creating patient case.
 *   operationId: createPatientCase
 *   requestBody:
 *     description: Create a new case
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             customerId:
 *               type: string
 *             condition:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *             business:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *             doctor:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type:  string
 *                 id:
 *                   type: string
 *             platformPartner:
 *               type: string
 *             totalDuration:
 *               type: object
 *               properties:
 *                 duration:
 *                   type: number
 *                 durationUnits:
 *                   type: string
 *                   enum:
 *                     - Days
 *                     - SECONDS
 *                     - MINUTES
 *                     - MILLISECONDS
 *                     - HOURS
 *     required: true
 *   responses:
 *     '200':
 *       description: Successful creation of patient case.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               average:
 *                 type: integer
 *               count:
 *                 type: integer
 *               pages:
 *                 type: integer
 *     '401':
 *       description: Unauthorized.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: integer
 *               message:
 *                 type: string
 *     '500':
 *       description: invalid request body.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: integer
 *               message:
 *                 type: string
 *   security:
 *     - bearerAuth: []
 */

router.route('/createCase')
  .post(authorize(),
    businessPartnerService.addBusinessPartnerToQuery,
    service.setServiceEnabler,
    service.setCreatedBy,
    service.getCondition,
    service.createCase)

/**
 * @swagger
 * /v1/doctor/case/messages/all:
 *   get:
 *     summary: Get Case Messages for All cases.
 *     responses:
 *       200:
 *         description: Case Messages for All cases.
 *         content:
 *           application/json:
 */
router.route('/messages/all')
  .get(authorize(), caseMessageService.getAllCaseMessages)

/**
 * @swagger
 * /v1/doctor/case/{id}/messages:
 *   get:
 *     summary: Get Case Messages.
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Case ID
 *        schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case Messages for a particular case.
 *         content:
 *           application/json:
 *   post:
 *     summary: Send Case Message.
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Case ID
 *        schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema: # Request body contents
 *            type: object
 *            properties:
 *              text:
 *                type: string
 *              recipients:
 *                type: string
 *     responses:
 *       200:
 *         description: Case Messages for a particular case.
 *         content:
 *           application/json:

 */
router.route('/:id/messages')
  .get(authorize(), service.getCustomerCase, caseMessageService.getCaseMessagesByRecipient)
  .post(authorize(), service.getCustomerCase, caseMessageService.createCaseMessage)

/**
 * @swagger
 * /v1/doctor/case/{id}/batteryStatus:
 *   get:
 *     summary: Get status of case devices battery status.
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Case ID
 *        schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Battery Status of case devices.
 *         content:
 *           application/json:
 */
router.route('/:id/batteryStatus')
  .get(authorize(), controller.getBatteryStatus)

/**
 * @swagger
 * /v1/doctor/case/messages:
 *   get:
 *     summary: Get Case Messages for All cases.
 *     responses:
 *       200:
 *         description: Case Messages for All cases.
 *         content:
 *           application/json:
 */
router.route('/messages')
  .get(authorize(), service.getCustomerCase, caseMessageService.getAllCaseMessages)

/**
 * @swagger
 * /v1/doctor/case/{id}/messages/markAsRead:
 *   post:
 *     summary: Mark a Case Message as Read
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Case ID
 *        schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema: # Request body contents
 *            type: object
 *            properties:
 *              caseMessageId:
 *                type: string
 *     responses:
 *       200:
 *         description: Historical Data for a Case.
 *         content:
 *           application/json:
 */
router.route('/:id/messages/markAsRead')
  .post(authorize(), service.getCustomerCase, caseMessageService.markAsRead)

/**
 * @swagger
 * /v1/doctor/case/{id}/liveStreamWithPagination:
 *   post:
 *     summary: Get liveStream With Pagination for Case 
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Case ID
 *        schema:
 *           type: string
 *     requestBody:
 *       required: true    
 *     responses:
 *        200:
 *         description: liveStream With Pagination for Case
 *         content:
 *           application/json:
 */

router.route('/:id/liveStreamWithPagination')
  .post(authorize(), service.getCustomerCase, liveStreamService.getLiveStreamingWithPagination)

/**
 * @swagger
 * /v1/doctor/case/{id}/ecgEvents:
 *   get:
 *     summary: Get ecgEvents for Case
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Case ID
 *        schema:
 *           type: string   
 *     responses:
 *        200:
 *         description: ecgEvents for Case
 *         content:
 *           application/json:
 */

router.route("/:id/ecgEvents")
  .get(authorize(), service.getCustomerCase, EcgEventsService.getEcgEvents)

/**
 * @swagger
 * /v1/doctor/case/{id}/cardiologsSummary:
 *   get:
 *     summary: Get Cardiologs summary for Case  
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Case ID
 *        schema:
 *           type: string    
 *     responses:
 *        200:
 *         description: Cardiologs summary for Case
 *         content:
 *           application/json:
 */

router.route("/:id/cardiologsSummary")
  .get(authorize(), service.getCustomerCase, CardiologsSummaryController.getCardiologsSummary)

/**
 * @swagger
 * /v1/doctor/case/{caseId}/caseEvents:
 *   get:
 *     tags:
 *       - Case
 *     summary: Get case events.
 *     description: Getting case events under mentioned caseId.
 *     operationId: getcaseEventsByCaseId
 *     parameters:
 *       - name: caseId
 *         in: path
 *         description: Case-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful loading of case events of mentioned caseId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 caseEvents:
 *                   type: array
 *                   items:
 *                     type: string
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
 *         description: cast error for Patient caseId.
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
  .route('/:id/caseEvents')
  .get(authorize(), CaseEventsController.getCaseEvents)

module.exports = router;