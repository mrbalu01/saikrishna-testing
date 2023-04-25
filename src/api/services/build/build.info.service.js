const { env } = require('@config/vars.js');
const fs = require('fs').promises;
const APIError = require('@utils/APIError');

exports.getBuildInformation = async (req, res, next) => {
     try {
          let response = await this.getBuildInfo();
          res.json(response)
     } catch (error) {
          next(new APIError(error))
     }
}

exports.getBuildInfo = async () => {
     let serviceName = 'doctor-service-mvm';

     let info = {}
     try {
          info = await fs.readFile('./build-info.json', 'utf8');
     } catch (err) {
          return {
               serviceName,
               statusCode: 404,
               profile: env,
               message: 'build-info.json file not found'
          };
     }

     try {
          let { build, buildTime, branch } = JSON.parse(info);
          return {
               serviceName,
               build,
               branch,
               buildTime,
               profile: env,
               statusCode: 200
          }
     } catch (err) {
          return {
               serviceName,
               profile: env,
               statusCode: 500,
               message: 'build-info.json file exists, but could not be parsed.'
          };
     }
}
