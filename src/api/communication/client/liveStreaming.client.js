const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "liveStreaming.data.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.LiveStreamingSerice(grpcConfig.data, grpc.credentials.createInsecure())

exports.getLiveStreaming = (request) => {
   return new Promise((resolve, reject) => {
      client.getLiveStreaming(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response)
      })
   })
}

exports.getVV330LiveStreaming = (request) => {
   return new Promise((resolve, reject) => {
      client.getVV330LiveStreaming(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response)
      })
   })
}


exports.latestVV200Temp = (request) => {
   return new Promise((resolve, reject) => {
      client.latestVV200Temp(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         console.log(response)
         return resolve(response)
      })
   })
}

exports.getLiveStreamingWithPagination = (request) => {
   return new Promise((resolve, reject) => {
      client.getLiveStreamingWithPagination(request, (error, response) => {
         if (error) {
            return reject(error)
         }
         return resolve(response)
      })
   })
}