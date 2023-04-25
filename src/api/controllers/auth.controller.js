const httpStatus = require('http-status');
const User = require('@models/auth/user.model');
const APIError = require('@utils/APIError');
const envConfig = require('@config/vars')
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const CaseAlertService = require('@services/case.alert.service')

// Max. period that a Participant is allowed to be in a Room (currently 14400 seconds or 4 hours)
const MAX_ALLOWED_TWILIO_SESSION_DURATION = 14400;

exports.login = async (req, res, next) => {
  try {
    const { mobile, loginId, password, mobileDeviceInfo } = req.body
    const { clientIp } = req
    const { user, accessToken } = await User.findAndGenerateToken({ mobile, loginId, password, ip: clientIp })

    await CaseAlertService.addDoctorToCache({
      id: user.id, 
      firstName: user.firstName,
      lastName: user.lastName,
      fcmId: mobileDeviceInfo ? mobileDeviceInfo.fcmId : undefined,
      platformType: mobileDeviceInfo ? mobileDeviceInfo.platformType : undefined
    })
    res.json({ user, accessToken })
  } catch (error) {
    return next(User.checkDuplicateAttribute(error));
  }
}

exports.getTwilioAccessToken = async (req, res, next) => {
  try {
    const { roomName, identity } = req.query

    if (!roomName || !identity) {
      throw new APIError({
        message: 'Please provide roomName and identity parameters.',
        status: httpStatus.BAD_REQUEST,
      })
    }

    const token = new AccessToken(
      envConfig.twilioAccountSid,
      envConfig.twilioApiKey,
      envConfig.twilipApiSecret,
      { ttl: envConfig.twilioSessionDuration }
    );

    token.identity = identity;

    // Grant the access token Twilio Video capabilities.
    const grant = new VideoGrant({ room: roomName });
    token.addGrant(grant);

    // Serialize the token to a JWT string and include it in a JSON response.
    res.send({
      identity: identity,
      token: token.toJwt(),
    });

  } catch (error) {
    console.log(error)
    return next(error);
  }
}
