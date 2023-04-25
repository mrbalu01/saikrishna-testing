const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "case.localalarms.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.CaseLocalAlarmsService(grpcConfig.patient, grpc.credentials.createInsecure())

exports.getCaseLocalAlarms = (request) => {
   return new Promise((resolve, reject) => {
      client.getCaseLocalAlarms(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response)
      })
   })
}