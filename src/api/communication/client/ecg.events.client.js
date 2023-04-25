const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require("@config/vars");
const proto = protoLoader.loadSync(
  path.join(__dirname, "../proto/", "ecg.events.proto")
);
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.EcgEventService(
  grpcConfig.inference,
  grpc.credentials.createInsecure()
);

exports.getEcgEvents = (request) => {
  return new Promise((resolve, reject) => {
    client.getEcgEvents(request, (error, response) => {
      if (error) {
        return reject(error);
      }
      return resolve(response);
    });
  });
};