const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "case.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.CaseService(grpcConfig.patient, grpc.credentials.createInsecure(),{
   "grpc.max_receive_message_length": 1024 * 1024 * 30,
   "grpc.max_send_message_length": 1024 * 1024 * 30
})

exports.getCustomerCases = (query) => {
   return new Promise((resolve, reject) => {
      client.getCustomerCases(query, (error, response) => {
         if (error) {
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.getCaseReportGroupByCaseNumber = (query) => {
   return new Promise((resolve, reject) => {
      client.getCaseReportGroupByCaseNumber(query, (error, response) => {
         if (error) {
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.getCustomerCaseById = (id) => {
   return new Promise((resolve, reject) => {
      client.getCustomerCaseById({ id }, (error, response) => {
         if (error) {
            console.log(error);
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.getCustomerAndCaseDetailsByCaseId = (id) => {
   return new Promise((resolve, reject) => {
      client.getCustomerAndCaseDetailsByCaseId({ id }, (error, response) => {
         if (error) {
            return reject(error)
         }
         resolve(response)
      })
   });
}

exports.getCustomerCasesByStage = (query) => {
   return new Promise((resolve, reject) => {
      client.getCustomerCasesByStage(query, (error, response) => {
         if (error) {
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.isActiveCasePresentForMobile = (query) => {
   return new Promise((resolve, reject) => {
      client.isActiveCasePresentForMobile(query, (error, response) => {
         if (error) {
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.getActiveCaseCount = (query) => {
   return new Promise((resolve, reject) => {
      client.getActiveCaseCount(query, (error, response) => {
         if (error) {
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.createCase = (requestBody) => {
   return new Promise((resolve, reject) => {
      client.createCase(requestBody , (error, response) => {
         if (error) {
            return reject(error)
         }
         resolve(response)
      })
   })
}