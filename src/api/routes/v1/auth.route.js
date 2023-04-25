const express = require('express');
const controller = require('@controllers/auth.controller');
const { authorize } = require('@middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /v1/doctor/auth/login:
 *   post:
 *     summary: Authorize doctor
 *     description: Get login token for the doctor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema: # Request body contents
 *            type: object
 *            properties:
 *              mobile:
 *                type: object
 *                properties:
 *                  number:
 *                    type: string
 *                  countryCode:
 *                    type: string
 *     responses:
 *       200:
 *         description: Doctor object with login token.
 *         content:
 *           application/json:
 */
router.route('/login')
  .post(controller.login)

/**
 * @swagger
 * /v1/doctor/auth/token:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Auth token
 *     description: getting auth token and identity.
 *     operationId: authToken
 *     parameters:
 *       - name: roomName
 *         in: query
 *         description: room name
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *       - name: identity
 *         in: query
 *         description: user identity
 *         required: true
 *         explode: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful loading of token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 identity:
 *                   type: string
 *                 token:
 *                   type: string
 *       '401':
 *         description: Unauthorized
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

  router.route('/token')
  .get(authorize(), controller.getTwilioAccessToken)

module.exports = router;
