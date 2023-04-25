const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");

const proto = protoLoader.loadSync(path.join(__dirname, "../../proto/", "doctor.proto"));
const definition = grpc.loadPackageDefinition(proto);

const doctorService = require('@services/doctor.service')

const getDoctorById = async (call, callback) => {
   try {
      let doctor = await doctorService.getDoctorById(call.request)
      callback(null, doctor)
   } catch (error) {
      callback(error, null)
   }
}

const getAllDoctor = async (call, callback) => {
   try {
      let doctors = await doctorService.getAllDoctor(call.request)
      callback(null, doctors)
   } catch (error) {
      callback(error, null)
   }
}

const getAllUserAgents = async (call, callback) => {
   try {
      let agents = await doctorService.getAllUserAgents(call.request)
      callback(null, agents)
   } catch (error) {
      callback(error, null)
   }
}

const getDoctorsByBusinessId = async (call, callback) => {
   try {
      let doctors = await doctorService.getDoctorsByBusinessId(call.request)
      callback(null, { doctors })
   } catch (error) {
      callback(error, null)
   }
}

const getUserAgentsByBusinessId = async (call, callback) => {
   try {
      let users = await doctorService.getUserAgentsByBusinessId(call.request)
      callback(null, { users })
   } catch (error) {
      callback(error, null)
   }
}

const createDoctor = async (call, callback) => {
   try {
      console.log(call.request)
      let doctor = await doctorService.createDoctor(call.request)
      callback(null, doctor)
   } catch (error) {
      callback(error, null)
   }
}

const createUserAgent = async (call, callback) => {
   try {
      console.log(call.request)
      let doctor = await doctorService.createUserAgent(call.request)
      callback(null, doctor)
   } catch (error) {
      callback(error, null)
   }
}

const deleteDoctor = async (call, callback) => {
   try {
      let doctor = await doctorService.deleteDoctor(call.request)
      callback(null, doctor)
   } catch (error) {
      callback(error, null)
   }
}

const deleteUserAgent = async (call, callback) => {
   try {
      let doctor = await doctorService.deleteUserAgent(call.request)
      callback(null, doctor)
   } catch (error) {
      callback(error, null)
   }
}

const updateDoctor = async (call, callback) => {
   try {
      let doctor = await doctorService.updateDoctor(call.request)
      callback(null, doctor)
   } catch (error) {
      callback(error, null)
   }
}

const checkDuplicateLoginId = async (call, callback) => {
   try {
      let result = await doctorService.checkDuplicateLoginId(call.request)
      callback(null, result)
   } catch (error) {
      callback(error, null)
   }
}

module.exports = {
   definition: definition.DoctorService.service,
   methods: {
      getDoctorById, getAllDoctor, getDoctorsByBusinessId,
      createDoctor, deleteDoctor, updateDoctor, checkDuplicateLoginId,
      getUserAgentsByBusinessId, getAllUserAgents, createUserAgent,
      deleteUserAgent
   }
}