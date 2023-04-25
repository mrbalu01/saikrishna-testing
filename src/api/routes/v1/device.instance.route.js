const express = require('express');
const service = require('@services/device.instance.service');
const { authorize } = require('@middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /v1/doctor/deviceInstance/validatePatch:
 *   post:
 *     parameters:
 *      - in: query
 *        name: patchId
 *        required: true
 *        description: patchId to validate
 *        schema:
 *           type: string
 *     summary: Validate Patch
 *     responses:
 *       200:
 *         description: validate Patch.
 *         content:
 *           application/json:
 */
router.route('/validatePatch')
   .post(authorize(), service.validatePatch);

module.exports = router;