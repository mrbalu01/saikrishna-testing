const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars');
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "condition.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.ConditionService(grpcConfig.admin, grpc.credentials.createInsecure())

exports.getConditions = ({ isFixed }) => {
   return new Promise((resolve, reject) => {
      client.getConditions({ isFixed }, function (error, response) {
         if (error) {
            error.message = error.details
            return reject(error)
         }
         return resolve(response)
      });
   })
}

exports.getConditionById = (id) => {
   return new Promise((resolve, reject) => {
      client.getConditionById({ id }, function (error, response) {
         if (error) {
            error.message = error.details
            return reject(error)
         }
         return resolve(response)
      });
   })
}