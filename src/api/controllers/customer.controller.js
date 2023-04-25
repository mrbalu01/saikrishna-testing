const CustomerClient = require('@communication/client/customer.client')
const APIError = require('@utils/APIError');
const caseClient = require('@communication/client/case.client')

exports.getCustomerById = async (req, res, next) => {
    try {
        let { id } = req.params
        console.log(id)
        let customer = await CustomerClient.getCustomerById(id)
        console.log(customer)
        res.json(customer)
    } catch (error) {
        next(new APIError(error))
    }
}

exports.getCaseReportGroupByCaseNumber = async (req, res, next) => {
    try {
        let { id } = req.params
        req.query.customer = id
        req.query.isFixedDuration = "true"
        console.log(req.params)
        let response = await caseClient.getCaseReportGroupByCaseNumber(req.query)
        res.json(response)
    } catch (error) {
        next(new APIError(error))
    }
}