import mongoose from 'mongoose';

const collaborationSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
     entrepreneurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
      message: {
      type: String,
      default: "",
    },
 status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
}, { timestamps: true });

// Prevent duplicate requests
collaborationSchema.index(
  {
    investorId: 1,
    entrepreneurId: 1,
  },
  {
    unique: true,
  }
);


const Collaboration = mongoose.model('Collaboration', collaborationSchema);

export default Collaboration;