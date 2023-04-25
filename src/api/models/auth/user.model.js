const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const APIError = require('@utils/APIError');
const { env, jwtSecret } = require('@config/vars');
const LoginSession = require('@models/auth/login.session');

/**
 * User Supported Options
 */
const UserType = ['DOCTOR', 'AGENT']
const Statuses = ['ACTIVE', 'INACTIVE']
const Languages = ['en', 'id']
const Weights = ['KG', 'POUND']
const Heights = ['FEET-INCH', 'CENTIMETERS', 'METERS']

/**
 * Roles 
 *  - Internal Doctors will have access to all the patients tagged to that business partner 
 *  - External Doctors will have access to only patients tagged to him.
 */
const Roles = ['INTERNAL_DOCTOR', 'EXTERNAL_DOCTOR', 'ASSOCIATE', 'ADMIN']

/**
 * User Schema
 * @private
 */
var userSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    platformPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlatformPartner',
    },
    businessPartners: [{
      businessPartnerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
      },
      roles: [{
        role: { type: String, enum: Roles }
      }],
      businessPartnerName: { type: String },
      displayName: { type: String },
      speciality: { type: String },
      email: { type: String, lowercase: true },
      isActive: { type: Boolean, default: true },
      location: { type: String },
      layout: [{
        layoutName: { type: String, enum: ['FLOOR', 'WARD', 'DEPARTMENT'] },
        layoutValues: [{ type: String }]
      }],
      isDeleted: { type: Boolean, default: false },
      deletedBy: {
        id: { type: mongoose.Schema.Types.ObjectId },
        firstName: { type: String },
        lastName: { type: String },
        source: {
          type: String,
          enum: ['UNKNOWN', 'CMS', 'VIGO_CLINIC', 'BEDSIDE_MONITOR', 'NURSING_STATION']
        },
        timeStamp: { type: Date }
      },
      providerNumber: {
        type: String
      },
      isServiceEnabler: {
        type: Boolean,
        default: false
      }
    }],
    firstLogin: { type: Boolean, required: true, default: false },
    password: { type: String, required: true, minlength: 6, maxlength: 64 },
    mobile: {
      countryCode: { type: String, trim: true },
      number: { type: String, trim: true }
    },
    userType: { type: String, enum: UserType, required: true, default: 'DOCTOR' },
    status: { type: String, enum: Statuses, default: 'ACTIVE' },
    userPreferences: {
      language: { type: String, enum: Languages, default: 'en' },
      weight: { type: String, enum: Weights, default: 'KG' },
      height: { type: String, enum: Heights, default: 'FEET-INCH' }
    },
    loginInfo: {
      signinCount: { type: Number },
      failedAttempts: { type: Number },
      lockedAt: { type: Date },
      unlockToken: { type: Date },
      confirmedAt: { type: Date },
      confirmationToken: { type: Date },
      confirmationSentAt: { type: Date }
    },
    vigoId: { type: String, required: true },
    loginId: {
      type: String,
      required: false,
      trim: true,
      unique: true
    },
    bioData: { type: String },
    MCIRegNumber: { type: String }
  },
  { timestamps: true },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
)

userSchema.index({ platformPartner: 1 })
userSchema.index({ 'mobile.countryCode': 1, 'mobile.number': 1 })
userSchema.index({ loginId: 1, firstName: 1, lastName: 1 })

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = env === 'test' ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};

    const fields = [
      'id',
      'mobile',
      'email',
      'firstName',
      'lastName',
      'gender',
      'dob',
      'userType',
      'userPreferences',
      'platformPartner',
      'businessPartners',
      'createdAt',
      'updatedAt',
      'bioData',
      'vigoId',
      'loginId',
      'MCIRegNumber'
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  async token(ip, loginRole) {
    try {
      const payload = {
        entityType: this.role,
        entity: this,
        ipAddress: ip,
        platformPartner: this.platformPartner,
        channel: 'WEB',
        loginRole: loginRole
      };
      const sessionToken = await LoginSession.createSession(payload)
      const token = await jwt.sign(sessionToken, jwtSecret)
      return token
    } catch (error) {
      throw error
    }
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
userSchema.statics = {

  Roles,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }

      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find user by mobile number and password
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findUserByMobile(options) {
    const { mobile, password } = options;
    if (!mobile || !mobile.number || !mobile.countryCode)
      throw new APIError({ message: 'Mobile number is not provided' });

    const user =
      await this.findOne({
        'mobile.number': mobile.number,
        'mobile.countryCode': mobile.countryCode
      }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };

    if (user) {
      return { user: user.transform() };
    }
    err.message = 'Incorrect mobile number. No user exists with provided mobile number.';
    throw new APIError(err);
  },

  /**
   * Check if the loginId is already been used by the user.
   * 
   * returns true if the new loginId is available to the user.
   *
   */
  async checkDuplicateLoginId(options) {
    const { loginId } = options;
    let user;

    if (loginId) {
      user = await this.findOne({ 'loginId': loginId }).exec();
    }

    if (user) {
      return true;
    }

    return false;
  },

  /**
   * Find user by mobile and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndGenerateToken(options) {
    const { mobile, loginId, password, ip, refreshObject } = options;
    console.log(options)
    let user;

    if (loginId) {
      user = await this.findOne({
        loginId: loginId,
        userType: 'AGENT',
        businessPartners: {
          $elemMatch: {
            isActive: true,
            isDeleted: false,
          }
        }
      }).exec();
    } else if (mobile && mobile.number && mobile.countryCode) {
      user = await this.findOne({
        'mobile.number': mobile.number,
        'mobile.countryCode': mobile.countryCode,
        userType: 'DOCTOR'
      }).exec();
    } else {
      throw new APIError({ message: 'Invalid login parameters' });
    }

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };

    if (user) {
      let loginRole;
      if (loginId) {
        // Associate the login Agent role - for mobile flow 
        if (user.businessPartners
          && user.businessPartners.length == 1
          && user.businessPartners[0].roles) {
          let roles = user.businessPartners[0].roles;
          if (roles.some(item => item.role === 'ADMIN')) {
            loginRole = 'ADMIN'
          } else if (roles.some(item => item.role === 'ASSOCIATE')) {
            loginRole = 'ASSOCIATE'
          }
        }
      } else {
        loginRole = 'DOCTOR';
      }

      // check password if login via loginId
      if (!loginId || await user.passwordMatches(password)) {

        if (loginRole) {
          const accessToken = await user.token(ip, loginRole);
          console.log('Login success', mobile, loginId)

          user = user.transform()
          // Show only the Active businessPartner
          if (user.businessPartners && user.businessPartners.length > 0) {
            user.businessPartners = user.businessPartners.filter(bp => bp.isActive == true && bp.isDeleted == false)
          }

          user.loginRole = loginRole;
          return { user: user, accessToken };

        } else {
          err.message = 'Invalid role associated with the user';
        }

      }
    } else if (refreshObject && refreshObject.mobile === mobile) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        const accessToken = await user.token(ip);
        console.log('ERROR2: ', err)
        return { user, accessToken };
      }
    } else {
      err.message = 'Incorrect login parameters or refreshToken';
    }
    console.log('ERROR: ', err)
    throw new APIError(err);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  async list({
    page = 1, perPage = 30, userType, platformPartner, businessPartner, query, isActive, isDeleted
  }) {
    let queryArr = []

    if (query && query.length > 0) {
      queryArr.push({ 'mobile.number': { $regex: query, $options: 'i' } })
      queryArr.push({ 'firstName': { $regex: query, $options: 'i' } })
      queryArr.push({ 'lastName': { $regex: query, $options: 'i' } })
      queryArr.push({ 'vigoId': { $regex: query, $options: 'i' } })
      queryArr.push({ 'loginId': { $regex: query, $options: 'i' } })
    } else {
      queryArr.push({})
    }
    let partnerQuery = {}

    if (businessPartner) {
      partnerQuery['businessPartners'] = {
        $elemMatch: {
          businessPartnerId: businessPartner
        }
      }
    }

    if (isActive) {
      let active = isActive == 'true'
      if (partnerQuery['businessPartners']) {
        partnerQuery['businessPartners']['$elemMatch']['isActive'] = active
      } else {
        partnerQuery['businessPartners'] = { $elemMatch: { isActive: active } }
      }
    }

    if (isDeleted) {
      let deleted = isDeleted == 'true'
      if (partnerQuery['businessPartners']) {
        partnerQuery['businessPartners']['$elemMatch']['isDeleted'] = deleted
      } else {
        partnerQuery['businessPartners'] = { $elemMatch: { isDeleted: deleted } }
      }
    }

    if (platformPartner)
      partnerQuery['platformPartner'] = platformPartner

    if (userType)
      partnerQuery['userType'] = userType

    let users = await this.find({ $and: [partnerQuery, { $or: queryArr }] })
      .sort({ createdAt: -1 })
      .skip(perPage * (page * 1 - 1))
      .limit(perPage * 1)
      .exec()

    var count = await this.countDocuments({ $and: [partnerQuery, { $or: queryArr }] }).exec();
    var pages = Math.ceil(count / perPage);
    users = users.map(user => user.transform())

    return { users, count, pages }
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateAttribute(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'loginId',
          location: 'body',
          messages: ['"loginId" already exists']
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
};


/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);
