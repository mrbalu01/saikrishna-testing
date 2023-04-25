const service = require('@services/cardiologs.summary.service');
const APIError = require('@utils/APIError');

exports.getCardiologsSummary = async (req, res, next) => {
    try {
        let { customerCase } = req.locals
        let medicalDetails = await service.getCardiologsSummary({ caseNumber: customerCase.caseNumber });
        res.json(medicalDetails);
    } catch (error) {
        console.log("Error! :", error);
        throw error;
    }
}