const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "deviceInstance.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.DeviceInstanceService(grpcConfig.admin, grpc.credentials.createInsecure())

exports.validate = (patchId) => {
   return new Promise((resolve, reject) => {
      client.validate({ patchId }, function (error, response) {
         if (error) {

            return reject(error)
         }
         console.log(response)
         return resolve(response)
      });
   })
}
