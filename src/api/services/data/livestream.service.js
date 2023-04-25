const APIError = require('@utils/APIError');
const LiveStreamingClient = require("@communication/client/liveStreaming.client")

exports.getLiveStreamingWithPagination = async (req, res, next) => {
   try {
      let { customerCase } = req.locals
      let { page, perPage } = req.query
      req.body.caseNumber = customerCase.caseNumber
      let { caseNumber, patchId, to, from, deviceName } = req.body
      data = await LiveStreamingClient.getLiveStreamingWithPagination({ caseNumber: caseNumber, patchId, to, from, deviceName, page, perPage });
      if (data) {
         res.json(data)
      }
   } catch (error) {
      next(new APIError(error))
   }
}