const NotificationClient = require('@communication/client/notification.client');

exports.getCaseEvents = async (req, res, next) => {
    try {
        const { fromTimeStamp, toTimeStamp } = req.query;
        const { id } = req.params;
        const requestQuery = {
            id,
            type: 'EVENT',
            fromTimeStamp,
            toTimeStamp
        }
        console.log('Get Case Events :', requestQuery)
        let caseEvents = await NotificationClient.getNotificationsForPeriod(requestQuery)
        return res.json({ caseEvents });
    } catch (error) {
        console.error('Error !! : ', error);
        next(error)
    }
}