import Entrepreneur from "../models/entrepreneur.model.js";
import Investor from "../models/investor.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createProfile = async (req, res) => {
  const user = req.user;
  try {
    if (user.role === "entrepreneur") {
      const {
        startupName,
        pitchSummary,
        fundingNeeded,
        industry,
        location,
        foundedYear,
        teamSize,
        currentRound,
        previousFunding,
        website,
        linkedin,
      } = req.body;

      if(!startupName){
   throw new ApiError(
      400,
      "Startup name is required"
   );
}
      const entrepreneur = await Entrepreneur.findOne({ userId: user._id });
      if (entrepreneur) {
        throw new ApiError(400, "Profile already exists");
      }

      const entrepreneurProfile = await Entrepreneur.create({
        userId: user._id,
        startupName,
        pitchSummary,
        fundingNeeded,
        industry,
        location,
        foundedYear,
        teamSize,
        currentRound,
        previousFunding,
        website,
        linkedin,
      });
      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            entrepreneurProfile,
            "Entrepreneur Profile created successfully",
          ),
        );
    }

    if (user.role === "investor") {
      const {
        investmentInterests,
        investmentStage,
        portfolioCompanies,
        totalInvestments,
        minimumInvestment,
        maximumInvestment,
        location,
        investmentTimeline,
        investmentFocus,
        investmentCriteria,
        website,
        linkedin,
      } = req.body;
      if(
   !investmentInterests ||
   investmentInterests.length === 0
){
   throw new ApiError(
      400,
      "Investment interests are required"
   );
}
      const investor = await Investor.findOne({ userId: user._id });
      if (investor) {
        throw new ApiError(400, "Profile already exists");
      }
      const investorProfile = await Investor.create({
        userId: user._id,
        investmentInterests,
        investmentStage,
        portfolioCompanies,
        totalInvestments,
        minimumInvestment,
        maximumInvestment,
        location,
        investmentTimeline,
        investmentFocus,
        investmentCriteria,
        website,
        linkedin,
      });
      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            investorProfile,
            "Investor Profile created successfully",
          ),
        );
    }
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.message || "Internal Server Error"));
  }
};

export const getAllInvestors = async (req, res) => {
  try {
    const investors = await Investor.find().populate("userId", "name email avatar");
    return res.status(200).json(new ApiResponse(200, investors, "Investors fetched successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(error.message || "Internal Server Error"));
  }
};


export const getAllEntrepreneurs = async (req, res) => {
  try {
    const entrepreneurs = await Entrepreneur.find().populate("userId", "name email avatar");    
    return res.status(200).json(new ApiResponse(200, entrepreneurs, "Entrepreneurs fetched successfully"));
    } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(error.message || "Internal Server Error"));
    }
};


// get single entrepreneur and investor profile by user id can be implemented similarly if needed


export const getProfileByUserId = async (req, res) => {

  try {

    const { userId } = req.params;

    if (!userId) {
      throw new ApiError(
        400,
        "User ID is required"
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    if (user.role === "entrepreneur") {

      const entrepreneurProfile =
        await Entrepreneur.findOne({
          userId
        }).populate(
          "userId",
          "username email avatar bio role"
        );

      if (!entrepreneurProfile) {
        throw new ApiError(
          404,
          "Entrepreneur profile not found"
        );
      }

      return res.status(200).json(
        new ApiResponse(
          200,
          entrepreneurProfile,
          "Entrepreneur profile fetched successfully"
        )
      );
    }

    if (user.role === "investor") {

      const investorProfile =
        await Investor.findOne({
          userId
        }).populate(
          "userId",
          "username email avatar bio role"
        );

      if (!investorProfile) {
        throw new ApiError(
          404,
          "Investor profile not found"
        );
      }

      return res.status(200).json(
        new ApiResponse(
          200,
          investorProfile,
          "Investor profile fetched successfully"
        )
      );
    }

    throw new ApiError(
      400,
      "Invalid role"
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
