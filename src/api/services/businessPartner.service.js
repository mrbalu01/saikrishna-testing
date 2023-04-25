const BusinessPartnerClient = require('@communication/client/businessPartner.client')
const APIError = require('@utils/APIError');
const httpStatus = require('http-status');
const { fullModeKey } = require('@config/vars.js')

exports.create = async (req, res, next) => {
   try {
      req.body.platformPartner = req.query.platformPartner;
      const businessPartner = await BusinessPartnerClient.createBusinessPartner(req.body);
      res.json(businessPartner);
   } catch (error) {
      next(error);
   }
}

exports.getBusinessPartner = async (req, res, next) => {
   try {
      const { id } = req.params
      const businessPartner = await BusinessPartnerClient.getBusinessPartnerById(id)
      req.locals = { businessPartner }
      return next()
   } catch (error) {
      next(error)
   }
}

exports.getBusinessPartners = async (req, res, next) => {
   try {
      const { serviceEnablerId } = req.query;
      if (serviceEnablerId) {
         const businessPartners = await BusinessPartnerClient.getBusinessPartner({ serviceEnablerId: serviceEnablerId })
         return businessPartners
      } else {
         return next(new APIError({
            message: 'Service Enabler Id has to be provided.',
            status: httpStatus.BAD_REQUEST,
         }))
      }
   } catch (error) {
      next(error)
   }
}

exports.getBusinessPartnerById = async (req, res, next) => {
   try {
      let { business } = req.headers
      if (business) {
         const businessPartner = await BusinessPartnerClient.getBusinessPartnerById(business)
         req.body._businessPartner = businessPartner
         req.body.businessPartner = businessPartner.id
         req.body.platformPartner = businessPartner.platformPartner
         return next()
      } else {
         return next(new Error('Invalid Business partner'))
      }
   } catch (error) {
      next(error)
   }
}

exports.validateBusinessPartner = async (req, res, next) => {
   const { business } = req.headers
   const { businessPartners } = req.user
   const { fullMode, serviceEnablerId } = req.query;
   try {
      if (fullMode && fullModeKey && fullMode == fullModeKey) {
         return next()
      }
      // Validate requested businessPartner - They should be part of user businessPartners
      if (business) {
         if ((!businessPartners || !businessPartners.some(bp => bp.businessPartnerId == business)) && !businessPartners.some(bp => bp.businessPartnerId == serviceEnablerId)) {
            return next(new APIError(
               {
                  message: 'Invalid Business Partner Header',
                  status: httpStatus.NOT_FOUND,
               }
            ))
         }
      } else {
         return next(new APIError(
            {
               message: 'Missing Business Partner Header',
               status: httpStatus.NOT_FOUND,
            }
         ))
      }
      return next()
   } catch (error) {
      next(error)
   }
}

exports.addBusinessPartnerToQuery = async (req, res, next) => {
   try {
      const { business } = req.headers
      req.query.business = business ? business : '';
      req.query.businessPartner = business ? business : '';
      module.exports.validateBusinessPartner(req, res, next)
   } catch (error) {
      next(error)
   }
}