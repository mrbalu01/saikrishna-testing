const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require('@config/vars')
const proto = protoLoader.loadSync(path.join(__dirname, "../proto/", "businessPartner.proto"));
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.BusinessPartnerService(grpcConfig.admin, grpc.credentials.createInsecure())

exports.createBusinessPartner = (businessPartner) => {
   return new Promise((resolve, reject) => {
      client.createBusinessPartner(businessPartner, (error, response) => {
         if (error) {
            console.log(error)
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.getBusinessPartner = (req) => {
   return new Promise((resolve, reject) => {
      client.getBusinessPartner(req, (error, response) => {
         if (error) {
            console.log(error)
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.getBusinessPartnerById = (id) => {
   return new Promise((resolve, reject) => {
      client.getBusinessPartnerById({ id }, (error, response) => {
         if (error) {
            console.log(error)
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.getBusinessPartnerByUniqueId = (uniqueId) => {
   return new Promise((resolve, reject) => {
      client.getBusinessPartnerByUniqueId({ uniqueId }, (error, response) => {
         if (error) {
            console.log(error)
            return reject(error)
         }
         resolve(response)
      })
   })
}

exports.getBusinessPartnerNames = (requestBody) => {
   return new Promise((resolve, reject) => {
      client.getBusinessPartnerNames(requestBody, (error, response) => {
         if (error) {
            console.log(error)
            return reject(error)
         }
         resolve(response)
      })
   })
}