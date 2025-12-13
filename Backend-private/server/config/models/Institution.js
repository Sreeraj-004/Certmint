const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,   
    },

    name: { type: String, required: true }, 
    address: { type: String },
    contactNumber: { type: String },

    locationUrl: {
        type: String,
        trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institution", institutionSchema);
