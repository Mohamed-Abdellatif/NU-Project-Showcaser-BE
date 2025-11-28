import userModel, { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const register = async ({
  firstName,
  email,
  lastName,
  password,
}: RegisterParams) => {
  const findUser = await userModel.findOne({ email });

  if (findUser) {
    return { data: "User already exists!", statusCode: 400 };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });
  await newUser.save();

  return { data: generateJWT({ email, firstName, lastName }), statusCode: 200 };
};

interface LoginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginParams) => {
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: "Incorrect email or password!", statusCode: 400 };
  }

  // If the account was created via Microsoft SSO, it may not have a password
  if (!findUser.password) {
    return {
      data: "This account uses Microsoft login. Please sign in with Microsoft.",
      statusCode: 400,
    };
  }

  const passwordMatch = await bcrypt.compare(
    password,
    findUser.password as string
  );
  if (passwordMatch) {
    return {
      data: generateJWT({
        email,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
      }),
      statusCode: 200,
    };
  }
  return { data: "Incorrect email or password!", statusCode: 400 };
};

const generateJWT = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET as string);
};

export const updateUserStarredProjects = async (
  userId: string,
  projectId: string,
  action: "add" | "remove"
): Promise<IUser | null> => {
  const user = await userModel.findById(userId);
  if (!user) {
    return null;
  }

  if (action === "add") {
    // Add project ID if not already in the array
    if (!user.starredProjects.includes(projectId)) {
      user.starredProjects.push(projectId);
      await user.save();
    }
  } else {
    // Remove project ID from the array
    user.starredProjects = user.starredProjects.filter(
      (id) => id !== projectId
    );
    await user.save();
  }

  return user;
};

export const completeProfile = async (data: any) => {
  const { linkedInUrl, githubUrl, universityId, school, major } = data;
  const user = await userModel.findOne({ email: data.email });
  if (!user) {
    return { data: "User not found!", statusCode: 400 };
  }
  if (
    user.linkedInUrl ||
    user.githubUrl ||
    user.universityId ||
    user.school ||
    user.major
  ) {
    return { data: "Profile already completed!", statusCode: 400 };
  }
  user.linkedInUrl = linkedInUrl;
  user.githubUrl = githubUrl;
  user.universityId = universityId;
  user.school = school;
  user.major = major;
  await user.save();
  return { data: "Profile completed successfully!", statusCode: 200 };
};

export const updateProfile = async (data: any) => {
  const { linkedInUrl, githubUrl, universityId, school, major } = data;
  const user = await userModel.findOne({ email: data.email });
  if (!user) {
    return { data: "User not found!", statusCode: 400 };
  }
  user.linkedInUrl = linkedInUrl;
  user.githubUrl = githubUrl;
  user.universityId = universityId;
  user.school = school;
  user.major = major;
  await user.save();
  return { data: "Profile updated successfully!", statusCode: 200 };
};

export const getProfile = async (userId: string) => {
  // userId is the part before @ of the user email
  const emailPattern = new RegExp(`^${userId}@`);
  const user = await userModel
    .findOne({ email: emailPattern })
    .select(
      "firstName lastName linkedInUrl githubUrl universityId school major email"
    );
  if (!user) {
    return { data: "User not found!", statusCode: 400 };
  }
  return {
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      linkedInUrl: user.linkedInUrl,
      githubUrl: user.githubUrl,
      universityId: user.universityId,
      school: user.school,
      major: user.major,
      email: user.email,
    },
    statusCode: 200,
  };
};
