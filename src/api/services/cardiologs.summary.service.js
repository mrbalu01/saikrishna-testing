const CardiologsSummaryClient = require("@communication/client/cardiologs.summary.client")
const APIError = require('@utils/APIError');

exports.getCardiologsSummary = async ({ caseNumber }) => {
    try {
        let cardiologsSummary = await CardiologsSummaryClient.getCardiologsSummary({ caseNumber: caseNumber })
        console.log("getCardiologsSummary : ", cardiologsSummary)
        return cardiologsSummary;
    } catch (error) {
        console.log("Error! :", error);
        throw error;
    }
}