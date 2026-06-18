import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    collaborationId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"Collaboration"
},

    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    entrepreneurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    connectedAt: {
      type: Date,
      default: Date.now,
    },
    isActive:{
   type:Boolean,
   default:true
}
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate connections
connectionSchema.index(
  {
    investorId: 1,
    entrepreneurId: 1,
  },
  {
    unique: true,
  }
);

const Connection = mongoose.model(
  "Connection",
  connectionSchema
);

export default Connection;