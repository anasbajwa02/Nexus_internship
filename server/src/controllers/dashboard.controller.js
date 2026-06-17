import Entrepreneur from "../models/entrepreneur.model.js";
import Connection from "../models/connection.model.js";
import Collaboration from "../models/collaboration.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js"


export const getInvestorDashboard = async (req,res)=>{
    try{
        const user = req.user;
        if(user.role !== "investor"){
            throw new ApiError(403, "Only investors can access this dashboard");

        }
        const totalStartups = await Entrepreneur.countDocuments();

        const industries = await Entrepreneur.distinct("industry");

        const yourConnections = await Connection.countDocuments({investorId : user._id});

        const recentStartups = await Entrepreneur.find().sort({createdAt: -1}).limit(5);

        return res.status(200).json( new ApiResponse(
            200,
            {
                totalStartups,
                industries : industries.length,
                yourConnections,
                recentStartups
            },
            "Investor dashboard data fetched successfully"
        ))


    }catch(error){
        console.error("Error fetching investor dashboard data:", error);
        return res.status(500).json(new ApiError(500, error || "Failed to fetch investor dashboard data"));
    }
}

export const getEntrepreneurDashboard = async (req,res)=>{
    try{
        const user = req.user;
        if(user.role !== "entrepreneur"){
            throw new ApiError(403, "Only entrepreneurs can access this dashboard");    
        }
        const pendingRequests = await Collaboration.countDocuments(
            {
                entrepreneurId: user._id,
                status: "pending"
            }
        );
        const totalConnection = await Connection.countDocuments({
            entrepreneurId:user._id,
        })

        // build later
        const upComingMeetings = 0;

        // build later 

        const profileViews = 0;

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    pendingRequests,
                    totalConnection,
                    upComingMeetings,
                    profileViews
                },
                "Entrepreneur dashboard fetched successfully"
            )
        )
    }
    catch(error){
        console.error("Error fetching Entrepreneur dashboard data:", error);
         return res.status(500).json(new ApiError(500, error.message || "Failed to fetch Entrepreneur dashboard data"));




    }
}