const express = require('express');
const service = require('@services/help.question.service');
const platformPartnerService = require('@services/platformPartner.service');
const router = express.Router();
const { authorize } = require('@middlewares/auth');

/**
 * @swagger
 * /v1/doctor/help:
 *   get:
 *      #deprecated: true
 *      summary: Deprecated, Get List of help Question and Answers from PageContents 
 *      description: >
 *        Retrive list of help Questions from /pageContents service with the
 *        following implicit filter 
 *          - client = 'DOCTOR_APP' 
 *          - feature = 'HelpQA'
 *          - contentType = 'TEXT'
 *          - platformPartner = Platform PartnerId of logged in User 
 *  
 *        The 'attributeName' of record in PageContent table must 
 *        have 'Question' in its name with corresponding 'Answer' record.
 *          - Example attributeName : 
 *              - ['Page1_Question1', 'Page1_Answer1']
 *              - ['Faq_Question', 'Faq_Answer']    
 * 
 *        The result is transformed in to Question and Answers list.
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
 *      - name: category
 *        in: query
 *        description: Category classification of the attributes.
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
 *           default: 'en'
 *      - name: query
 *        in: query
 *        description: Search text with in contentText.
 *        required: false
 *        schema:
 *           type: string
 *      responses:
 *       200:
 *         description: List of help question and answers, grouped by category.
 *         content:
 *           application/json:
 *       401:
 *         description: Unauthorized. Provide valid JWT token in header.
 *         content: {}
 */
router
   .route('/')
   .get(authorize(), platformPartnerService.addPlatformPartnerToQuery, service.getHelpQuestions);

module.exports = router;