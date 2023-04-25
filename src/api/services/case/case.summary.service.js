const CaseSummaryClient = require('@communication/client/case.summary.client')
const TimeConverter = require('@utils/time.converter');

exports.getCustomerCasesSummaryByStage = async (req, res, next) => {
    try {
        req.locals = {}
        console.log('req.query:', req.query)
        let casesSummary = await CaseSummaryClient.getCustomerCasesSummaryByStage(req.query)
        if (!casesSummary.patientCases) {
            casesSummary.patientCases = []
        }

        // Populate age attribute
        for (let patientCase of casesSummary.patientCases) {
            if (!patientCase.customer || !patientCase.customer.dob)
                continue;
            let customer = patientCase.customer
            customer.age = TimeConverter.convertDobToAge(customer.dob);
        }
        res.json(casesSummary)
    } catch (error) {
        next(error)
    }
}

exports.getCaseCountByBusinessPartner = async (req, res, next) => {
    try {
        req.locals = {}
        let countMap = await CaseSummaryClient.getCaseCountByBusinessPartner(req.query)
        res.json(countMap)
    } catch (error) {
        next(error)
    }
}

exports.getCaseStatisticsByBusinessPartner = async (req, res, next) => {
    try {
        const { businessPartner } = req.locals;
        const { from } = req.query;
        let statistics = await CaseSummaryClient.getCaseStatisticsByBusinessPartner({
            serviceEnablerId: businessPartner.id,
            from
        })
        res.json(statistics);
    } catch (error) {
        next(error)
    }
}