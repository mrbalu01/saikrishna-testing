const httpStatus = require('http-status');
const APIError = require('@utils/APIError');
const User = require("@models/auth/user.model")

exports.addPlatformPartner = async (req, res, next) => {
   try {
      const { userId } = req.session

      let user = await User.findById(userId)
      if (!user) {
         return next(new APIError(
            {
               message: 'Business Partner does not exist',
               status: httpStatus.NOT_FOUND,
            }
         ))
      }
      req.body.platformPartner = user.platformPartner
      return next()
   } catch (error) {
      next(error)
   }
}

exports.addPlatformPartnerToQuery = async (req, res, next) => {
   try {
      const { userId } = req.session
      let user = await User.findById(userId)
      if (!user) {
         return next(new APIError(
            {
               message: 'Business Partner does not exist',
               status: httpStatus.NOT_FOUND,
            }
         ))
      }
      req.query.platformPartner = user.platformPartner
      return next()
   } catch (error) {
      next(error)
   }
}