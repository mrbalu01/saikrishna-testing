const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "support.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.SupportService(grpcConfig.admin, grpc.credentials.createInsecure())

exports.createCallMeBack = (support) => {
   return new Promise((resolve, reject) => {
      client.createCallMeBack(support, function (error, response) {
         if (error) {
            error.message = error.details
            return reject(error)
         }
         console.log(response)
         return resolve(response)
      });
   })
}