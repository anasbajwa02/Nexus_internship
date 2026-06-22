import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
{
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

  fileName:{

    type:String,

    required:true

  },

  fileUrl:{

    type:String,

    required:true

  },

  fileType:{

    type:String,

    enum:[
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx"
    ],

    required:true

  },

  version:{

    type:Number,

    default:1

  },

  signatureUrl:{

    type:String,

    default:""

  }

},
{
 timestamps:true
}
);

const Document = mongoose.model(
 "Document",
 documentSchema
);

export default Document;