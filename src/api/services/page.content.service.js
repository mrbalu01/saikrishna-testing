const PageContentClient = require("@communication/client/page.content.client")

exports.getStories = async (req) => {
   try {
      req.query.client = 'DOCTOR_APP';
      req.query.feature = 'Story';
      req.query.contentType = 'IMAGE';

      let pageContents = await PageContentClient.getPageContents(req.query)
      return pageContents;
   } catch (error) {
      throw error;
   }
}

exports.getPageContents = async (req) => {
   try {
      req.query.client = 'DOCTOR_APP' 
      let pageContents = await PageContentClient.getPageContents(req.query);
      return pageContents;
   } catch (error) {
      throw error;
   }
}
