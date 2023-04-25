const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "case.summary.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.CaseSummaryService(grpcConfig.dashboard, grpc.credentials.createInsecure())

exports.getCustomerCasesSummaryByStage = (request) => {
   return new Promise((resolve, reject) => {
      client.getCustomerCasesSummaryByStage(request, function (error, response) {
         if (error) {
            error.message = error.details
            return reject(error)
         }
         return resolve(response)
      });
   })
}

exports.getCaseCountByBusinessPartner = (request) => {
   return new Promise((resolve, reject) => {
      client.getCaseCountByBusinessPartner(request, function (error, response) {
         if (error) {
            error.message = error.details
            return reject(error)
         }
         return resolve(response)
      });
   })
}

exports.getCaseStatisticsByBusinessPartner = (request) => {
   return new Promise((resolve, reject) => {
      client.getCaseStatisticsByBusinessPartner(request, function (error, response) {
         if (error) {
            error.message = error.details
            return reject(error)
         }
         return resolve(response)
      });
   })
}