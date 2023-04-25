const mongoose = require("mongoose"),
   Schema = mongoose.Schema,
   config = require("@config/vars"),
   moment = require('moment')
const { v1: uuidv1 } = require("uuid")

const EntityTypes = ["DOCTOR", "ADMIN", "OWNER", "NURSE", 'ASSOCIATE', 'INTERNAL_DOCTOR', 'EXTERNAL_DOCTOR']
const Roles = ['INTERNAL_DOCTOR', 'EXTERNAL_DOCTOR', 'ASSOCIATE', 'ADMIN']

const sessionSchema = new Schema(
   {
      entity: { type: Schema.Types.ObjectId, required: true },
      entityType: { type: String, enum: EntityTypes },
      businessPartners: [{
         businessPartnerId: { type: Schema.Types.ObjectId, required: true },
         roles: [{
            role: { type: String, enum: Roles }
         }],
         isActive: { type: Boolean, default: true },
         isDeleted: { type: Boolean, default: false }
      }],
      firstName: { type: String },
      lastName: { type: String },
      userType: { type: String },
      userId: { type: Schema.Types.ObjectId, required: true },
      loginRole: { type: String },
      agentType: { type: String },
      ipAddress: { type: String },
      token: { type: String, required: true },
      loginTime: { type: Date, default: new Date() },
      logoutTime: {
         type: Date,
      },
      isActive: { type: Boolean, default: true },
      channel: { type: String, enum: ["WEB", "MOBILE"], default: "WEB" }
   },
   {
      timestamps: true
   }
);

sessionSchema.statics = {
   async createSession(sessionData) {
      try {
         let session = new this(sessionData)
         const entity = sessionData.entity
         session.firstName = entity.firstName
         session.lastName = entity.lastName
         session.loginRole = sessionData.loginRole

         session.token = uuidv1()
         session.businessPartners = entity.businessPartners
         session.userType = entity.userType
         session.userId = entity.id
         let val = new moment().add(config.mobileUserTimeInMins || 43200, 'MINUTES')
         session.logoutTime = val

         loginSession = await session.save()
         return { token: loginSession }
      } catch (error) {
         throw error
      }
   },

   closeSessions(userId, channel = "WEB", cb) {
      console.log(`closing open sessions for userId: ${userId}`)
      cb(null)
   }
}

module.exports = mongoose.model("LoginSession", sessionSchema)
