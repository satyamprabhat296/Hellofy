import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

/* ======================================================
   ✅ GET RECOMMENDED USERS (with dismiss support)
====================================================== */
export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId).select(
      "friends dismissedUsers"
    );

    const excludedIds = [
      currentUserId,
      ...(currentUser.friends || []),
      ...(currentUser.dismissedUsers || []),
    ];

    const recommendedUsers = await User.find({
      _id: { $nin: excludedIds },
      isOnboarded: true,
    }).select(
      "fullName profilePic location bio languagesToTeach languagesToLearn techStack experienceLevel github linkedin portfolio website"
    );

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
 

/* ======================================================
   ✅ DISMISS USER FROM SUGGESTIONS
====================================================== */
// ✅ Dismiss a suggested user (remove from future recommendations)
export async function dismissSuggestedUser(req, res) {
  try {
    const currentUserId = req.user.id;
    const { id: dismissedUserId } = req.params;

    if (currentUserId === dismissedUserId) {
      return res
        .status(400)
        .json({ message: "You cannot dismiss yourself." });
    }

    // ✅ Add dismissed user to the 'dismissedUsers' array
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { dismissedUsers: dismissedUserId },
    });

    res
      .status(200)
      .json({ success: true, message: "User dismissed successfully." });
  } catch (error) {
    console.error("Error in dismissSuggestedUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


/* ======================================================
   ✅ GET FRIENDS
====================================================== */
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage languagesToTeach languagesToLearn"
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/* ======================================================
   ✅ SEND FRIEND REQUEST
====================================================== */
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
      status: "pending",
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/* ======================================================
   ✅ ACCEPT FRIEND REQUEST
====================================================== */
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/* ======================================================
   ✅ GET INCOMING & ACCEPTED FRIEND REQUESTS
====================================================== */
export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage languagesToTeach languagesToLearn"
    );

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/* ======================================================
   ✅ GET OUTGOING FRIEND REQUESTS
====================================================== */
export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage languagesToTeach languagesToLearn"
    );

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
