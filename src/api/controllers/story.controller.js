const PageContentService = require('@services/page.content.service');
const APIError = require('@utils/APIError');

/**
 * Story table has been deprecated in favor of using pagecontent table from admin.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getStories = async (req, res, next) => {
  try {
    let pageStories = await PageContentService.getStories(req);
    // Transform in to Story Object
    var stories = pageStories.pageContents.map(obj => {
      const image = {};
      image['_id'] = obj.id;
      image['content'] = {
        base64: obj.contentImage.base64,
        imageType: obj.contentImage.imageFormat
      };
      return image;
    });

    res.json(stories);
  } catch (error) {
    return next(new APIError(error));
  }
}