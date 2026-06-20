import Meeting from "../models/meeting.model.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createMeeting = async (req, res) => {

  try {

    const user = req.user;

    const {

      connectionId,

      title,

      description,

      meetingDate,

      duration,

      meetingType

    } = req.body;


    // Validation

    if (

      !connectionId ||

      !title ||

      !meetingDate

    ) {

      throw new ApiError(

        400,

        "Required fields are missing"

      );

    }


    // Find connection

    const connection = await Connection.findById(

      connectionId

    );

    if (!connection) {

      throw new ApiError(

        404,

        "Connection not found"

      );

    }


    // Security check

    const isAuthorized =

      connection.investorId.toString() === user._id.toString()

      ||

      connection.entrepreneurId.toString() === user._id.toString();


    if (!isAuthorized) {

      throw new ApiError(

        403,

        "You are not allowed to create this meeting"

      );

    }


    // Extract ids

    const investorId = connection.investorId;

    const entrepreneurId = connection.entrepreneurId;


    // Conflict detection

    const conflict = await Meeting.findOne({

      investorId,

      entrepreneurId,

      meetingDate,

      status: {

        $in: [

          "pending",

          "accepted"

        ]

      }

    });


    if (conflict) {

      throw new ApiError(

        400,

        "Meeting slot already booked"

      );

    }
let receiverId;

if (user._id.toString() === investorId.toString()) {

  receiverId = entrepreneurId;

} else {

  receiverId = investorId;

}

    // Create meeting

    const meeting = await Meeting.create({

      connectionId,

      createdBy: user._id,

      investorId,

      entrepreneurId,

      title,

      description,

      meetingDate,

      duration,

      meetingType

    });

    await Notification.create({

 userId: receiverId,

 type: "meeting",

 title: "Meeting Scheduled",

 message: `${user.name} scheduled a meeting`

});



    // Populate response

    const populatedMeeting = await Meeting.findById(

      meeting._id

    )

    .populate(

      "investorId",

      "_id name email avatar"

    )

    .populate(

      "entrepreneurId",

      "_id name email avatar"

    );


    return res.status(201)

    .json(

      new ApiResponse(

        201,

        populatedMeeting,

        "Meeting created successfully"

      )

    );

  }

  catch (error) {

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


// get all meeting of specific person

export const getMyMeetings = async (req, res) => {

  try {

    const user = req.user;

    const meetings =
    await Meeting.find({

      $or: [

        {
          investorId: user._id
        },

        {
          entrepreneurId: user._id
        }
      ]

    })

    .populate(

      "investorId",

      "name email avatar"

    )

    .populate(

      "entrepreneurId",

      "name email avatar"

    )

    .sort({

      meetingDate: 1
    });

    return res.status(200)

    .json(

      new ApiResponse(

        200,

        meetings,

        "Meetings fetched successfully"

      )
    );

  } catch (error) {

    console.error(error);

    return res

    .status(500)

    .json(

      new ApiError(

        error.message ||

        "Internal Server Error"

      )
    );
  }
};

// update the meeting status 
export const updateMeetingStatus = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body;
   

    // 1. Validate status input
    const allowedStatuses = [
      "accepted",
      "rejected",
      "cancelled",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    // 2. Find meeting
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }

    const userId = user._id.toString();

    // 3. Check participant
    const isInvestor =
      meeting.investorId.toString() === userId;

    const isEntrepreneur =
      meeting.entrepreneurId.toString() === userId;

    if (!isInvestor && !isEntrepreneur) {
      throw new ApiError(403, "Not a participant");
    }

    // 4. Identify creator
    const isCreator =
      meeting.createdBy.toString() === userId;

    // 5. ROLE-BASED ACTION RULES
    if (isCreator) {
      // Creator can ONLY cancel
      if (status !== "cancelled") {
        throw new ApiError(
          403,
          "Creator can only cancel the meeting"
        );
      }
    } else {
      // Other participant can ONLY accept or reject
      if (!["accepted", "rejected"].includes(status)) {
        throw new ApiError(
          403,
          "Only accept or reject allowed"
        );
      }
    }

    // 6. STATUS TRANSITION RULES
    const validTransitions = {
      pending: ["accepted", "rejected", "cancelled"],
      accepted: ["completed", "cancelled"],
      rejected: [],
      cancelled: [],
      completed: [],
    };

    if (
      !validTransitions[meeting.status].includes(status)
    ) {
      throw new ApiError(
        400,
        `Cannot change status from ${meeting.status} to ${status}`
      );
    }
    let receiverId;

if (

 user._id.toString()

 ===

 meeting.investorId.toString()

) {

 receiverId = meeting.entrepreneurId;

}

else {

 receiverId = meeting.investorId;

}

    // 7. Update status
    meeting.status = status;
    await meeting.save();
 
    await Notification.create({

 userId: receiverId,

 type: "meeting",

 title: "Meeting Updated",

 message: `${user.name} has ${status} the meeting`

});

    // 8. Response
    return res.status(200).json(
      new ApiResponse(
        200,
        meeting,
        "Meeting status updated successfully"
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