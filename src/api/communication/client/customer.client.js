const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "customer.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.CustomerService(grpcConfig.patient, grpc.credentials.createInsecure())


exports.getCustomerById = (id) => {
   return new Promise((resolve, reject) => {
      client.setCustomerById({ id }, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response)
      })
   })
}

exports.getCustomerListByPhoneNumber = (mobile) => {
   return new Promise((resolve, reject) => {
      client.getCustomersByPhoneNumber(mobile, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response.Customers)
      })
   })
}

exports.registerPatient = (requestBody) => {
   return new Promise((resolve, reject) => {
      console.log(requestBody)
      client.registerPatient(requestBody, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response)
      })
   })
}
