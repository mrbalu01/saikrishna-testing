const PageContentService = require('@services/page.content.service');
const APIError = require('@utils/APIError');

exports.getPageContents = async (req, res, next) => {
    try {
        console.log(req.query);
        let pageContents = await PageContentService.getPageContents(req);
        res.json(pageContents);
    } catch (error) {
        next(new APIError(error));
    }
}