import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import Connection from "../models/connection.model.js";
import Chat from "../models/chat.model.js";

import { uploadToCloudinary } from "../utils/cloudinary.js";

export const sendMessage = async (req, res) => {

  try {

    const user = req.user;

    const {
      connectionId,
      message,
      messageType
    } = req.body;

    // Validate connection id

    if (!connectionId) {

      throw new ApiError(
        400,
        "Connection id is required"
      );

    }

    // Validate message type

    const allowedTypes = [
      "text",
      "image",
      "file"
    ];

    if (
      !allowedTypes.includes(messageType)
    ) {

      throw new ApiError(
        400,
        "Invalid message type"
      );

    }

    // For text messages

    if (
      messageType === "text" &&
      !message
    ) {

      throw new ApiError(
        400,
        "Message is required"
      );

    }

    // For image/file messages

    if (
      ["image", "file"].includes(messageType)
      &&
      !req.file?.path
    ) {

      throw new ApiError(
        400,
        "Attachment is required"
      );

    }

    // Find connection

    const connection =
      await Connection.findById(
        connectionId
      );

    if (!connection) {

      throw new ApiError(
        404,
        "Connection not found"
      );

    }

    // Verify participant

    const isParticipant =

      connection.investorId.toString() === user._id.toString()

      ||

      connection.entrepreneurId.toString() === user._id.toString();

    if (!isParticipant) {

      throw new ApiError(
        403,
        "Unauthorized"
      );

    }

    // Determine receiver

    let receiverId;

    if (

      user._id.toString()

      ===

      connection.investorId.toString()

    ) {

      receiverId =
        connection.entrepreneurId;

    }

    else {

      receiverId =
        connection.investorId;

    }

    // Variables

    let textMessage = "";

    let fileUrl = "";

    let fileName = "";

    // Text message

    if (messageType === "text") {

      textMessage = message;

    }

    // Image/File message

    if (

      messageType === "image"

      ||

      messageType === "file"

    ) {

      const uploadedFile =

        await uploadToCloudinary(

          req.file.path

        );

      if (!uploadedFile) {

        throw new ApiError(
          500,
          "Failed to upload file"
        );

      }

      fileUrl = uploadedFile.url;

      fileName =
        req.file.originalname;

    }

    // Create chat

    const newChat =

      await Chat.create({

        connectionId,

        senderId: user._id,

        receiverId,

        messageType,

        message: textMessage,

        fileUrl,

        fileName

      });

    // Populate response

    const populatedMessage =

      await Chat.findById(

        newChat._id

      )

      .populate(

        "senderId",

        "name email avatar"

      )

      .populate(

        "receiverId",

        "name email avatar"

      );

    return res.status(201)

    .json(

      new ApiResponse(

        201,

        populatedMessage,

        "Message sent successfully"

      )

    );

  }

  catch (error) {

    console.error(error);

    return res

      .status(

        error.statusCode || 500

      )

      .json(

        new ApiError(

          error.message ||

          "Internal Server Error"

        )

      );

  }

};

// get specific chat 

export const getChat = async (req, res) => {

  try {

    const user = req.user;

    const { connectionId } = req.params;

    // Validate

    if (!connectionId) {

      throw new ApiError(
        400,
        "Connection id is required"
      );

    }

    // Verify connection exists

    const connection =
      await Connection.findById(
        connectionId
      );

    if (!connection) {

      throw new ApiError(
        404,
        "Connection not found"
      );

    }

    // Verify participant

    const isParticipant =

      connection.investorId.toString() === user._id.toString()

      ||

      connection.entrepreneurId.toString() === user._id.toString();

    if (!isParticipant) {

      throw new ApiError(
        403,
        "Unauthorized"
      );

    }

    // Fetch chats

    const chats = await Chat.find({

      connectionId

    })

    .populate(

      "senderId",

      "name email avatar"

    )

    .populate(

      "receiverId",

      "name email avatar"

    )

    .sort({

      createdAt: 1

    });

    return res.status(200)

    .json(

      new ApiResponse(

        200,

        chats,

        "Chats fetched successfully"

      )

    );

  }

  catch (error) {

    console.error(error);

    return res

      .status(

        error.statusCode || 500

      )

      .json(

        new ApiError(

          error.message ||

          "Internal Server Error"

        )

      );

  }

};