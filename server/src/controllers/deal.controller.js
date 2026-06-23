import Deal from "../models/deal.model.js";

import Connection from "../models/connection.model.js";

import Meeting from "../models/meeting.model.js";

import Notification from "../models/notification.model.js";

import ApiError from "../utils/ApiError.js";

import ApiResponse from "../utils/ApiResponse.js";

import { uploadToCloudinary } from "../utils/cloudinary.js";

export const createDeal = async (
  req,

  res,
) => {
  try {
    const user = req.user;

    const {
      connectionId,

      startupName,

      industry,

      investmentAmount,

      equity,

      fundingStage,

      notes,
    } = req.body;

    // Only investor

    if (user.role !== "investor") {
      throw new ApiError(
        403,

        "Only investors can create deals",
      );
    }

    // Validation

    if (
      !connectionId ||
      !startupName ||
      !industry ||
      !investmentAmount ||
      !equity ||
      !fundingStage
    ) {
      throw new ApiError(
        400,

        "Required fields are missing",
      );
    }

    // Find connection

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      throw new ApiError(
        404,

        "Connection not found",
      );
    }

    // Security check

    if (connection.investorId.toString() !== user._id.toString()) {
      throw new ApiError(
        403,

        "Unauthorized",
      );
    }

    // Meeting check

    const acceptedMeeting = await Meeting.findOne({
      connectionId,

      status: "accepted",
    });

    if (!acceptedMeeting) {
      throw new ApiError(
        400,

        "At least one accepted meeting is required",
      );
    }

    // Prevent duplicate deals

    const existingDeal = await Deal.findOne({
      connectionId,

      status: {
        $nin: ["completed", "rejected"],
      },
    });

    if (existingDeal) {
      throw new ApiError(
        400,

        "An active deal already exists",
      );
    }

    // Upload attachments

    let attachments = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const cloudinaryResult = await uploadToCloudinary(file.path);

        attachments.push({
          fileName: file.originalname,

          fileUrl: cloudinaryResult.url,
        });
      }
    }

    // Create deal

    const deal = await Deal.create({
      connectionId,

      investorId: connection.investorId,

      entrepreneurId: connection.entrepreneurId,

      startupName,

      industry,

      investmentAmount,

      equity,

      fundingStage,

      notes,

      attachments,

      createdBy: user._id,
    });

    // Notification

    await Notification.create({
      userId: connection.entrepreneurId,

      type: "deal",

      title: "New Deal",

      message: `${user.name} created a new deal`,
    });

    const populatedDeal = await Deal.findById(deal._id)

      .populate(
        "investorId",

        "name email avatar",
      )

      .populate(
        "entrepreneurId",

        "name email avatar",
      );

    return res
      .status(201)

      .json(
        new ApiResponse(
          201,

          populatedDeal,

          "Deal created successfully",
        ),
      );
  } catch (error) {
    console.error(error);

    return res

      .status(error.statusCode || 500)

      .json(new ApiError(error.message || "Internal Server Error"));
  }
};

// get all the deal of specific user
export const getMyDeals = async (req, res) => {
  try {
    const user = req.user;

    let deals;

    if (user.role === "investor") {
      deals = await Deal.find({
        investorId: user._id,
      })

        .populate(
          "investorId",

          "name email avatar",
        )

        .populate(
          "entrepreneurId",

          "name email avatar",
        )

        .populate("connectionId")

        .sort({
          createdAt: -1,
        });
    }

    if (user.role === "entrepreneur") {
      deals = await Deal.find({
        entrepreneurId: user._id,
      })

        .populate(
          "investorId",

          "name email avatar",
        )

        .populate(
          "entrepreneurId",

          "name email avatar",
        )

        .populate("connectionId")

        .sort({
          createdAt: -1,
        });
    }

    return res
      .status(200)

      .json(
        new ApiResponse(
          200,

          deals,

          "Deals fetched successfully",
        ),
      );
  } catch (error) {
    console.error(error);

    return res

      .status(error.statusCode || 500)

      .json(new ApiError(error.message || "Internal Server Error"));
  }
};

// get specific deal
export const getSingleDeal = async (
  req,

  res,
) => {
  try {
    const user = req.user;

    const { dealId } = req.params;

    const deal = await Deal.findById(dealId)

      .populate(
        "investorId",

        "name email avatar",
      )

      .populate(
        "entrepreneurId",

        "name email avatar",
      )

      .populate("connectionId");

    if (!deal) {
      throw new ApiError(
        404,

        "Deal not found",
      );
    }

    const isParticipant =
      deal.investorId._id.toString() === user._id.toString() ||
      deal.entrepreneurId._id.toString() === user._id.toString();

    if (!isParticipant) {
      throw new ApiError(
        403,

        "Unauthorized",
      );
    }

    return res
      .status(200)

      .json(
        new ApiResponse(
          200,

          deal,

          "Deal fetched successfully",
        ),
      );
  } catch (error) {
    console.error(error);

    return res

      .status(error.statusCode || 500)

      .json(new ApiError(error.message || "Internal Server Error"));
  }
};

// update controller
export const updateDeal = async (
  req,

  res,
) => {
  try {
    const user = req.user;

    const { dealId } = req.params;

    const { status } = req.body;

    const deal = await Deal.findById(dealId);

    if (!deal) {
      throw new ApiError(
        404,

        "Deal not found",
      );
    }

    const validTransitions = {
      due_diligence: ["term_sheet", "rejected"],

      term_sheet: ["negotiation", "approved", "rejected"],

      negotiation: ["approved", "rejected"],

      approved: ["completed"],

      completed: [],

      rejected: [],
    };
    // if(validTransitions["negotiation"].includes("approved")){
    //   console.log("yes ")
    // }

    if (!validTransitions[deal.status].includes(status)) {
      throw new ApiError(
        400,

        `Cannot change status from ${deal.status} to ${status}`,
      );
    }

    const isInvestor = deal.investorId.toString() === user._id.toString();

    const isEntrepreneur =
      deal.entrepreneurId.toString() === user._id.toString();

    if (!isInvestor && !isEntrepreneur) {
      throw new ApiError(
        403,

        "Unauthorized",
      );
    }

    // Role permissions

    if (isInvestor) {
      if (!["term_sheet", "approved", "completed"].includes(status)) {
        throw new ApiError(
          403,

          "Investor cannot perform this action",
        );
      }
    }

    if (isEntrepreneur) {
      if (!["negotiation", "rejected"].includes(status)) {
        throw new ApiError(
          403,

          "Entrepreneur cannot perform this action",
        );
      }
    }

    deal.status = status;

    await deal.save();

    let receiverId;

    if (isInvestor) {
      receiverId = deal.entrepreneurId;
    } else {
      receiverId = deal.investorId;
    }

    await Notification.create({
      userId: receiverId,

      type: "deal",

      title: "Deal Updated",

      message: `${user.name} updated deal to ${status}`,
    });

    return res
      .status(200)

      .json(
        new ApiResponse(
          200,

          deal,

          "Deal updated successfully",
        ),
      );
  } catch (error) {
    console.error(error);

    return res

      .status(error.statusCode || 500)

      .json(new ApiError(error.message || "Internal Server Error"));
  }
};

// delete the deal

export const deleteDeal = async (
  req,

  res,
) => {
  try {
    const user = req.user;

    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);

    if (!deal) {
      throw new ApiError(
        404,

        "Deal not found",
      );
    }

    if (deal.investorId.toString() !== user._id.toString()) {
      throw new ApiError(
        403,

        "Only investor can delete",
      );
    }

    if (["approved", "completed"].includes(deal.status)) {
      throw new ApiError(
        400,

        "Cannot delete this deal",
      );
    }

    await Deal.findByIdAndDelete(dealId);

    return res
      .status(200)

      .json(
        new ApiResponse(
          200,

          null,

          "Deal deleted successfully",
        ),
      );
  } catch (error) {
    console.error(error);

    return res

      .status(error.statusCode || 500)

      .json(new ApiError(error.message || "Internal Server Error"));
  }
};
