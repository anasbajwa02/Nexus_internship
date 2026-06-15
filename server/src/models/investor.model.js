import mongoose from "mongoose";
const investorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    investmentInterests: [
      {
        type: String
      }
    ],

    investmentStage: [
      {
        type: String
      }
    ],

    portfolioCompanies: [
      {
        type: String
      }
    ],

    totalInvestments: {
      type: Number,
      default: 0
    },

    minimumInvestment: {
      type: Number
    },

    maximumInvestment: {
      type: Number
    },

    location: {
      type: String
    },

    investmentTimeline: {
      type: String
    },

    investmentFocus: {
      type: String
    },

    investmentCriteria: {
      type: String
    },
     website:{
        type: String
    },
    linkedin:{
        type: String
    }

  },
  {
    timestamps: true
  }
);

const Investor = mongoose.model("Investor", investorSchema);

export default Investor;