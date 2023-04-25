const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "notification.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.NotificationService(grpcConfig.patient, grpc.credentials.createInsecure())

exports.getNotifications = (query) => {
   return new Promise((resolve, reject) => {
      client.getNotifications(query, (error, response) => {
         if (error) {
            return reject(error)
         }
         if(response.notifications){
            resolve(response.notifications)
         }else{
            resolve([])
         }
      })
   })
}

exports.getNotificationsForPeriod = (query) => {
   return new Promise((resolve, reject) => {
      client.getNotificationsForPeriod(query, (error, response) => {
         if (error) {
            return reject(error)
         }
         if(response.notifications){
            resolve(response.notifications)
         }else{
            resolve([])
         }
      })
   })
}