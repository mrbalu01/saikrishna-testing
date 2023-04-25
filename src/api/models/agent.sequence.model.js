const mongoose = require("mongoose")
const Schema = mongoose.Schema

var modelSchema = new Schema(
   {
      prefix: { type: String, default: 'VA' },
      number: { type: Number, required: true, default: 1 }
   },
   { timestamps: true }
)

module.exports = mongoose.model("AgentSequence", modelSchema)
