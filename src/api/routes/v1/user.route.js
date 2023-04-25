const express = require('express');
const controller = require('@controllers/user.controller');
const service = require("@services/doctor.service.js")
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const businessPartnerService = require('@services/businessPartner.service');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

/**
 * @swagger
 * /v1/doctor/users:
 *   post:
 *     tags:
 *       - User
 *     summary: Create doctor
 *     description: creating new doctor profile by providing the details.
 *     operationId: createDoctor
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               mobile:
 *                 type: object
 *                 properties:
 *                   number:
 *                     type: string
 *                   countryCode:
 *                     type: string
 *               businessPartners:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     businessPartnerId:
 *                       type: string
 *                     displayName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     providerNumber:
 *                       type: string
 *                     speciality:
 *                       type: string
 *                       enum:
 *                         - Cardiology
 *                         - Neurology
 *                         - Pulmonology
 *                         - Nephrology
 *                         - General Physician
 *                         - Cardio-thoracic Surgery
 *                         - Neurosurgery
 *                         - Others
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
 *                             enum:
 *                               - INTERNAL_DOCTOR
 *                               - EXTERNAL_DOCTOR
 *                     layout:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           layoutName:
 *                             type: string
 *                             enum:
 *                               - FLOOR
 *                               - WARD
 *                               - DEPARTMENT
 *                           layoutValues:
 *                             type: array
 *                             items:
 *                               type: string
 *     responses:
 *       '200':
 *         description: successful creation of doctor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 mobile:
 *                   type: object
 *                   properties:
 *                     countryCode: 
 *                       type: string
 *                     number:
 *                       type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 userType:
 *                   type: string
 *                   enum:
 *                     - DOCTOR
 *                     - AGENT
 *                 userPreferences:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                       enum:
 *                         - en
 *                         - id
 *                     weight:
 *                       type: string
 *                       enum:
 *                         - KG
 *                         - POUND
 *                     height:
 *                       type: string
 *                       enum:
 *                         - FEET-INCH
 *                         - CENTIMETERS
 *                         - METERS
 *                 platformPartner:
 *                   type: string
 *                 businessPartners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       isActive:
 *                         type: boolean
 *                       isDeleted:
 *                         type: boolean
 *                       _id:
 *                         type: string 
 *                       businessPartnerId: 
 *                         type: string
 *                       businessPartnerName:
 *                         type: string
 *                       diplayName:
 *                         type: string
 *                       speciality:
 *                         type: string
 *                       email:
 *                         type: string
 *                       layout:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             layoutValues:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             _id:
 *                               type: string
 *                             layoutName:
 *                               type: string
 *                               enum:
 *                                 - FLOOR
 *                                 - WARD
 *                                 - DEPARTMENT
 *                       location:
 *                         type: string
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             role:
 *                               type: string
 *                               enum:
 *                                 - INTERNAL_DOCTOR
 *                                 - EXTERNAL_DOCTOR
 *                                 - ASSOCIATE
 *                                 - ADMIN
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 vigoId:
 *                   type: string
 *                 loginRole:
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
 *         description: invalid request body.
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
  .get(authorize(ADMIN), businessPartnerService.addBusinessPartnerToQuery, controller.listDoctors)
  .post(authorize(ADMIN), controller.createDoctor);


/**
 * @swagger
 * /v1/doctor/users/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get doctor profile
 *     description: Access doctor's profile using this endpoint.
 *     operationId: getDoctorProfile
 *     responses:
 *       '200':
 *         description: Successful loading of doctor profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 mobile:
 *                   type: object
 *                   properties:
 *                     countryCode: 
 *                       type: string
 *                     number:
 *                       type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 userType:
 *                   type: string
 *                   enum:
 *                     - DOCTOR
 *                     - AGENT
 *                 userPreferences:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                       enum:
 *                         - en
 *                         - id
 *                     weight:
 *                       type: string
 *                       enum:
 *                         - KG
 *                         - POUND
 *                     height:
 *                       type: string
 *                       enum:
 *                         - FEET-INCH
 *                         - CENTIMETERS
 *                         - METERS
 *                 platformPartner:
 *                   type: string
 *                 businessPartners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       isActive:
 *                         type: boolean
 *                       isDeleted:
 *                         type: boolean
 *                       _id:
 *                         type: string 
 *                       businessPartnerId: 
 *                         type: string
 *                       businessPartnerName:
 *                         type: string
 *                       diplayName:
 *                         type: string
 *                       speciality:
 *                         type: string
 *                       email:
 *                         type: string
 *                       layout:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             layoutValues:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             _id:
 *                               type: string
 *                             layoutName:
 *                               type: string
 *                               enum:
 *                                 - FLOOR
 *                                 - WARD
 *                                 - DEPARTMENT
 *                       location:
 *                         type: string
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             role:
 *                               type: string
 *                               enum:
 *                                 - INTERNAL_DOCTOR
 *                                 - EXTERNAL_DOCTOR
 *                                 - ASSOCIATE
 *                                 - ADMIN
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 vigoId:
 *                   type: string
 *                 loginRole:
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
 *     security:
 *       - bearerAuth: []
 */
  
  router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

/**
 * @swagger
 * /v1/doctor/users/doctorByMobile:
 *   get:
 *      summary: Get Doctor
 *      description: Get Doctor by Mobile Number
 *      parameters:
 *      - name: number
 *        in: query
 *        description: Phone number
 *        required: true
 *        schema:
 *           type: string
 *      - name: countryCode
 *        in: query
 *        description: countryCode
 *        required: true
 *        schema:
 *           type: string
 *      responses:
 *       200:
 *         description: Doctor 
 *         content:
 *           application/json:
 */
router
  .route('/doctorByMobile')
  .get(authorize(),
    businessPartnerService.validateBusinessPartner,
    controller.getDoctorByMobile);

/**
 * @swagger
 * /v1/doctor/users/isDoctorExists:
 *   get:
 *      summary: Check if Doctor exists
 *      description: Check if Doctor for the Mobile Number
 *      parameters:
 *      - name: number
 *        in: query
 *        description: Phone number
 *        required: true
 *        schema:
 *           type: string
 *      - name: countryCode
 *        in: query
 *        description: countryCode
 *        required: true
 *        schema:
 *           type: string
 *      responses:
 *       200:
 *         description: isDoctorExists flag 
 *         content:
 *           application/json:
 */
router
  .route('/isDoctorExists')
  .get(authorize(), controller.isDoctorExists);

/**
 * @swagger
 * /v1/doctor/users/doctorsByBusinessId/{business}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get doctor profiles list.
 *     description: Getting list of doctor profiles under mentioned business partnerId.
 *     operationId: getDoctorsByBusinessId
 *     parameters:
 *       - name: business
 *         in: path
 *         description: Business Partner-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful loading of doctors list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       mobile:
 *                         type: object
 *                         properties:
 *                           countryCode: 
 *                             type: string
 *                           number:
 *                             type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       userType:
 *                         type: string
 *                         enum:
 *                           - DOCTOR
 *                           - AGENT
 *                       userPreferences:
 *                         type: object
 *                         properties:
 *                           language:
 *                             type: string
 *                             enum:
 *                               - en
 *                               - id
 *                           weight:
 *                             type: string
 *                             enum:
 *                               - KG
 *                               - POUND
 *                           height:
 *                             type: string
 *                             enum:
 *                               - FEET-INCH
 *                               - CENTIMETERS
 *                               - METERS
 *                       platformPartner:
 *                         type: string
 *                       businessPartners:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             isActive:
 *                               type: boolean
 *                             isDeleted:
 *                               type: boolean
 *                             _id:
 *                               type: string 
 *                             businessPartnerId: 
 *                               type: string
 *                             businessPartnerName:
 *                               type: string
 *                             diplayName:
 *                               type: string
 *                             speciality:
 *                               type: string
 *                             email:
 *                               type: string
 *                             layout:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   layoutValues:
 *                                     type: array
 *                                     items:
 *                                       type: string
 *                                   _id:
 *                                     type: string
 *                                   layoutName:
 *                                     type: string
 *                                     enum:
 *                                       - FLOOR
 *                                       - WARD
 *                                       - DEPARTMENT
 *                             location:
 *                               type: string
 *                             roles:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   _id:
 *                                     type: string
 *                                   role:
 *                                     type: string
 *                                     enum:
 *                                       - INTERNAL_DOCTOR
 *                                       - EXTERNAL_DOCTOR
 *                                       - ASSOCIATE
 *                                       - ADMIN
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       vigoId:
 *                         type: string
 *                       loginRole:
 *                         type: string
 *                     
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
 *         description: cast error of business header.
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
  router.route('/doctorsByBusinessId/:business')
  .get(authorize(), controller.getDoctorsByBusinessId)

/**
 * @swagger
 * /v1/doctor/users/userAgents:
 *   get:
 *      summary: Return list of userAgents
 *      description: list of userAgents
 *      parameters:
 *      - name: business
 *        in: header
 *        description: Business Partner ID
 *        required: true
 *        schema:
 *           type: string
 *      - name: isActive
 *        in: query
 *        description: query by isActive flag 
 *        required: false
 *        schema:
 *           type: boolean
 *      - name: query
 *        in: query
 *        description: Search with in First Name, Last Name, vigoId, loginId and mobile number
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
 *        description: Number of records per page.
 *        required: false
 *        schema:
 *           type: integer
 *      responses:
 *       200:
 *         description: List of userAgents
 *         content:
 *           application/json:
 *   post:
 *     tags:
 *       - User
 *     summary: crate user associate
 *     description: creating new user associate by providing details.
 *     operationId: createUserAssociate
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName: 
 *                 type: string
 *               loginId:
 *                 type: string
 *               password:
 *                 type: string
 *               mobile:
 *                 type: object
 *                 properties:
 *                   number:
 *                     type: string
 *                   countryCode:
 *                     type: string
 *               confirmPassword:
 *                 type: string
 *               businessPartners:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     businessPartnerId:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
 *                             enum:
 *                               - ASSOCIATE
 *                               - ADMIN
 *     responses:
 *       '200':
 *         description: Successful creation of user associate.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 mobile:
 *                   type: object
 *                   properties:
 *                     countryCode: 
 *                       type: string
 *                     number:
 *                       type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 userType:
 *                   type: string
 *                   enum:
 *                     - DOCTOR
 *                     - AGENT
 *                 userPreferences:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                       enum:
 *                         - en
 *                         - id
 *                     weight:
 *                       type: string
 *                       enum:
 *                         - KG
 *                         - POUND
 *                     height:
 *                       type: string
 *                       enum:
 *                         - FEET-INCH
 *                         - CENTIMETERS
 *                         - METERS
 *                 platformPartner:
 *                   type: string
 *                 businessPartners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deletedBy:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           timeStamp:
 *                             type: string
 *                             format: date-time
 *                       isActive:
 *                         type: boolean
 *                       isDeleted:
 *                         type: boolean
 *                       _id:
 *                         type: string 
 *                       businessPartnerId: 
 *                         type: string
 *                       businessPartnerName:
 *                         type: string
 *                       diplayName:
 *                         type: string
 *                       speciality:
 *                         type: string
 *                       email:
 *                         type: string
 *                       layout:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             layoutValues:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             _id:
 *                               type: string
 *                             layoutName:
 *                               type: string
 *                               enum:
 *                                 - FLOOR
 *                                 - WARD
 *                                 - DEPARTMENT
 *                       location:
 *                         type: string
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             role:
 *                               type: string
 *                               enum:
 *                                 - INTERNAL_DOCTOR
 *                                 - EXTERNAL_DOCTOR
 *                                 - ASSOCIATE
 *                                 - ADMIN
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 vigoId:
 *                   type: string
 *                 loginId:
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
 *         description: Invalid request body.
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
router.route('/userAgents')
  .get(authorize(), businessPartnerService.addBusinessPartnerToQuery, controller.listUserAgents)
  .post(authorize(), controller.createUserAgent);

/**
 * @swagger
 * /v1/doctor/users/userAgents/Profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user associate profile
 *     description: Access user associate profile using this endpoint.
 *     operationId: getUserAssociateProfile
 *     responses:
 *       '200':
 *         description: Successful loading of user agents profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 mobile:
 *                   type: object
 *                   properties:
 *                     countryCode: 
 *                       type: string
 *                     number:
 *                       type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 userType:
 *                   type: string
 *                   enum:
 *                     - DOCTOR
 *                     - AGENT
 *                 userPreferences:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                       enum:
 *                         - en
 *                         - id
 *                     weight:
 *                       type: string
 *                       enum:
 *                         - KG
 *                         - POUND
 *                     height:
 *                       type: string
 *                       enum:
 *                         - FEET-INCH
 *                         - CENTIMETERS
 *                         - METERS
 *                 platformPartner:
 *                   type: string
 *                 businessPartners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deletedBy:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           timeStamp:
 *                             type: string
 *                             format: date-time
 *                       isActive:
 *                         type: boolean
 *                       isDeleted:
 *                         type: boolean
 *                       _id:
 *                         type: string 
 *                       businessPartnerId: 
 *                         type: string
 *                       businessPartnerName:
 *                         type: string
 *                       diplayName:
 *                         type: string
 *                       speciality:
 *                         type: string
 *                       email:
 *                         type: string
 *                       layout:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             layoutValues:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             _id:
 *                               type: string
 *                             layoutName:
 *                               type: string
 *                               enum:
 *                                 - FLOOR
 *                                 - WARD
 *                                 - DEPARTMENT
 *                       location:
 *                         type: string
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             role:
 *                               type: string
 *                               enum:
 *                                 - INTERNAL_DOCTOR
 *                                 - EXTERNAL_DOCTOR
 *                                 - ASSOCIATE
 *                                 - ADMIN
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 vigoId:
 *                   type: string
 *                 loginId:
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
 *     security:
 *       - bearerAuth: []
 */

  router.route('/userAgents/profile')
  .get(authorize(), controller.loggedIn);

/**
 * @swagger
 * /v1/doctor/users/userAgents/duplicateLoginId:
 *   post:
 *     tags:
 *       - User
 *     summary: Duplicate LoginId.
 *     description: Duplicate loginId.
 *     operationId:  duplicateLoginID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginId: 
 *                 type: string
 *     responses:
 *       '200':
 *         description: response for duplicate login ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isDuplicate:
 *                   type: boolean
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

  router.route('/userAgents/duplicateLoginId')
  .post(authorize(), controller.checkDuplicateLoginId)

/**
 * @swagger
 * /v1/doctor/users/{docId}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get doctor profile by doctor Id.
 *     description: Getting doctor profile by mentioned doctor Id.
 *     operationId: getDoctorProfileByDoctorId
 *     parameters:
 *       - name: docId
 *         in: path
 *         description: Doctor-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful loading of doctors profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 mobile:
 *                   type: object
 *                   properties:
 *                     countryCode: 
 *                       type: string
 *                     number:
 *                       type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 userType:
 *                   type: string
 *                   enum:
 *                     - DOCTOR
 *                     - AGENT
 *                 userPreferences:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                       enum:
 *                         - en
 *                         - id
 *                     weight:
 *                       type: string
 *                       enum:
 *                         - KG
 *                         - POUND
 *                     height:
 *                       type: string
 *                       enum:
 *                         - FEET-INCH
 *                         - CENTIMETERS
 *                         - METERS
 *                 platformPartner:
 *                   type: string
 *                 businessPartners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       isActive:
 *                         type: boolean
 *                       isDeleted:
 *                         type: boolean
 *                       _id:
 *                         type: string 
 *                       businessPartnerId: 
 *                         type: string
 *                       businessPartnerName:
 *                         type: string
 *                       diplayName:
 *                         type: string
 *                       speciality:
 *                         type: string
 *                       email:
 *                         type: string
 *                       layout:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             layoutValues:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             _id:
 *                               type: string
 *                             layoutName:
 *                               type: string
 *                               enum:
 *                                 - FLOOR
 *                                 - WARD
 *                                 - DEPARTMENT
 *                       location:
 *                         type: string
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             role:
 *                               type: string
 *                               enum:
 *                                 - INTERNAL_DOCTOR
 *                                 - EXTERNAL_DOCTOR
 *                                 - ASSOCIATE
 *                                 - ADMIN
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 vigoId:
 *                   type: string
 *                 loginRole:
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
 *       '404':
 *         description: Invalid docId.
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
 *   patch:
 *     tags:
 *       - User
 *     summary: update doctor profile.
 *     description: updating doctor profile of mentioned doctor Id.
 *     operationId: patchDoctorProfileByDoctorId
 *     parameters:
 *       - name: docId
 *         in: path
 *         description: Doctor-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *       - name: business
 *         in: header
 *         description: business partner-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               mobile:
 *                 type: object
 *                 properties:
 *                   countryCode:
 *                     type: string
 *                   number:
 *                     type: string
 *     responses:
 *       '200':
 *         description: Successful updation of doctors profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 mobile:
 *                   type: object
 *                   properties:
 *                     countryCode: 
 *                       type: string
 *                     number:
 *                       type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 userType:
 *                   type: string
 *                   enum:
 *                     - DOCTOR
 *                     - AGENT
 *                 userPreferences:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                       enum:
 *                         - en
 *                         - id
 *                     weight:
 *                       type: string
 *                       enum:
 *                         - KG
 *                         - POUND
 *                     height:
 *                       type: string
 *                       enum:
 *                         - FEET-INCH
 *                         - CENTIMETERS
 *                         - METERS
 *                 platformPartner:
 *                   type: string
 *                 businessPartners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       isActive:
 *                         type: boolean
 *                       isDeleted:
 *                         type: boolean
 *                       _id:
 *                         type: string 
 *                       businessPartnerId: 
 *                         type: string
 *                       businessPartnerName:
 *                         type: string
 *                       diplayName:
 *                         type: string
 *                       speciality:
 *                         type: string
 *                       email:
 *                         type: string
 *                       layout:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             layoutValues:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             _id:
 *                               type: string
 *                             layoutName:
 *                               type: string
 *                               enum:
 *                                 - FLOOR
 *                                 - WARD
 *                                 - DEPARTMENT
 *                       location:
 *                         type: string
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             role:
 *                               type: string
 *                               enum:
 *                                 - INTERNAL_DOCTOR
 *                                 - EXTERNAL_DOCTOR
 *                                 - ASSOCIATE
 *                                 - ADMIN
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 vigoId:
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
 *       '404':
 *         description: Invalid business header or docId.
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
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete doctor.
 *     description: Deleting doctor by mentioned doctor Id.
 *     operationId: deleteDoctoreByDoctorId
 *     parameters:
 *       - name: docId
 *         in: path
 *         description: Doctor-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *       - name: business
 *         in: header
 *         description: business partner-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful deletion of doctors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
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
 *         description: Invalid business header or docId.
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
.route('/:userId')
.get(authorize(LOGGED_USER), controller.get)
.patch(authorize(LOGGED_USER), businessPartnerService.validateBusinessPartner, controller.updateDoctor)
.delete(authorize(LOGGED_USER), businessPartnerService.validateBusinessPartner, controller.removeDoctor)

/**
 * @swagger
 * /v1/doctor/users/userAgents/{userId}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user associate profile.
 *     description: Getting user associate profile by mentioned user Id.
 *     operationId: getUserAssociateProfileByUserId
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: User-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful loading of user associate profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 mobile:
 *                   type: object
 *                   properties:
 *                     countryCode: 
 *                       type: string
 *                     number:
 *                       type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 userType:
 *                   type: string
 *                   enum:
 *                     - DOCTOR
 *                     - AGENT
 *                 userPreferences:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                       enum:
 *                         - en
 *                         - id
 *                     weight:
 *                       type: string
 *                       enum:
 *                         - KG
 *                         - POUND
 *                     height:
 *                       type: string
 *                       enum:
 *                         - FEET-INCH
 *                         - CENTIMETERS
 *                         - METERS
 *                 platformPartner:
 *                   type: string
 *                 businessPartners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deletedBy:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           timeStamp:
 *                             type: string
 *                             format: date-time
 *                       isActive:
 *                         type: boolean
 *                       isDeleted:
 *                         type: boolean
 *                       _id:
 *                         type: string 
 *                       businessPartnerId: 
 *                         type: string
 *                       businessPartnerName:
 *                         type: string
 *                       diplayName:
 *                         type: string
 *                       speciality:
 *                         type: string
 *                       email:
 *                         type: string
 *                       layout:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             layoutValues:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             _id:
 *                               type: string
 *                             layoutName:
 *                               type: string
 *                               enum:
 *                                 - FLOOR
 *                                 - WARD
 *                                 - DEPARTMENT
 *                       location:
 *                         type: string
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             role:
 *                               type: string
 *                               enum:
 *                                 - INTERNAL_DOCTOR
 *                                 - EXTERNAL_DOCTOR
 *                                 - ASSOCIATE
 *                                 - ADMIN
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 vigoId:
 *                   type: string
 *                 loginId:
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
 *       '404':
 *         description: Invalid userId.
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
 *   patch:
 *     tags:
 *       - User
 *     summary: update user associate profile.
 *     description: updating user associate of mentioned user Id.
 *     operationId: updateUserAssociateProfileByUserId
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: User-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *       - name: business
 *         in: header
 *         description: business partner-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               mobile:
 *                 type: object
 *                 properties:
 *                   countryCode:
 *                     type: string
 *                   number:
 *                     type: string
 *     responses:
 *       '200':
 *         description: Successful updation of user associate profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 mobile:
 *                   type: object
 *                   properties:
 *                     countryCode: 
 *                       type: string
 *                     number:
 *                       type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 userType:
 *                   type: string
 *                   enum:
 *                     - DOCTOR
 *                     - AGENT
 *                 userPreferences:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                       enum:
 *                         - en
 *                         - id
 *                     weight:
 *                       type: string
 *                       enum:
 *                         - KG
 *                         - POUND
 *                     height:
 *                       type: string
 *                       enum:
 *                         - FEET-INCH
 *                         - CENTIMETERS
 *                         - METERS
 *                 platformPartner:
 *                   type: string
 *                 businessPartners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deletedBy:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           timeStamp:
 *                             type: string
 *                             format: date-time
 *                       isActive:
 *                         type: boolean
 *                       isDeleted:
 *                         type: boolean
 *                       _id:
 *                         type: string 
 *                       businessPartnerId: 
 *                         type: string
 *                       businessPartnerName:
 *                         type: string
 *                       diplayName:
 *                         type: string
 *                       speciality:
 *                         type: string
 *                       email:
 *                         type: string
 *                       layout:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             layoutValues:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             _id:
 *                               type: string
 *                             layoutName:
 *                               type: string
 *                               enum:
 *                                 - FLOOR
 *                                 - WARD
 *                                 - DEPARTMENT
 *                       location:
 *                         type: string
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             role:
 *                               type: string
 *                               enum:
 *                                 - INTERNAL_DOCTOR
 *                                 - EXTERNAL_DOCTOR
 *                                 - ASSOCIATE
 *                                 - ADMIN
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 vigoId:
 *                   type: string
 *                 loginId:
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
 *       '404':
 *         description: Invalid userId or business header.
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
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user associate.
 *     description: Deleting user associate by mentioned user Id.
 *     operationId: deleteUserAssociatesByUserId
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: User-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *       - name: business
 *         in: header
 *         description: business partner-ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful deletion of user associate.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
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
 *         description: Invalid business header or docId.
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

router.route('/userAgents/:userId')
.get(authorize(LOGGED_USER), controller.get)
.patch(authorize(LOGGED_USER), businessPartnerService.validateBusinessPartner, controller.updateUserAgent)
.delete(authorize(LOGGED_USER), businessPartnerService.validateBusinessPartner, controller.removeUserAgent)
/**
 * @swagger
 *  /v1/doctor/users/{docId}/activeCaseCount:
 *   get:
 *     tags:
 *       - User
 *     summary: Get active case count
 *     description: Getting active case counts for a doctor by doctor-id.
 *     operationId: getActiveCaseCount
 *     parameters:
 *       - name: docId
 *         in: path
 *         description: Doctor ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *       - name: business
 *         in: header
 *         description: Business partner ID
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful loading of active case counts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
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
 *         description: Invalid business header or docId.
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
  .route('/:userId/activeCaseCount')
  .get(authorize(), businessPartnerService.validateBusinessPartner, controller.getActiveCaseCount)

module.exports = router;


