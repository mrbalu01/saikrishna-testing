const express = require('express');
const service = require('@services/condition.service');
const { authorize } = require('@middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /v1/doctor/conditions:
 *   get:
 *     summary: Get conditions list
 *     responses:
 *       200:
 *         description: Get conditions list.
 *         content:
 *           application/json:
 */
router
   .route('/')
   .get(authorize(), service.getConditions);

module.exports = router;