const mongoose = require("mongoose")
const Schema = mongoose.Schema

var modelSchema = new Schema(
   {
      prefix: { type: String, default: 'VD' },
      number: { type: Number, required: true, default: 1 }
   },
   { timestamps: true }
)

module.exports = mongoose.model("DoctorSequence", modelSchema)
