// "use server";

// import { currentUser } from "@clerk/nextjs/server";
// import { db } from "@/lib/prisma";
// import { StreamClient } from "@stream-io/node-sdk";

// export const getCallData = async (callId) => {
//   const user = await currentUser();
//   if (!user) return { error: "Unauthorized" };

//   const booking = await db.booking.findUnique({
//     where: { streamCallId: callId },
//     include: {
//       interviewer: {
//         select: {
//           id: true,
//           clerkUserId: true,
//           name: true,
//           imageUrl: true,
//           categories: true,
//         },
//       },
//       interviewee: {
//         select: {
//           id: true,
//           clerkUserId: true,
//           name: true,
//           imageUrl: true,
//         },
//       },
//     },
//   });

//   if (!booking) return { error: "Call not found" };

//   const isInterviewer = booking.interviewer.clerkUserId === user.id;
//   const isInterviewee = booking.interviewee.clerkUserId === user.id;
//   if (!isInterviewer && !isInterviewee) return { error: "Forbidden" };

//   const streamClient = new StreamClient(
//     process.env.NEXT_PUBLIC_STREAM_API_KEY,
//     process.env.STREAM_SECRET_KEY || process.env.STREAM_API_SECRET
//   );

//   const token = streamClient.generateUserToken({
//     user_id: user.id,
//     validity_in_seconds: 60 * 60,
//   });

//   return {
//     token,
//     isInterviewer,
//     currentUser: {
//       id: user.id,
//       name: `${user.firstName} ${user.lastName}`.trim(),
//       imageUrl: user.imageUrl,
//     },
//     booking: {
//       id: booking.id,
//       interviewer: booking.interviewer,
//       interviewee: booking.interviewee,
//       categories: booking.interviewer.categories,
//       startTime: booking.startTime.toISOString(),
//       endTime: booking.endTime.toISOString(),
//     },
//   };
// };










"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { StreamClient } from "@stream-io/node-sdk";

export const getCallData = async (callId) => {
  try {
    // Get the currently authenticated Clerk user
    const user = await currentUser();

    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    // Find the booking using the Stream call ID
    const booking = await db.booking.findUnique({
      where: {
        streamCallId: callId,
      },
      include: {
        interviewer: {
          select: {
            id: true,
            clerkUserId: true,
            name: true,
            imageUrl: true,
            categories: true,
          },
        },

        interviewee: {
          select: {
            id: true,
            clerkUserId: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!booking) {
      return {
        error: "Call not found",
      };
    }

    // Check whether the current user is one of the participants
    const isInterviewer =
      booking.interviewer.clerkUserId === user.id;

    const isInterviewee =
      booking.interviewee.clerkUserId === user.id;

    if (!isInterviewer && !isInterviewee) {
      return {
        error: "Forbidden",
      };
    }

    // Validate Stream environment variables
    const streamApiKey =
      process.env.NEXT_PUBLIC_STREAM_API_KEY;

    const streamApiSecret =
      process.env.STREAM_SECRET_KEY ||
      process.env.STREAM_API_SECRET;

    if (!streamApiKey || !streamApiSecret) {
      console.error(
        "Missing Stream environment variables"
      );

      return {
        error: "Stream configuration is missing",
      };
    }

    // Create Stream server client
    const streamClient = new StreamClient(
      streamApiKey,
      streamApiSecret
    );

    // Generate Stream user token
    const token = streamClient.generateUserToken({
      user_id: user.id,
      validity_in_seconds: 60 * 60,
    });

    return {
      token,

      isInterviewer,

      currentUser: {
        id: user.id,

        name:
          `${user.firstName || ""} ${
            user.lastName || ""
          }`.trim() ||
          user.username ||
          "User",

        imageUrl: user.imageUrl || null,
      },

      booking: {
        id: booking.id,

        interviewer: booking.interviewer,

        interviewee: booking.interviewee,

        categories:
          booking.interviewer.categories,

        startTime:
          booking.startTime.toISOString(),

        endTime:
          booking.endTime.toISOString(),
      },
    };
  } catch (error) {
    console.error(
      "getCallData error:",
      error
    );

    return {
      error:
        "Failed to load call data. Please try again.",
    };
  }
};
