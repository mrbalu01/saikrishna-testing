const express = require('express');
const controller = require('@controllers/page.content.controller');
const platformPartnerService = require('@services/platformPartner.service');
const router = express.Router();
const { authorize } = require('@middlewares/auth');

/**
 * @swagger
 * /v1/doctor/pageContent:
 *   get:
 *      summary: Get PageContents Attributes i.e name/value pair for client - 'DOCTOR_APP'
 *      description: >
 *         The attributes from PageContents table filtered by client as 'DOCTOR_APP'
 *         and platformPartner of the logged in user.
 *      parameters:
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
 *      - name: query
 *        in: query
 *        description: Search text with in contentText.
 *        required: false
 *        schema:
 *           type: string
 *      - name: contentType
 *        in: query
 *        description: Content Type of the attribute
 *        required: false
 *        schema:
 *           type: string
 *           enum: ['IMAGE', 'TEXT', 'TEXT_IMAGE']
 *      - name: category
 *        in: query
 *        description: Category classification of the attributes.
 *        required: false
 *        schema:
 *           type: string
 *      - name: feature
 *        in: query
 *        description: Feature classification of the attributes. Example - Story,HelpQA
 *        required: false
 *        schema:
 *           type: string
 *      - name: language
 *        in: query
 *        description: Language
 *        required: false
 *        schema:
 *           type: string
 *           enum: ['en', 'id']
 *      - name: expired
 *        in: query
 *        description: expired flag
 *        required: false
 *        schema:
 *           type: boolean
 *      responses:
 *        200:
 *         description: List of attributes from the page content
 *         content:
 *           application/json:
 *        401:
 *         description: Unauthorized. Provide valid JWT token in header.
 *         content: {}
 */
router
   .route('/')
   .get(authorize(), platformPartnerService.addPlatformPartnerToQuery, controller.getPageContents);

module.exports = router;
