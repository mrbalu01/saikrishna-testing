const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../models/auth/user.model');
const service = require('@services/doctor.service');
const caseClient = require('@communication/client/case.client')

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = async (req, res, next) => {
  try {
    let { entity, loginRole } = req.session
    let user = await User.findById(entity).exec()
    
    user = user.transform()
    // Show only the Active businessPartner
    if (user.businessPartners && user.businessPartners.length > 0) {
      user.businessPartners = user.businessPartners.filter(bp => bp.isActive == true && bp.isDeleted == false)
    }
    user.loginRole = loginRole
    user.businessPartners =  await service.updateBusinessDetails(user.businessPartners);
    res.json(user)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateAttribute(error));
  }
};

exports.getActiveCaseCount = async (req, res, next) => {
  const { userId } = req.params
  const { business } = req.headers
  try {

    let response = await caseClient.getActiveCaseCount({ doctor: userId, business })
    res.json(response)
  } catch (error) {
    next(error);
  }
}

/**
 * Update existing user
 * @public
 */
exports.updateUserAgent = async (req, res, next) => {
  const { userId } = req.params
  const { business } = req.headers
  try {
    //TODO: Validate business in businessPartner Array
    let user = await service.updateUserAgent({ id: userId, agent: req.body, business })
    res.json(user)
  } catch (error) {
    next(error);
  }
}

/**
 * Update existing doctor
 * @public
 */
exports.updateDoctor = async (req, res, next) => {
  const { userId } = req.params
  const { business } = req.headers
  try {
    let doctor = await service.updateDoctor({ id: userId, doctor: req.body, business })

    // Show only the current businessPartner
    if (doctor.businessPartners && doctor.businessPartners.length > 0) {
      let businessPartner = doctor.businessPartners.find(bp => bp.businessPartnerId == business)
      doctor.businessPartners = [businessPartner]
    }

    res.json(doctor)
  } catch (error) {
    next(error);
  }
}

/**
 * Get user list
 * @public
 */
exports.listDoctors = async (req, res, next) => {
  try {
    const { business } = req.query
    req.query.userType = 'DOCTOR'
    req.query.isDeleted = 'false'

    const { users, count, pages } = await service.getAllDoctor(req.query);
    // Show only the current businessPartner.
    if (users && business) {
      for (let user of users) {
        if (user.businessPartners && user.businessPartners.length > 0) {
          user.businessPartner = user.businessPartners.find(bp => bp.businessPartnerId == business)
          user.businessPartners = [user.businessPartner]
        }
      }
    }

    res.json({ users, count, pages });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor by mobile
 * @public
 */
exports.getDoctorByMobile = async (req, res, next) => {
  try {
    const { business } = req.headers;

    const doctor = await service.getDoctorByMobile(req.query);

    // Filter out only current Business Partner
    if (doctor.businessPartners && doctor.businessPartners.length > 0) {
      let businessPartner = doctor.businessPartners.find(bp => bp.businessPartnerId == business)
      doctor.businessPartners = [businessPartner]
    }


    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

/**
 * Check if the doctor exist by mobile
 * @public
 */
exports.isDoctorExists = async (req, res, next) => {
  try {
    const doctor = await service.getDoctorByMobile(req.query);
    if (doctor) {
      res.json({ isDoctorExists: true });
    } else {
      res.json({ isDoctorExists: false });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Create Doctor
 * @public
 */
exports.createDoctor = async (req, res, next) => {
  try {
    const { business } = req.headers
    const doctor = req.body
    const user = await service.createDoctor(doctor);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Create UserAgent
 * @public
 */
exports.createUserAgent = async (req, res, next) => {
  try {
    const { business } = req.headers
    const userAgent = req.body
    const user = await service.createUserAgent(userAgent);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.listUserAgents = async (req, res, next) => {
  try {
    req.query.userType = 'AGENT'
    req.query.isDeleted = 'false'

    const { users, count, pages } = await service.getAllUserAgents(req.query);
    res.json({ users, count, pages });
  } catch (error) {
    next(error);
  }
};

exports.checkDuplicateLoginId = async (req, res, next) => {
  try {
    const response = await service.checkDuplicateLoginId(req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
};


/**
 * Get getDoctorsByBusinessId list
 * @public
 * 
 */
exports.getDoctorsByBusinessId = async (req, res, next) => {
  try {
    let { business } = req.params;
    let doctors = await service.getDoctorsByBusinessId({ business, isDeleted: 'false' });
    res.json({ doctors });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Doctor
 * @public
 */
exports.removeDoctor = async (req, res, next) => {
  const { business } = req.headers
  const { userId } = req.params;
  const { entity, firstName, lastName } = req.session

  let deletedBy = {
    id: entity,
    firstName,
    lastName,
    source: 'VIGO_CLINIC',
    timeStamp: new Date()
  }

  try {
    let doctor = await service.deleteDoctor({ id: userId, business, deletedBy });
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete userAgent - Associate/Admin
 * @public
 */
exports.removeUserAgent = async (req, res, next) => {
  const { business } = req.headers
  const { userId } = req.params;
  const { entity, firstName, lastName } = req.session

  let deletedBy = {
    id: entity,
    firstName,
    lastName,
    source: 'VIGO_CLINIC',
    timeStamp: new Date()
  }

  try {
    let userAgent = await service.deleteUserAgent({ id: userId, business, deletedBy });
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
};

