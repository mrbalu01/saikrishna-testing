const conditionClient = require("@communication/client/condition.client")
const APIError = require('@utils/APIError');

exports.getConditions = async (req, res, next) => {
    try {
        let conditions = await conditionClient.getConditions(req.query)
        let enabledConditions = conditions.conditions.filter(condition => condition.metadata && condition.metadata.enabled)
        res.json({ conditions: enabledConditions })
    } catch (error) {
        console.log(error)
        next(new APIError(error))
    }
}
