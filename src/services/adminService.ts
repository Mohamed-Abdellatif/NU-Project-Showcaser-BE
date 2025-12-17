import { Project } from "../models/projectModel";
import userModel from "../models/userModel";
import { Comment } from "../models/commentModel";

export interface AdminStats {
  projects: {
    total: number;
    pending: number;
  };
  users: {
    total: number;
    newThisWeek: number;
  };
  comments: {
    total: number;
    newThisWeek: number;
  };
}

export const getAdminStats = async (): Promise<AdminStats> => {
  // Calculate date one week ago
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Get all stats in parallel for better performance
  const [
    totalProjects,
    pendingProjects,
    totalUsers,
    newUsersThisWeek,
    totalComments,
    newCommentsThisWeek,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: "pending" }),
    userModel.countDocuments(),
    userModel.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
    Comment.countDocuments(),
    Comment.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
  ]);

  return {
    projects: {
      total: totalProjects,
      pending: pendingProjects,
    },
    users: {
      total: totalUsers,
      newThisWeek: newUsersThisWeek,
    },
    comments: {
      total: totalComments,
      newThisWeek: newCommentsThisWeek,
    },
  };
};
