const express = require('express');
const controller = require('@controllers/country.controller');

const router = express.Router();

/**
 * @swagger
 * /v1/doctor/countries:
 *   get:
 *     summary: Get countries list
 *     responses:
 *       200:
 *         description: Get countries list.
 *         content:
 *           application/json:
 */
router.route('/')
  .get(controller.getCountries)

module.exports = router;
