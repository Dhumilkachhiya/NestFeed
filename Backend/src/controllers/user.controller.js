import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import getDataUri from "../utils/dataUri.js";
import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";

const generateAccessTokenAndRefreshToken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors(500, "Something went wrong while generating Token");
  }
};

const register = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new ApiErrors(401, "All fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new ApiErrors(400, "Email already in use");
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      throw new ApiErrors(500, "Something went wrong while registering user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    // Re-throw ApiErrors so the proper status code reaches the client
    throw error;
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiErrors(401, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiErrors(400, "User not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiErrors(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  await user.save();

  // populate each post if in the posts array
  const populatedPosts = await Promise.all(
    user.post.map(async (postId) => {
      const post = await Post.findById(postId);
      if (post && post.author.equals(user._id)) {
        return post;
      }
      return null;
    })
  );

  const loggedInUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    post: populatedPosts,
  };



  const option = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  };

  return res
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loggedIn Successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "User not authenticated" });
  }



  const option = {
    httpOnly: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Profile fetched successfully"));
});

const editProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    let cloudresponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudresponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new ApiErrors(401, "User not found");
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudresponse.secure_url;

    await user.save();

    return res.status(200).json(new ApiResponse(201, user, "Profile updated"));
  } catch (error) {
    console.log(error);
  }
});

const getSuggestedUsers = asyncHandler(async (req, res) => {
  const suggestedUsers = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );
  if (!suggestedUsers) {
    throw new ApiErrors(401, "Currently do not suggest any user");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, suggestedUsers, "Suggested users fetched"));
});

const followOrUnfollow = asyncHandler(async (req, res) => {
  try {
    console.log("User ID from token:", req.user._id); // Debugging line
    console.log("Params ID:", req.params.id);

    const myAccount = req.user._id; // My logged in account
    const otherAccount = req.params.id; // Account that i want to follow or unfollow

    if (myAccount === otherAccount) {
      throw new ApiErrors(401, "You can not follow yourself");
    }

    const user = await User.findById(myAccount);
    const targetUser = await User.findById(otherAccount);

    if (!user || !targetUser) {
      throw new ApiErrors(400, "User not found");
    }

    // check if i already follow that targetUser

    const isFollowing = user.following.includes(otherAccount);

    if (isFollowing) {
      // Unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: myAccount },
          { $pull: { following: otherAccount } }
        ),
        User.updateOne(
          { _id: otherAccount },
          { $pull: { followers: myAccount } }
        ),
      ]);
      return res
        .status(200)
        .json(new ApiResponse(201, {}, "Unfollowed successfully"));
    } else {
      // Follow logic
      await Promise.all([
        User.updateOne(
          { _id: myAccount },
          { $push: { following: otherAccount } }
        ),
        User.updateOne(
          { _id: otherAccount },
          { $push: { followers: myAccount } }
        ),
      ]);
      return res
        .status(200)
        .json(new ApiResponse(201, {}, "Followed successfully"));
    }
  } catch (error) {
    console.log(error);
  }
});

export {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  getSuggestedUsers,
  followOrUnfollow,
};
