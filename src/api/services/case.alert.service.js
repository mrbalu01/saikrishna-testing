const APIError = require('@utils/APIError');
const CaseAlertClient = require("@communication/client/case.alert.client");

exports.addDoctorToCache = async (doctor) => {
   try {
      await CaseAlertClient.addDoctorToCache(doctor)
   } catch (error) {
      console.log('Doctor cache update failed:', error)
      throw new APIError(error)
   }
}