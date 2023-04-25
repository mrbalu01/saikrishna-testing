const path = require('path');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioApiKey: process.env.TWILIO_API_KEY,
  twilipApiSecret: process.env.TWILIO_API_SECRET,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioSessionDuration: process.env.MAX_ALLOWED_TWILIO_SESSION_DURATION,
  mongo: {
    uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI,
  },
  logs: process.env.NODE_ENV === 'development' ? 'dev' : 'combined',
  grpcConfig: {
    ip: process.env.GRPC_IP,
    port: process.env.GRPC_PORT,
    admin: process.env.GRPC_ADMIN,
    patient: process.env.GRPC_PATIENT,
    alert: process.env.GRPC_ALERT,
    data: process.env.GRPC_DATA,
    inference: process.env.GRPC_INFERENCE,
    dashboard: process.env.GRPC_DASHBOARD
  },
  fullModeKey: process.env.DOCTOR_FULLMODE_KEY
};

