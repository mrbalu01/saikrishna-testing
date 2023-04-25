const service = require('@services/businessPartner.service')
const APIError = require('@utils/APIError');
const Logger = require("@config/logger")
const LoggerFactory = new (require("@config/loggerFactory"))("BusinessPartner.controller")

exports.get = async (req, res, next) => {
   try {
      const { businessPartner } = req.locals
      res.json(businessPartner)
   } catch (error) {
      next(error)
   }
}

/**
 * Get businessPartner list
 * @public
 */
exports.list = async (req, res, next) => {
   try {
      const businessPartners = await service.getBusinessPartners(req, res, next)
      Logger.info(LoggerFactory.log({ method: "list", message: 'Business Partner listed successfully' }))
      res.json(businessPartners);
   } catch (error) {
      Logger.info(LoggerFactory.log({ method: "getBusinessPartners", error }))
      next(new APIError(error))
   }
}