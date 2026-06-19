import Connection from "../models/connection.model.js";

import ApiError from "../utils/ApiError.js";

import ApiResponse from "../utils/ApiResponse.js";

export const getMyConnections = async (req, res) => {

  try {

    const user = req.user;
   
    let connections;

    // Investor

    if (user.role === "investor") {

      connections = await Connection.find({

        investorId: user._id,


      })

      .populate(

        "entrepreneurId",

        "name email avatar role isOnline"

      )

      .sort({

        createdAt: -1

      });

    }

    // Entrepreneur

    else if (

      user.role === "entrepreneur"

    ) {

      connections = await Connection.find({

        entrepreneurId: user._id,

      })

      .populate(

        "investorId",

        "name email avatar role isOnline"

      )

      .sort({

        createdAt: -1

      });

    }

    else {

      throw new ApiError(

        400,

        "Invalid role"

      );

    }

    return res.status(200)

    .json(

      new ApiResponse(

        200,

        connections,

        "Connections fetched successfully"

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

// getSingleConnection

export const getSingleConnection = async (req,res)=>{
    try {
        const user = req.user;
        const {connectionId} = req.params

        if(!connectionId){
            throw new ApiError(401,"connectionId required")
        }

        const connection = await Connection.findById(connectionId).populate(
        "investorId",

        "name email avatar role isOnline")
        .populate(
            
        "entrepreneurId",

        "name email avatar role isOnline"
        )
        return res.status(200).json(
          new  ApiResponse(
             200,
            connection,
            "Connection Detail Fetched Successfully"
           )
        )



       
        
    } catch (error) {
        
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
    
}