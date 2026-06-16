
import Collaboration from "../models/collaboration.model.js";
import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const sendCollaborationRequest = async (req, res) => {
  try {
    const investor = req.user;

    const { entrepreneurId, message } = req.body;

    // Validate entrepreneur id
    if (!entrepreneurId) {
      throw new ApiError(400, "Entrepreneur ID is required");
    }

    // Only investors can send requests
    if (investor.role !== "investor") {
      throw new ApiError(
        403,
        "Only investors can send collaboration requests"
      );
    }

    // Prevent sending request to yourself
    if (investor._id.toString() === entrepreneurId) {
      throw new ApiError(
        400,
        "You cannot send a collaboration request to yourself"
      );
    }

    // Check entrepreneur exists
    const entrepreneur = await User.findById(entrepreneurId);

    if (!entrepreneur) {
      throw new ApiError(404, "Entrepreneur not found");
    }

    // Check role
    if (entrepreneur.role !== "entrepreneur") {
      throw new ApiError(
        400,
        "You can only send requests to entrepreneurs"
      );
    }

    // Check existing request
    const existingRequest = await Collaboration.findOne({
      investorId: investor._id,
      entrepreneurId,
    });

    if (existingRequest) {
      throw new ApiError(
        400,
        `Request already ${existingRequest.status}`
      );
    }

    // Create request
    const collaboration = await Collaboration.create({
      investorId: investor._id,
      entrepreneurId,
      message,
    });

    // Populate response
    const populatedCollaboration =
      await Collaboration.findById(collaboration._id)

        .populate(
          "investorId",
          "name email avatar"
        )

        .populate(
          "entrepreneurId",
          "name email avatar"
        );

    return res.status(201).json(
      new ApiResponse(
        201,
        populatedCollaboration,
        "Collaboration request sent successfully"
      )
    );
  } catch (error) {
    console.error(error);

    return res
      .status(error.statusCode || 500)

      .json(
        new ApiError(
          error.message || "Internal Server Error"
        )
      );
  }
};

export const getMyCollaborations = async (req, res) => {
  try {
    const user = req.user;

    let collaborations;

    console.log("User:", user);

    // Entrepreneur
    if (user.role === "entrepreneur") {
      collaborations = await Collaboration.find({
        entrepreneurId: user._id,
      })
        .populate(
          "investorId",
          "name email avatar"
        )
        .sort({ createdAt: -1 });
    }

    // Investor
    if (user.role === "investor") {
      collaborations = await Collaboration.find({
        investorId: user._id,
      })
        .populate(
          "entrepreneurId",
          "name email avatar"
        )
        .sort({ createdAt: -1 });
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        collaborations,
        "Collaborations fetched successfully"
      )
    );
  } catch (error) {
    console.error(error);

    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.message || "Internal Server Error"
        )
      );
  }
};




//




export const updateCollaborationStatus = async (
  req,
  res
) => {
  try {
    const user = req.user;
    console.log("User:", user);

    const { collaborationId } = req.params;

    const { status } = req.body;

    // Only entrepreneurs can accept/reject
    if (user.role !== "entrepreneur") {
      throw new ApiError(
        403,
        "Only entrepreneurs can update requests"
      );
    }

    // Validate status
    if (
      !["accepted", "rejected"].includes(
        status
      )
    ) {
      throw new ApiError(
        400,
        "Status must be accepted or rejected"
      );
    }

    // Find collaboration
    const collaboration =
      await Collaboration.findById(collaborationId);
      console.log("Collaboration:", collaboration);

    if (!collaboration) {
      throw new ApiError(
        404,
        "Collaboration not found"
      );
    }

    // Security check
    if (
      collaboration.entrepreneurId.toString() !==
      user._id.toString()
    ) {
      throw new ApiError(
        403,
        "Unauthorized action"
      );
    }

    // Prevent updating twice
    if (
      collaboration.status !== "pending"
    ) {
      throw new ApiError(
        400,
        `Request already ${collaboration.status}`
      );
    }

    // Update status
    collaboration.status = status;

    await collaboration.save();

    // If accepted create connection
    if (status === "accepted") {
      await Connection.create({
        investorId:
          collaboration.investorId,

        entrepreneurId:
          collaboration.entrepreneurId,
      });
    }

    const updatedCollaboration =
      await Collaboration.findById(
        collaboration._id
      )
        .populate(
          "investorId",
          "name email avatar"
        )
        .populate(
          "entrepreneurId",
          "name email avatar"
        );

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedCollaboration,
        `Request ${status} successfully`
      )
    );
  } catch (error) {
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
};