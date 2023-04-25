const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Doctor App API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  };
  
  const options = {
    swaggerDefinition,
    apis: [`${__dirname}/../api/routes/v1/*.js`]
  };
  
  const swaggerSpec = swaggerJSDoc(options);
  module.exports = swaggerSpec;