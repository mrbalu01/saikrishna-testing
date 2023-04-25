const helpQuestionClient = require("@communication/client/help.question.client")
const APIError = require('@utils/APIError');

exports.getHelpQuestions = async (req, res, next) => {
   try {
      req.query.client = 'DOCTOR_APP';
      let helpQuestions = await helpQuestionClient.getHelpQuestions(req.query);
      res.json(helpQuestions)
   } catch (error) {
      next(new APIError(error))
   }
}