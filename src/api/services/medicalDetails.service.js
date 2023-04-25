const MedicalDetailsClient = require('@communication/client/medicalDetails.client')

exports.getMedicalDetailsByText = async (req) => {
   let { platformPartner, text } = req.query;
   console.log(`getMedicalDetailsByText platformPartner: ${platformPartner} text: ${text}`);

   const medicalDetails = await MedicalDetailsClient.getMedicalDetailsByText(platformPartner, text);
   if (medicalDetails && medicalDetails.options) {
      let result = medicalDetails.options.map(option => {
         return {
            'name': option.title,
            'type': option.type,
            'description': option.title
         };
      });
      return result;
   } else {
      throw new APIError({
         message: `No "${text}" configured in MedicalDetailsMaster`,
         status: httpStatus.NOT_FOUND,
      });
   }
}