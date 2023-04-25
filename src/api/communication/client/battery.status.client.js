const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "battery.status.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.BatteryStatusService(grpcConfig.patient, grpc.credentials.createInsecure())

exports.getCurrentBatteryStatus = (request) => {
   return new Promise((resolve, reject) => {
      client.getCurrentBatteryStatus(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response)
      })
   })
}
