import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Connection",
    required: true
  },


  createdBy:{

    type:mongoose.Schema.Types.ObjectId,

    ref:"User",

    required:true
  },

  investorId:{

    type:mongoose.Schema.Types.ObjectId,

    ref:"User",

    required:true
  },

  entrepreneurId:{

    type:mongoose.Schema.Types.ObjectId,

    ref:"User",

    required:true
  },

  title:{

    type:String,

    required:true
  },

  description:{

    type:String,

    default:""
  },

  meetingDate:{

    type:Date,

    required:true
  },

  duration:{

    type:Number,

    default:30
  },

  meetingType:{

    type:String,

    enum:["audio","video"],

    default:"video"
  },

  status:{

    type:String,

    enum:[

      "pending",

      "accepted",

      "rejected",

      "completed",

      "cancelled"

    ],

    default:"pending"
  }

},
{
 timestamps:true
});

const Meeting =  mongoose.model("Meeting",meetingSchema)

export default Meeting;