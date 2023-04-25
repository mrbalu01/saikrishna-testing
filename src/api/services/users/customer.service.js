const customerClient = require('@communication/client/customer.client')

exports.findCustomer = async (req, res, next) => {
   try {
      let { customer } = req.body
      const { id, mobile, firstName, lastName, countryIso2, patientId } = customer
      customer = await customerClient.findOrCreate(id, mobile, firstName, lastName, patientId)
      req.body.customer = {
         id: customer.id, firstName: (firstName ? firstName : customer.firstName),
         lastName: (lastName ? lastName : customer.lastName), email: customer.email,
         mobile: customer.mobile, countryIso2, patientId: customer.patientId
      }
      return next()
   } catch (error) {
      next(error)
   }
}

exports.getCustomerList = async (req, res, next) => {
   try {
      req.locals = {}
      let customers = await customerClient.getCustomerList(req.query)
      req.locals = { customers }
      return next()
   } catch (error) {
      next(error)
   }
}

exports.getCustomerListByPhoneNumber = async (req, res, next) => {
   try {
      let { mobileNumber } = req.params;
      let { countryCode } = req.query;
      console.log(mobileNumber)
      let customers = await customerClient.getCustomerListByPhoneNumber({ 'mobile': mobileNumber, 'countryCode': countryCode })
      res.json(customers ? customers : [])
   } catch (error) {
      next(error)
   }
}

exports.registerPatient = async (req, res, next) => {
   try {
      let customer = await customerClient.registerPatient(req.body)
      req.body.customer = customer;
      return res.json(customer)
   } catch (error) {
      next(error)
   }
}