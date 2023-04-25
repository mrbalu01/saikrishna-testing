const APIError = require('@utils/APIError');
const User = require("@models/auth/user.model")
const mongoose = require('mongoose');
const DoctorSequence = require("@models/doctor.sequence.model")
const AgentSequence = require("@models/agent.sequence.model")
const FireAlertServices = require('@services/fire.alert.service')
const { omit } = require('lodash');
const CaseAlertService = require('@services/case.alert.service')
const BusinessPartnerClient = require('@communication/client/businessPartner.client')
const { fullModeKey } = require('@config/vars.js')

exports.addExternalDoctorToQuery = async (req, res, next) => {
   try {
      const { business } = req.headers
      const { fullMode, serviceEnablerId } = req.query;
      const user = await User.findById(req.session.entity)
      if (fullMode && fullModeKey && fullMode == fullModeKey) {
         return next();
      }

      if ((!business || !user || !user.businessPartners)) {
         throw new APIError({ message: `Invalid request or Missing businessPartner header for the doctor ${user.userId}` })
      }

      let businessPartner = user.businessPartners.find(bp => (bp.businessPartnerId == business) || (bp.businessPartnerId == serviceEnablerId) && bp.isActive == true)
      if (businessPartner) {
         // Set Layout
         req.query.layout = businessPartner.layout
      } else if (!businessPartner) {
         throw new APIError({ message: `Invalid businessPartner configuration for the user ${user.userId}` })
      }

      // For User Agent      - filter by business 
      // For Internal Doctor - filter by business 
      // For External Doctor - filter by business and doctor
      if (user.userType == 'DOCTOR') {
         if (businessPartner.roles) {
            let roles = businessPartner.roles;
            if (roles.some(item => item.role === 'EXTERNAL_DOCTOR')) {
               // Set Doctor 
               req.query.doctor = user.userId;
            }
         } else {
            throw new APIError({ message: `Missing role configuration for the doctor ${user.userId}` })
         }
      }

      return next()
   } catch (error) {
      next(new APIError(error))
   }
}

exports.getDoctorById = async ({ doctor }) => {
   try {
      doctor = await User.findById(doctor)
      if (doctor) {
         doctor = doctor.transform()
         return doctor
      } else {
         throw { message: "Doctor not found" }
      }
   } catch (error) {
      throw error
   }
}

exports.getAllDoctor = async (query) => {
   try {
      query.userType = 'DOCTOR'
      console.log(query)

      let doctors = await User.list(query)
      return doctors
   } catch (error) {
      throw error
   }
}

exports.getAllUserAgents = async (query) => {
   try {
      query.userType = 'AGENT'
      console.log(query)
      let doctors = await User.list(query)
      return doctors
   } catch (error) {
      throw error
   }
}

exports.getDoctorsByBusinessId = async ({ business, isActive, isDeleted }) => {
   try {

      let options = {
         businessPartners: {
            $elemMatch: {
               businessPartnerId: mongoose.Types.ObjectId(business)
            },
         },
         userType: 'DOCTOR',
      }

      if (isDeleted) {
         let deleted = isDeleted == 'true'
         options['businessPartners']['$elemMatch']['isDeleted'] = deleted
      }

      if (isActive) {
         let active = isActive == 'true'
         options['businessPartners']['$elemMatch']['isActive'] = active
      }

      let doctors = await User.find(options);

      doctors = doctors.map(doctor => doctor.transform());
      return doctors
   } catch (error) {
      throw error
   }
}

exports.getUserAgentsByBusinessId = async ({ business, isActive, isDeleted }) => {
   try {

      let options = {
         businessPartners: {
            $elemMatch: {
               businessPartnerId: mongoose.Types.ObjectId(business)
            },
         },
         userType: 'AGENT',
      }

      if (isDeleted) {
         let deleted = isDeleted == 'true'
         options['businessPartners']['$elemMatch']['isDeleted'] = deleted
      }

      if (isActive) {
         let active = isActive == 'true'
         options['businessPartners']['$elemMatch']['isActive'] = active
      }

      let doctors = await User.find(options);

      doctors = doctors.map(doctor => doctor.transform());
      return doctors
   } catch (error) {
      throw error
   }
}

exports.createUserAgent = async (userAgent) => {
   try {
      let { loginId } = userAgent
      userAgent.userType = 'AGENT'

      if (loginId) {
         let user = await User.findOne({ loginId })
         if (user) {
            throw { message: "User Agent with this loginId already exist" }
         }
      } else {
         throw { message: "loginId is required to create User Agent." }
      }

      // Validate Roles
      if (!userAgent.businessPartners
         || userAgent.businessPartners.length != 1
         || !userAgent.businessPartners[0].roles) {
         throw { message: "Role attributes missing in the Agent" }
      }

      let allowedRoles = ['ADMIN', 'ASSOCIATE'];
      let roles = userAgent.businessPartners[0].roles
      roles.forEach(item => {
         if (!allowedRoles.some(el => el === item.role)) {
            throw { message: "Invalid Role for the Agent" }
         }
      });

      if (!userAgent.password)
         throw { message: "password is required to create User Agent." }

      await module.exports.setAgentSequenceId(userAgent)

      const user = new User(userAgent);
      const savedUser = await user.save();

      await CaseAlertService.addDoctorToCache({
         id: user.id,
         firstName: user.firstName,
         lastName: user.lastName,
         loginId: user.loginId,
         password: userAgent.password,
         email: userAgent.businessPartners[0].email,
         mobile: user.mobile
      })

      FireAlertServices.fireCustomizedAlert(savedUser, 'ASSOCIATE', 'CREATED', 'DOCTOR')
      return savedUser.transform()
   } catch (error) {
      throw error
   }
}

exports.setDoctorSequenceId = async (doctor) => {
   try {
      if (!doctor.vigoId) {
         let doctorSequence = await DoctorSequence.findOneAndUpdate({}, { $inc: { number: 1 } }, { new: true })
         if (!doctorSequence) {
            doctorSequence = await DoctorSequence.create({})
         }
         let numStr = doctorSequence.number + ""
         doctor.vigoId = `${doctorSequence.prefix}${numStr.padStart(6, 0)}`
      }
   } catch (error) {
      return error
   }
}

exports.setAgentSequenceId = async (agent) => {
   try {
      if (!agent.vigoId) {
         let agentSequence = await AgentSequence.findOneAndUpdate({}, { $inc: { number: 1 } }, { new: true })
         if (!agentSequence) {
            agentSequence = await AgentSequence.create({})
         }
         let numStr = agentSequence.number + ""
         agent.vigoId = `${agentSequence.prefix}${numStr.padStart(6, 0)}`
      }
   } catch (error) {
      return error
   }
}

exports.createDoctor = async (doctor) => {
   try {
      let { mobile } = doctor
      doctor.userType = 'DOCTOR'
      delete doctor.loginId;

      if (mobile) {
         let user = await User.findOne({ userType: 'DOCTOR', 'mobile.number': mobile.number, 'mobile.countryCode': mobile.countryCode })
         if (user) {
            throw { message: "Doctor with this mobile number already exist" }
         }
      } else {
         throw { message: "Mobile number is required to create Doctor." }
      }

      // Validate Roles
      if (!doctor.businessPartners
         || doctor.businessPartners.length < 1) {
         throw { message: "BusinessPartner attributes missing in the Doctor" }
      }

      // Add EXTERNAL_DOCTOR for SELF_BUSINESS
      // let selfBusiness =
      //    await BusinessPartnerClient.getBusinessPartnerByUniqueId('SELF_BUSINESS')
      // if (selfBusiness) {
      //    let businessPartner =
      //    {
      //       "isActive": true,
      //       "businessPartnerId": selfBusiness.id,
      //       "businessPartnerName": selfBusiness.name,
      //       "displayName": doctor.businessPartners[0].displayName,
      //       "email": doctor.businessPartners[0].email,
      //       "layout": [],
      //       "roles": [{ "role": "EXTERNAL_DOCTOR" }]
      //    }
      //    doctor.businessPartners.push(businessPartner)

      // } else {
      //    console.log("Warning: Missing SELF_BUSINESS BusinessPartner. Continuing anyway")
      // }

      let allowedRoles = ['INTERNAL_DOCTOR', 'EXTERNAL_DOCTOR'];
      doctor.businessPartners.forEach(businessPartner => {

         if (!businessPartner.roles) {
            throw { message: "Role attributes missing for the Doctor" }
         }

         businessPartner.roles.forEach(item => {
            if (!allowedRoles.some(el => el === item.role)) {
               throw { message: "Invalid Role for the Doctor" }
            }
         });
      });

      await module.exports.setDoctorSequenceId(doctor)

      doctor.password = 'pass1234';
      const user = new User(doctor);
      const savedUser = await user.save();
      FireAlertServices.fireCustomizedAlert(savedUser, 'DOCTOR', 'CREATED', 'DOCTOR')

      return savedUser.transform()
   } catch (error) {
      throw error
   }
}

exports.getDoctorByMobile = async ({ number, countryCode }) => {
   try {
      let user = await User.findOne({
         userType: 'DOCTOR',
         'mobile.number': number,
         'mobile.countryCode': countryCode
      })

      if (user)
         user = user.transform();

      return user
   } catch (error) {
      throw error
   }
}

exports.deleteDoctor = async ({ id, business, deletedBy }) => {
   try {

      if (!business) {
         throw { message: "Missing business PartnerId for delete Operation" }
      }
      const user = await User.get(id);

      if (!user) {
         throw { message: "Invalid UserId for delete Operation" }
      }

      for (var i = 0; i < user.businessPartners.length; i++) {
         // Update isDeleted = true
         if (user.businessPartners[i].businessPartnerId === business) {
            user.businessPartners[i].isDeleted = true;
            user.businessPartners[i].isActive = false;
            if (deletedBy) {
               user.businessPartners[i].deletedBy = deletedBy;
            }
         }
      }

      await user.save()
      return user.transform()

   } catch (error) {
      throw error
   }
}

exports.deleteUserAgent = async ({ id, deletedBy }) => {
   try {
      const user = await User.get(id);

      if (!user) {
         throw { message: "Invalid UserId for delete Operation" }
      }

      // Update isDeleted = true
      for (var i = 0; i < user.businessPartners.length; i++) {
         user.businessPartners[i].isDeleted = true;
         user.businessPartners[i].isActive = false;
         if (deletedBy) {
            user.businessPartners[i].deletedBy = deletedBy;
         }
      }

      await user.save()
      return user.transform()
   } catch (error) {
      throw error
   }
}

exports.updateDoctor = async ({ id, doctor, business }) => {
   try {
      let user = await User.get(id);
      let { businessPartners } = doctor

      // TODO: Find use case and Add validation for mobile number update for doctor
      // TODO: Validate roles similar to createDoctor

      const updatedDoctor = omit(doctor, "id", "_id", "userType", "platformPartner", "vigoId",
         "loginId", "businessPartners");
      user = Object.assign(user, updatedDoctor);

      if (business) {
         // Only update the given "business" BusinessPartner
         if (businessPartners) {
            let updatedBusinessPartner = businessPartners.find((bp) => bp.businessPartnerId === business);
            let bpIndex = user.businessPartners.findIndex((bp) => bp.businessPartnerId.toString() === business);
            if (updatedBusinessPartner) {
               if (bpIndex >= 0) {
                  user.businessPartners[bpIndex] = Object.assign(user.businessPartners[bpIndex], updatedBusinessPartner);
               } else {
                  user.businessPartners.push(updatedBusinessPartner)
               }
            }
         }
      } else {
         user.businessPartners = businessPartners
      }

      // Add vigoId if it does not exist
      await module.exports.setDoctorSequenceId(user)

      user = await user.save()
      return user.transform()
   } catch (error) {
      throw error
   }
}

exports.updateUserAgent = async ({ id, agent, business }) => {
   try {
      let user = await User.get(id);

      // TODO: Add validation similar to createUserAgent
      const updatedAgent = omit(agent, "id", "_id", "userType", "platformPartner", "vigoId",
         "loginId");

      user = Object.assign(user, updatedAgent);

      // Add vigoId if it does not exist
      await module.exports.setAgentSequenceId(user)

      user = await user.save()
      return user.transform()
   } catch (error) {
      throw error
   }
}

exports.checkDuplicateLoginId = async ({ loginId }) => {
   try {
      let isDuplicate = await User.checkDuplicateLoginId({ loginId });
      return { isDuplicate }
   } catch (error) {
      throw error
   }
}

exports.addDoctorInBody = async (req, res, next) => {
   try {
      const { entity } = req.session
      req.body.doctor = entity
      return next()
   } catch (error) {
      throw next(new APIError(error))
   }
}

exports.getAllDoctorForSocketCreation = async (query) => {
   try {
      let doctors = await User.find({})
      doctors = doctors.map((doctor) => {
         return doctor.transform()
      })
      return doctors
   } catch (error) {
      throw error
   }
}

exports.updateBusinessDetails = async (userBusinessPartners) => {
   try {
      const businessIds = userBusinessPartners.map((e) => { return e.businessPartnerId; });
      const { businessPartners } = await BusinessPartnerClient.getBusinessPartnerNames({ ids: businessIds });
      if (businessPartners && businessPartners.length > 0) {
         let businessPartnerMap = businessPartners.reduce(
            (acc, element, index) => {
               let key = element.id;
               acc[key] = element;
               return acc;
            }, {});
         console.log("Map", businessPartnerMap);
         userBusinessPartners.map((b) => {
            let bp = businessPartnerMap[b.businessPartnerId];
            if (bp) {
               b.businessPartnerName = bp.name;
               b.location = bp.location;
            }
         });
      }
      return userBusinessPartners;
   } catch (error) {
      console.log(error);
      throw new APIError(error);
   }
};
