const InferenceVitalClient = require('@communication/client/infer.vital.client');
const NotificationClient = require('@communication/client/notification.client');
const _ = require("lodash"); 

exports.getAllVitalLatestData = async (req, res, next) => {
   try {
      const { customerCase } = req.locals
      const { caseNumber } = customerCase
      let vitals = await InferenceVitalClient.GetAllVitalLatestData({ caseNumber })
      return res.json(vitals)
   } catch (error) {
      next(error)
   }
}

exports.getVitalLatestData = async (req, res, next) => {
   try {
      const { customerCase } = req.locals
      const { caseNumber } = customerCase
      const { code } = req.body
      let vitals = await InferenceVitalClient.GetVitalLatestData({ caseNumber, code })
      return res.json(vitals)
   } catch (error) {
      next(error)
   }
}

exports.getVitalDetails = async (req, res, next) => {
   try {
      const { customerCase } = req.locals
      const { caseNumber } = customerCase
      const { type, code } = req.body
      const { page=1 ,perPage=30} = req.query
      let vitals = await InferenceVitalClient.getVitalDetailData({ caseNumber, type, code,page,perPage })
      return res.json(vitals)
   } catch (error) {
      next(error)
   }
}

exports.getVitalSummary = async (req, res, next) => {
   try {
      const { customerCase } = req.locals
      const { caseNumber } = customerCase
      const { fromTimeStamp, toTimeStamp } = req.body
      console.log(`getVitalSummary :: caseNumber: ${caseNumber}, From: ${fromTimeStamp}, To: ${toTimeStamp}`)
      let inferVitalData = await InferenceVitalClient.getVitalSummary({ caseNumber, fromTimeStamp, toTimeStamp })
      console.log(`getVitalSummary :: got vital data from inference service. `)
      if (inferVitalData.inferVitals) {
         console.log(`getVitalSummary :: Number of inferred vitals: ${inferVitalData.inferVitals.length}`)
      } else {
         console.log('getVitalSummary :: got Invalid infervital data')
      }
      req.query.id = req.params.id
      req.query.type = 'EVENT'
      req.query.fromTimeStamp = inferVitalData.fromTimeStamp
      req.query.toTimeStamp = inferVitalData.toTimeStamp
      let notifications = await NotificationClient.getNotificationsForPeriod(req.query)

      let allTimeStamps = new Set()
      let vitalDataMap = {}
      let vitalSummary = {}
      let notificationsMap = {}
      let vitalCodes = ['RR', 'HR', 'TEMP', 'SPO2', 'BP', 'ATEMP']
      if (inferVitalData.inferVitals) {
         for (let vitalData of inferVitalData.inferVitals) {
            allTimeStamps.add(vitalData.timeStamp)
            if (! vitalDataMap[vitalData.timeStamp]) {
               vitalDataMap[vitalData.timeStamp] = {}
            }

            vitalDataMap[vitalData.timeStamp][vitalData.vital.code] = vitalData
         }

         for (let notification of notifications) {
            allTimeStamps.add(notification.timeStamp)
            notificationsMap[notification.timeStamp] = notification
         }

         for(let timeStamp of allTimeStamps) {
            for (let vitalCode of vitalCodes) {
               if (!vitalSummary[vitalCode]) {
                  vitalSummary[vitalCode] = []
               }
               if (!vitalDataMap[timeStamp]) {
                  vitalDataMap[timeStamp] = {}
               }
               if (vitalDataMap[timeStamp][vitalCode]) {
                  vitalSummary[vitalCode].push(vitalDataMap[timeStamp][vitalCode])
               }
               else {
                  let dummyVital = {timeStamp, status: 'INVALID', analysis: {score:-1}}
                  vitalSummary[vitalCode].push(dummyVital)
               }
            }
         }
      } else {
         vitalCodes.forEach(code => {
            vitalSummary[code] = []
         })
      }

      for (let notification of notifications) {
         let vitalDataForEvent = {}
         for (let vitalCode of vitalCodes) {
            let minDiffTimeStamp = 0
            let min = Number.MAX_SAFE_INTEGER
            for(let timeStamp of allTimeStamps) {
               let diff = Math.abs(parseInt(timeStamp) - parseInt(notification.timeStamp))
               if (diff < min && vitalDataMap[timeStamp] && vitalDataMap[timeStamp][vitalCode]) {
                  min = diff
                  minDiffTimeStamp = timeStamp
               }
            }

            if(vitalDataMap[minDiffTimeStamp]) {
               vitalDataForEvent[vitalCode] = vitalDataMap[minDiffTimeStamp][vitalCode]
               vitalDataForEvent[vitalCode].nearestVitalTimeStamp = minDiffTimeStamp
            }
            else
               vitalDataForEvent[vitalCode] = {}
         }
         notification.vitals = vitalDataForEvent
      }

      let notificationsResult = []
      for(let timeStamp of allTimeStamps) {
         if (notificationsMap[timeStamp]) {
            notificationsResult.push(notificationsMap[timeStamp])
         }
         else {
            let obj = {}
            obj.timeStamp = timeStamp
            notificationsResult.push(obj)
         }
      }

      notificationsResult = _.sortBy(notificationsResult, ['timeStamp']);
      vitalSummary.notifications = notificationsResult
      vitalSummary.fromTimeStamp = inferVitalData.fromTimeStamp
      vitalSummary.toTimeStamp = inferVitalData.toTimeStamp
      vitalSummary.first = inferVitalData.first
      vitalSummary.last = inferVitalData.last
      if (inferVitalData.inferVitals) {
         console.log(`Total number of RR Vitals: ${vitalSummary['RR'].length}`)
         console.log(`Total number of HR Vitals: ${vitalSummary['HR'].length}`)
         console.log(`Total number of TEMP Vitals: ${vitalSummary['TEMP'].length}`)
         console.log(`Total number of SPO2 Vitals: ${vitalSummary['SPO2'].length}`)
         console.log(`Total number of BP Vitals: ${vitalSummary['BP'].length}`)
         console.log(`Total number of ATEMP Vitals: ${vitalSummary['ATEMP'].length}`)
      }
      console.log(`From: ${vitalSummary.fromTimeStamp}`)
      console.log(`To: ${vitalSummary.toTimeStamp}`)
      return res.json(vitalSummary)
   } catch (error) {
      console.log(error)
      next(error)
   }
}
