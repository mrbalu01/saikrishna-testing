const httpStatus = require('http-status');
const { omit } = require('lodash');
const APIError = require('@utils/APIError');
const EcgStatusClient = require('@client/ecg.status.client');
const CaseClient = require('@client/case.client');
const BatteryStatusClient = require('@communication/client/battery.status.client')

exports.getCaseById = (req, res, next) => {
    try {
        res.json(req.locals.customerCase)
    } catch (error) {
        next(new APIError(error))
    }
}

exports.updateCustomerCaseById = (req, res, next) => {
    try {
        res.json(req.locals.customerCase)
    } catch (error) {
        next(new APIError(error))
    }
}

exports.getSummary = (req, res, next) => {
    try {
        const { summary } = req.locals
        res.json(summary)
    } catch (error) {
        next(error)
    }
}

exports.getCustomerReports = async (req, res, next) => {
    try {
        const { caseNumber } = req.locals.customerCase
        const { page = 1, perPage = 10 } = req.query
        const reports = await EcgStatusClient.GetEcgReports({ caseNumber, page, perPage })
        res.json(reports)
    } catch (error) {
        next(error)
    }
}

exports.isActiveCasePresentForMobile = async (req, res, next) => {
    try {
        const { number, countryCode } = req.query
        const response = await CaseClient.isActiveCasePresentForMobile({ number, countryCode })
        res.json(response)
    } catch (error) {
        next(error)
    }
}

exports.getBatteryStatus = async (req, res, next) => {
    try {
        let { id } = req.params;
        let batteryStatus = await BatteryStatusClient.getCurrentBatteryStatus({ customerCase: id })

        // Format the battery percentage for the UI.
        if (batteryStatus && batteryStatus.devices) {
            let devices = batteryStatus.devices
            for (var i in devices) {
                if (devices[i].percentage)
                    devices[i].percentage = Math.round(devices[i].percentage);
            }
        }
        res.json(batteryStatus)
    } catch (error) {
        next(error)
    }
}
