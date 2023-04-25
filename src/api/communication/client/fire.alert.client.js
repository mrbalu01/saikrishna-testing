const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "fire.alert.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.FireAlertService(grpcConfig.alert, grpc.credentials.createInsecure())

exports.fireCustomizedAlert = (request) => {
   return new Promise((resolve, reject) => {
      client.fireCustomizedAlert(request, function (error, response) {
         if (error) {
            console.log(error)
            error.message = error.details
            return reject(error)
         }
         console.log(response)
         return resolve(response)
      });
   })
}