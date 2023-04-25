const FireAlertClient = require('@communication/client/fire.alert.client');

exports.fireCustomizedAlert = async (doctor, event, status, category) => {
   try {
      console.log('Firing Customized CASE ALERT')
      const { _id, platformPartner } = doctor
      await FireAlertClient.fireCustomizedAlert({
         alertData: {
            platformPartner,
            doctor: _id,
            customMessage: {
               sendTo: 'DOCTOR'
            }
         }, event, status, category
      })
      return
   } catch (error) {
      console.log(error)
      throw error
   }
}
