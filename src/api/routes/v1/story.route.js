const express = require('express');
const controller = require('@controllers/story.controller');
const { authorize } = require('@middlewares/auth');
const platformPartnerService = require('@services/platformPartner.service');
const router = express.Router();

/**
 * @swagger
 * /v1/doctor/story:
 *   get:
 *      #deprecated: true
 *      summary: Deprecated, Get List of Stories [Images] from PageContents 
 *      description: >
 *        Retrieve list of Stories [Images] from /pageContents service with the
 *        following implicit filter 
 *          - client = 'DOCTOR_APP'
 *          - feature = 'Story'
 *          - contentType = 'IMAGE'
 *          - platformPartner = Platform PartnerId of logged in User 
 *
 *        The result is transformed in to simple list.
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
 *      responses:
 *       200:
 *         description: List of stories.
 *         content:
 *           application/json:
 *       401:
 *         description: Unauthorized. Provide valid JWT token in header.
 *         content: {}
 */
router.route('/')
  .get(authorize(), platformPartnerService.addPlatformPartnerToQuery, controller.getStories)

module.exports = router;
