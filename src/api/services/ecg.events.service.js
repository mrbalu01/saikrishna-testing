const EcgEventsClient = require("@communication/client/ecg.events.client")
const APIError = require('@utils/APIError');

exports.getEcgEvents = async (req, res, next) => {
    try {
        let { customerCase } = req.locals

        let { patchId, eventType, name, search, page, perPage, from, to, medicalDetailsFilter } = req.query;
        let ecgEvents = await EcgEventsClient.getEcgEvents({
            caseNumber: customerCase.caseNumber,
            patchId,
            eventType,
            name,
            query: search,
            page,
            perPage,
            from,
            to,
            medicalDetailsFilter,
            platformPartner: customerCase.platformPartner
        })
        res.json(ecgEvents)
    } catch (error) {
        next(new APIError(error))
    }
}