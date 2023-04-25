const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "case.alert.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.CaseAlertService(grpcConfig.alert, grpc.credentials.createInsecure())

exports.addDoctorToCache = (doctor) => {
   return new Promise((resolve, reject) => {
      client.addDoctorToCache(doctor, function (error, response) {
         if (error) {
            return reject(error)
         }
         console.log('response:', response)
         return resolve(response)
      });
   })
}