const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "medicalDetails.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.MedicalDetailsService(grpcConfig.admin, grpc.credentials.createInsecure())

exports.getMedicalDetails = (platformPartner) => {
   return new Promise((resolve, reject) => {
      client.getMedicalDetails({ platformPartner }, function (error, response) {
         if (error) {
            return reject(error)
         }
         let { MedicalDetailsList } = response
         if (MedicalDetailsList)
            return resolve(MedicalDetailsList)
         else
            return resolve([])
      });
   })
}

exports.getMedicalDetailsByText = (platformPartner, text) => {
   return new Promise((resolve, reject) => {
      client.getMedicalDetailsByText({ platformPartner, text }, function (error, response) {
         if (error) {
            return reject(error);
         }
         return resolve(response);
      });
   })
}

