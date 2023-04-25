const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { grpcConfig } = require("@config/vars");
const proto = protoLoader.loadSync(
    path.join(__dirname, "../proto/", "cardiologs.summary.proto")
);
const definition = grpc.loadPackageDefinition(proto);

var client = new definition.CardiologsSummaryService(
    grpcConfig.inference,
    grpc.credentials.createInsecure()
);

exports.getCardiologsSummary = (request) => {
    return new Promise((resolve, reject) => {
        client.getCardiologsSummary(request, (error, response) => {
            if (error) {
                return reject(error);
            }
            return resolve(response);
        });
    });
};