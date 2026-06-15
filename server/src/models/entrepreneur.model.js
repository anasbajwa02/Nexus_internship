import mongoose from "mongoose";


const entrepreneurSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    startupName: {
      type: String,
      required: true
    },

    pitchSummary: {
      type: String
    },

    fundingNeeded: {
      type: Number
    },

    industry: {
      type: String
    },

    location: {
      type: String
    },

    foundedYear: {
      type: Number
    },

    teamSize: {
      type: Number
    },

    currentRound: {
      type: String
    },

    previousFunding: {
      type: Number,
      default: 0
    },
    website:{
        type: String
    },
    linkedin:{
        type: String
    },

    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Entrepreneur = mongoose.model("Entrepreneur", entrepreneurSchema);

export default Entrepreneur;