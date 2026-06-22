import Document from "../models/document.model.js";
import User from "../models/user.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import { uploadToCloudinary } from "../utils/cloudinary.js";

export const uploadDocument = async (req,res)=>{

 try{

   const user = req.user;

   const {title,description} = req.body;
   console.log("title",title,"description",description)

   if(user.role !== "entrepreneur"){

     throw new ApiError(

       403,

       "Only entrepreneurs can upload documents"

     );

   }

   if(!title){

     throw new ApiError(

       400,

       "Title is required"

     );

   }

   const localPath = req.file?.path;

   if(!localPath){

     throw new ApiError(

       400,

       "Document file is required"

     );

   }

   const cloudinaryResult =

   await uploadToCloudinary(localPath);

   if(!cloudinaryResult){

     throw new ApiError(

       500,

       "File upload failed"

     );

   }

   const fileName = req.file.originalname;

   const fileExtension =

   fileName.split(".").pop().toLowerCase();

   const document = await Document.create({

      entrepreneurId:user._id,

      title,

      description,

      fileName,

      fileUrl:cloudinaryResult.url,

      fileType:fileExtension

   });

   const populatedDocument =

   await Document.findById(document._id)

   .populate(

     "entrepreneurId",

     "name email avatar"

   );

   return res.status(201).json(

     new ApiResponse(

       201,

       populatedDocument,

       "Document uploaded successfully"

     )

   );

 }

 catch(error){

   console.error(error);

   return res

   .status(error.statusCode || 500)

   .json(

     new ApiError(

       error.message ||

       "Internal Server Error"

     )

   );

 }

}

// get the documents 

export const getMyDocuments = async(req,res)=>{

 try{

   const user = req.user;

   if(user.role !== "entrepreneur"){

     throw new ApiError(

       403,

       "Only entrepreneurs can access their documents"

     );

   }

   const documents =

   await Document.find({

     entrepreneurId:user._id

   })

   .sort({

     createdAt:-1

   });

   return res.status(200).json(

     new ApiResponse(

       200,

       documents,

       "Documents fetched successfully"

     )

   );

 }

 catch(error){

   console.error(error);

   return res

   .status(error.statusCode || 500)

   .json(

     new ApiError(

       error.message ||

       "Internal Server Error"

     )

   );

 }

}

// documents by enterprenure ( investor can see the docs of inter)

export const getDocumentsByEntrepreneur = async(

 req,

 res

)=>{

 try{

   const {entrepreneurId} = req.params;

   const entrepreneur =

   await User.findById(entrepreneurId);

   if(!entrepreneur){

     throw new ApiError(

       404,

       "Entrepreneur not found"

     );

   }

   const documents =

   await Document.find({

     entrepreneurId

   })

   .sort({

     createdAt:-1

   });

   return res.status(200).json(

     new ApiResponse(

       200,

       documents,

       "Documents fetched successfully"

     )

   );

 }

 catch(error){

   console.error(error);

   return res

   .status(error.statusCode || 500)

   .json(

     new ApiError(

       error.message ||

       "Internal Server Error"

     )

   );

 }

}

export const getSingleDocument = async(

 req,

 res

)=>{

 try{

   const {documentId} = req.params;

   const document =

   await Document.findById(documentId)

   .populate(

     "entrepreneurId",

     "name email avatar"

   );

   if(!document){

     throw new ApiError(

       404,

       "Document not found"

     );

   }

   return res.status(200).json(

     new ApiResponse(

       200,

       document,

       "Document fetched successfully"

     )

   );

 }

 catch(error){

   console.error(error);

   return res

   .status(error.statusCode || 500)

   .json(

     new ApiError(

       error.message ||

       "Internal Server Error"

     )

   );

 }

}

// update the documents
export const updateDocument = async(

 req,

 res

)=>{

 try{

   const user = req.user;

   const {documentId} = req.params;

   const {title,description} = req.body;

   const document =

   await Document.findById(documentId);

   if(!document){

     throw new ApiError(

       404,

       "Document not found"

     );

   }

   if(

     document.entrepreneurId.toString()

     !==

     user._id.toString()

   ){

     throw new ApiError(

       403,

       "Unauthorized"

     );

   }

   if(title){

     document.title = title;

   }

   if(description){

     document.description = description;

   }

   if(req.file){

     const localPath = req.file.path;

     const cloudinaryResult =

     await uploadToCloudinary(localPath);

     document.fileUrl =

     cloudinaryResult.url;

     document.fileName =

     req.file.originalname;

     document.fileType =

     req.file.originalname

     .split(".")

     .pop()

     .toLowerCase();

     document.version += 1;

   }

   await document.save();

   return res.status(200).json(

     new ApiResponse(

       200,

       document,

       "Document updated successfully"

     )

   );

 }

 catch(error){

   console.error(error);

   return res

   .status(error.statusCode || 500)

   .json(

     new ApiError(

       error.message ||

       "Internal Server Error"

     )

   );

 }

}


// delete the document 
export const deleteDocument = async(

 req,

 res

)=>{

 try{

   const user = req.user;

   const {documentId} = req.params;

   const document =

   await Document.findById(documentId);

   if(!document){

     throw new ApiError(

       404,

       "Document not found"

     );

   }

   if(

     document.entrepreneurId.toString()

     !==

     user._id.toString()

   ){

     throw new ApiError(

       403,

       "Unauthorized"

     );

   }

   await document.deleteOne();

   return res.status(200).json(

     new ApiResponse(

       200,

       null,

       "Document deleted successfully"

     )

   );

 }

 catch(error){

   console.error(error);

   return res

   .status(error.statusCode || 500)

   .json(

     new ApiError(

       error.message ||

       "Internal Server Error"

     )

   );

 }

}