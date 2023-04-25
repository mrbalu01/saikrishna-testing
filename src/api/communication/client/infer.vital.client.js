const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "infer.vital.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.VitalInfrenceService(grpcConfig.inference, grpc.credentials.createInsecure())

exports.GetAllVitalLatestData = (request) => {
   return new Promise((resolve, reject) => {
      client.GetAllVitalLatestData(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.GetVitalLatestData = (request) => {
   return new Promise((resolve, reject) => {
      client.GetVitalLatestData(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.getVitalDetailData = (request) => {
   return new Promise((resolve, reject) => {
      client.GetVitalDetailData(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.getVitalSummary = (request) => {
   return new Promise((resolve, reject) => {
      client.GetVitalSummary(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         resolve(response)
      })
   })
}