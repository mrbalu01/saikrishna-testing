const express = require('express');
const service = require("@services/build/build.info.service")
const router = express.Router();

/**
 *@swagger
 * /v1/doctor/build-info:
 *   get:
 *      summary: Get Build Information
 *      description: Get Build Information
 */
router
   .route('/')
   .get(service.getBuildInformation);

module.exports = router;
