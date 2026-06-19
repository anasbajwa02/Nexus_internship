import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   
    messageType: {
  type: String,
  enum: ["text", "image", "file"],
  default: "text"
},
 message: {
      type: String,
      default:""
    },
    fileUrl:{
      type:String,
      default:""

    },
    fileName:{
      type:String,
      default:""
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
