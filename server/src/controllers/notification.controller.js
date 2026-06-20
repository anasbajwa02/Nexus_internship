import Notification from "../models/notification.model.js";

import ApiError from "../utils/ApiError.js";

import ApiResponse from "../utils/ApiResponse.js";

export const getNotifications = async (
  req,
  res
) => {

  try {

    const user = req.user;

    const notifications =

      await Notification.find({

        userId: user._id

      })

      .sort({

        createdAt: -1

      });

    return res.status(200)

    .json(

      new ApiResponse(

        200,

        notifications,

        "Notifications fetched successfully"

      )

    );

  }

  catch(error){

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


// update notifications
export const markNotificationRead = async (
  req,
  res
) => {

  try {

    const user = req.user;

    const {

      notificationId

    } = req.params;

    const notification =

      await Notification.findById(

        notificationId

      );

    if (!notification) {

      throw new ApiError(

        404,

        "Notification not found"

      );

    }

    if (

      notification.userId.toString()

      !==

      user._id.toString()

    ) {

      throw new ApiError(

        403,

        "Unauthorized"

      );

    }

    notification.isRead = true;

    await notification.save();

    return res.status(200)

    .json(

      new ApiResponse(

        200,

        notification,

        "Notification marked as read"

      )

    );

  }

  catch(error){

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
