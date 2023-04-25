const httpStatus = require('http-status');
const APIError = require('@utils/APIError');
const DeviceInstanceClient = require('@communication/client/deviceInstance.client')

exports.validatePatch = async (req, res, next) => {

   const { patchId } = req.query
   console.log("device.instance.service::validatePatch patchId: ", patchId)

   if (patchId) {
      try {
         deviceInstance = await DeviceInstanceClient.validate(patchId)
         return res.json({ isValid: true });
      } catch (error) {

         return res.json({
            isValid: false,
            message: error.message
         });
      }
   } else {
      next(new APIError({
         message: "Missing patchId in the request.",
         status: httpStatus.BAD_REQUEST
      }))
   }
}

