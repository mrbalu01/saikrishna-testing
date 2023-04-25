const service = require('@services/medicalDetails.service');
const APIError = require('@utils/APIError');

exports.getMedicalDetailsByText = async (req, res, next) => {
    try {
        console.log(req.query);
        let medicalDetails = await service.getMedicalDetailsByText(req);
        res.json({ [req.query.text]: medicalDetails });
    } catch (error) {
        next(new APIError(error));
    }
}