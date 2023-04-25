const CaseMessageClient = require('@communication/client/case.message.client')
const FireAlertClient = require("@communication/client/fire.alert.client")

exports.createCaseMessage = async (req, res, next) => {
   try {
      const { customerCase } = req.locals
      const { entity } = req.session
      req.query.customerCase = customerCase.id
      req.query.sentBy = entity
      req.query.recipients = [entity]
      req.query.text = req.body.text
      const caseMessage = await CaseMessageClient.createCaseMessage(req.query)
      await module.exports.sendMessageNotification(customerCase, req.body.text, entity)
      res.json(caseMessage)
   } catch (error) {
      next(error)
   }
}

exports.getAllCaseMessages = async (req, res, next) => {
   try {
      const { entity } = req.session
      req.query.recipient = entity
      const caseMessages = await CaseMessageClient.getAllCaseMessages(req.query)
      res.json(caseMessages)
   } catch (error) {
      next(error)
   }
}

exports.getCaseMessagesByRecipient = async (req, res, next) => {
   try {
      const { customerCase } = req.locals
      const { entity } = req.session
      req.query.recipient = entity
      req.query.customerCase = customerCase.id
      const caseMessages = await CaseMessageClient.getCaseMessagesByRecipient(req.query)
      res.json(caseMessages)
   } catch (error) {
      next(error)
   }
}

exports.markAsRead = async (req, res, next) => {
   try {
      const { customerCase } = req.locals
      const { entity } = req.session
      const caseMessage = await CaseMessageClient.markAsRead({
         caseMessage: req.body.caseMessageId,
         recipient: entity
      })
      res.json(caseMessage)
   }
   catch (error) {
      next(error)
   }
}

exports.sendMessageNotification = async (customerCase, message, doctorId) => {
   let sendTo = 'DOCTOR'
   let alertData = {
      caseNumber: customerCase.caseNumber,
      caseId: customerCase.id,
      platformPartner: customerCase.platformPartner,
      doctor: doctorId,
      customer: customerCase.customer.id.id,
      business: customerCase.business,
      plan: customerCase.plan,
      customMessage: {
         sendTo,
         email: false,
         sms: false,
         push: true,
         message
      }
   }

   let alertRequest = { alertData, code: "CUSTOMIZE_ALERT", event: message, status: '', catagory: null }
   console.log('alertRequest:', alertRequest)
   FireAlertClient.fireCustomizedAlert(alertRequest)
}