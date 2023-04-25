const businessEnquiryClient = require("@communication/client/business.enquiry.client")
const APIError = require('@utils/APIError');

exports.createBusinessEnquiry = async (req, res, next) => {
   try {
      let businessEnquiry = await businessEnquiryClient.createBusinessEnquiry(req.body)
      res.json(businessEnquiry)
   } catch (error) {
      next(new APIError(error))
   }
}