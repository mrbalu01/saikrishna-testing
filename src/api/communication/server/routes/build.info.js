const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");

const proto = protoLoader.loadSync(path.join(__dirname, "../../proto/", "build.info.proto"));
const definition = grpc.loadPackageDefinition(proto);
const service = require('@services/build/build.info.service')

const getBuildInfo = async (call, callback) => {
   try {
      const buildInfo = await service.getBuildInfo()
      callback(null, buildInfo)
   } catch (error) {
      throw error
   }
}

module.exports = {
   definition: definition.BuildInfoService.service,
   methods: { getBuildInfo }
}