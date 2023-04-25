const supportClient = require("@communication/client/support.client")
const APIError = require('@utils/APIError');

exports.referAPatient = async (req, res, next) => {
   try {
      req.body.platformPartner = req.query.platformPartner
      let support = await supportClient.createCallMeBack(req.body)
      res.json(support)
   } catch (error) {
      next(new APIError(error))
   }
}