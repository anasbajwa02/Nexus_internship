import mongoose from "mongoose";

const dealSchema = new mongoose.Schema({

 connectionId:{

  type:mongoose.Schema.Types.ObjectId,

  ref:"Connection",

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

 startupName:{

  type:String,

  required:true

 },

 industry:{

  type:String,

  required:true

 },

 investmentAmount:{

  type:Number,

  required:true

 },

 equity:{

  type:Number,

  required:true

 },

 fundingStage:{

  type:String,

  required:true

 },

 notes:{

  type:String,

  default:""

 },

 attachments:[

  {

   fileName:String,

   fileUrl:String

  }

 ],

 status:{

  type:String,

  enum:[

   "due_diligence",

   "term_sheet",

   "negotiation",

   "approved",

   "completed",

   "rejected"

  ],

  default:"due_diligence"

 },

 createdBy:{

  type:mongoose.Schema.Types.ObjectId,

  ref:"User"

 }

},
{
 timestamps:true
});

const Deal = mongoose.model(
 "Deal",
 dealSchema
);

export default Deal;