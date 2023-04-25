const caseClient = require('@communication/client/case.client');
const caseLocalAlarmsClient = require('@communication/client/case.localalarms.client');
const APIError = require('@utils/APIError');
const conditionClient = require("@communication/client/condition.client");
const TimeConverter = require('@utils/time.converter');
const BusinessPartnerClient = require('@communication/client/businessPartner.client');

exports.getCustomerCases = async (req, res, next) => {
   try {
      req.locals = {}
      console.log("case.service::getCustomerCases query: ", req.query)

      let customers = await caseClient.getCustomerCases(req.query)
      if (!customers.patientCases) {
         customers.patientCases = []
      }

      // Add startTime and endTime attributes for UI
      for (let patientCase of customers.patientCases) {

         if (!patientCase.history)
            continue;

         for (let caseHistory of patientCase.history) {
            if (caseHistory.stage === 'LIVESTREAMING')
               patientCase.startTime = Number(caseHistory.createdAt);
            if (caseHistory.stage === 'COMPLETED') {
               patientCase.endTime = Number(caseHistory.createdAt);
               break;
            }
         }

         let totalDuration = patientCase.totalDuration;
         // Calculate endTime if the case is not completed yet
         if (!patientCase.endTime
            && patientCase.startTime
            && totalDuration && totalDuration.duration && totalDuration.durationUnits) {
            patientCase.endTime = patientCase.startTime +
               1000 * TimeConverter.convertToSecond(totalDuration.duration, totalDuration.durationUnits)
         }
      }

      res.json(customers)
   } catch (error) {
      next(error)
   }
}

exports.getCaseReportGroupByCaseNumber = async (req, res, next) => {
   try {
      req.locals = {}
      req.query.isFixedDuration = "true"
      console.log("case.service::getCaseReportGroupByCaseNumber query: ", req.query)

      let response = await caseClient.getCaseReportGroupByCaseNumber(req.query)
      // Add DOB
      if (response && response.reports) {
         for (let report of response.reports) {
            customer = report.customer;
            customer.age = customer.dob ? TimeConverter.convertDobToAge(customer.dob) : null;
         }
      }

      res.json(response)
   } catch (error) {
      next(error)
   }
}

exports.getCustomerCase = async (req, res, next) => {
   try {
      let { id } = req.params
      let customerCase = await caseClient.getCustomerCaseById(id)
      let localAlarms = await caseLocalAlarmsClient.getCaseLocalAlarms({ customerCase: id })
      if (customerCase) {
         customerCase.alarms = localAlarms.alarms
         customerCase.settings = localAlarms.settings
         req.locals = { customerCase }
         next()
      } else {
         next(new APIError({ message: `Case not found for id ${id}` }))
      }
   } catch (error) {
      next(error)
   }
}

exports.getCustomerCasesByStage = async (req, res, next) => {
   try {
      req.locals = {}
      console.log(req.query)
      let customers = await caseClient.getCustomerCasesByStage(req.query)
      if (!customers.patientCases) {
         customers.patientCases = []
      }
      res.json(customers)
   } catch (error) {
      next(error)
   }
}

exports.getCondition = async (req, res, next) => {
   try {
      let { condition } = req.body
      if (condition) {
         let response = await conditionClient.getConditionById(condition.id);
         if (response) {
            req.body.condition = {
               id: response.id,
               name: response.name,
               duration: response.duration,
               devices: response.devices
            }
         }
      }
      next();
   } catch (error) {
      next(error)
   }
}

exports.createCase = async (req, res, next) => {
   try {
      if (req.body && req.body.condition && req.body.condition.devices) {
         for (let device of req.body.condition.devices) {
            if (device.name.toUpperCase() === '1AX') {
               req.body.caseType = 'SMART_HEART'
            }
         }
      }
      let customerCase = await caseClient.createCase(req.body);
      return res.json(customerCase);
   } catch (error) {
      next(error)
   }
}

exports.setCreatedBy = async (req, res, next) => {
   try {
      const { entity, firstName, lastName } = req.session
      if (entity) {
         req.body.createdBy = {
            id: entity,
            firstName,
            lastName,
            source: 'VIGO_CLINIC'
         }
      }
      next();
   } catch (error) {
      next(error)
   }
}

exports.setServiceEnabler = async (req, res, next) => {
   try {
      const { business } = req.query;
      if (business) {
         const businessPartner = await BusinessPartnerClient.getBusinessPartnerById(business);
         req.body.serviceEnabler = businessPartner.serviceEnabler;
         req.body.serviceEnabler["id"] = businessPartner.id
         req.body.serviceEnabler["name"] = businessPartner.name
      }
      next();
   } catch (error) {
      next(error);
   }
}
