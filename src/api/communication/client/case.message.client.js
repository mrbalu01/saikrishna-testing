const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "case.message.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.CaseMessageService(grpcConfig.patient, grpc.credentials.createInsecure())

exports.createCaseMessage = (request) => {
   return new Promise((resolve, reject) => {
      client.createCaseMessage(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response)
      })
   })
}

exports.getAllCaseMessages = (request) => {
   return new Promise((resolve, reject) => {
      client.getAllCaseMessages(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response)
      })
   })
}

exports.getCaseMessagesByRecipient = (request) => {
   return new Promise((resolve, reject) => {
      client.getCaseMessagesByRecipient(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response)
      })
   })
}

exports.markAsRead = (request) => {
   return new Promise((resolve, reject) => {
      client.markAsRead(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response)
      })
   })
}