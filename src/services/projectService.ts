import { IProject, Project, ITeamMember } from "../models/projectModel";

// Helper function to escape special regex characters
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const getAllProjectsByAdmin = async (): Promise<IProject[]> => {
  return await Project.find({});
};

export const getProjectByAdmin = async (id: string): Promise<IProject | null> => {
  return await Project.findById(id);
};

export const editProjectByAdmin = async (
  projectId: string,
  projectData: Partial<IProject>
): Promise<IProject | null> => {
  return await Project.findByIdAndUpdate(projectId, projectData, { new: true });
};

export const deleteProjectByAdmin = async (projectId: string): Promise<IProject | null> => {
  return await Project.findByIdAndDelete(projectId);
};


export const getAllProjects = async (): Promise<IProject[]> => {
  return await Project.find({ status: "accepted" });
};

export const createProject = async (
  projectData: Partial<IProject>
): Promise<IProject> => {
  const project = new Project(projectData);
  return await project.save();
};

export const createMultipleProjects = async (
  projectsData: Partial<IProject>[]
): Promise<IProject[]> => {
  const projects = await Project.insertMany(projectsData);
  return projects as IProject[];
};

export const getProjectById = async (id: string): Promise<IProject | null> => {
  return await Project.findById(id);
};

export const updateProject = async (
  id: string,
  projectData: Partial<IProject>
): Promise<IProject | null> => {
  return await Project.findByIdAndUpdate(id, projectData, { new: true });
};

export const deleteProject = async (id: string): Promise<IProject | null> => {
  return await Project.findByIdAndDelete(id);
};

export const getProjectByTitle = async (
  title: string
): Promise<IProject | null> => {
  return await Project.findOne({ title: title, status: "accepted" });
};

export const getProjectByMajor = async (major: string): Promise<IProject[]> => {
  return await Project.find({ major: major, status: "accepted" });
};

export const getProjectBySupervisor = async (
  supervisor: string
): Promise<IProject[]> => {
  return await Project.find({ supervisor: supervisor, status: "accepted" });
};

export const getProjectByTeamMember = async (
  teamMember: string
): Promise<IProject[]> => {
  return await Project.find({
    $or: [
      { "teamMembers.name": { $regex: teamMember, $options: "i" } },
      { "teamMembers.email": { $regex: teamMember, $options: "i" } },
    ],
    status: "accepted",
  });
};

export const getProjectByTeamLeader = async (
  teamLeader: string
): Promise<IProject[]> => {
  return await Project.find({
    $or: [
      { "teamLeader.name": { $regex: teamLeader, $options: "i" } },
      { "teamLeader.email": { $regex: teamLeader, $options: "i" } },
    ],
    status: "accepted",
  });
};

export type ProjectSearchCriteria = {
  title?: string;
  major?: string;
  supervisor?: string;
  teamMember?: string | ITeamMember | ITeamMember[];
  teamLeader?: string | ITeamMember;
};

export const searchProjects = async (
  criteria: ProjectSearchCriteria
): Promise<IProject[]> => {
  const orConditions: Record<string, unknown>[] = [];

  if (criteria.title) {
    orConditions.push({
      title: { $regex: criteria.title, $options: "i" },
    });
  }
  if (criteria.major) {
    orConditions.push({
      major: { $regex: criteria.major, $options: "i" },
    });
  }
  if (criteria.supervisor) {
    orConditions.push({
      supervisor: { $regex: criteria.supervisor, $options: "i" },
    });
  }
  if (criteria.teamMember) {
    if (typeof criteria.teamMember === "string") {
      // String search - search by name or email

      orConditions.push({
        $or: [
          {
            "teamMembers.name": { $regex: criteria.teamMember, $options: "i" },
          },
          {
            "teamMembers.email": { $regex: criteria.teamMember, $options: "i" },
          },
        ],
      });
    } else if (Array.isArray(criteria.teamMember)) {
      // Array of team members - match projects containing any of these members by name or email
      const memberConditions: Record<string, unknown>[] = [];
      criteria.teamMember.forEach((member, index) => {
        const conditions: Record<string, unknown>[] = [];
        if (member.name && member.name.trim()) {
          conditions.push({
            "teamMembers.name": { $regex: member.name.trim(), $options: "i" },
          });
        }
        if (member.email && member.email.trim()) {
          const email = member.email.trim();

          // Use flexible match for email - escape special chars but allow for typos
          const escapedEmail = escapeRegex(email);
          conditions.push({
            "teamMembers.email": { $regex: escapedEmail, $options: "i" },
          });
        }
        if (conditions.length > 0) {
          memberConditions.push({ $or: conditions });
        } else {
        }
      });
      if (memberConditions.length > 0) {
        orConditions.push({ $or: memberConditions });
      } else {
      }
    } else {
      // Single team member object - match by name or email
      const conditions: Record<string, unknown>[] = [];
      if (criteria.teamMember.name && criteria.teamMember.name.trim()) {
        conditions.push({
          "teamMembers.name": {
            $regex: criteria.teamMember.name.trim(),
            $options: "i",
          },
        });
      }
      if (criteria.teamMember.email && criteria.teamMember.email.trim()) {
        const email = criteria.teamMember.email.trim();

        // Use flexible match for email - escape special chars but allow for typos
        const escapedEmail = escapeRegex(email);
        conditions.push({
          "teamMembers.email": { $regex: escapedEmail, $options: "i" },
        });
      }
      if (conditions.length > 0) {
        orConditions.push({ $or: conditions });
      } else {
      }
    }
  }
  if (criteria.teamLeader) {
    if (typeof criteria.teamLeader === "string") {
      // String search - search by name or email

      orConditions.push({
        $or: [
          { "teamLeader.name": { $regex: criteria.teamLeader, $options: "i" } },
          {
            "teamLeader.email": { $regex: criteria.teamLeader, $options: "i" },
          },
        ],
      });
    } else {
      // Team leader object - match by name or email

      const conditions: Record<string, unknown>[] = [];
      if (criteria.teamLeader.name && criteria.teamLeader.name.trim()) {
        conditions.push({
          "teamLeader.name": {
            $regex: criteria.teamLeader.name.trim(),
            $options: "i",
          },
        });
      }
      if (criteria.teamLeader.email && criteria.teamLeader.email.trim()) {
        const email = criteria.teamLeader.email.trim();

        // Use flexible match for email - escape special chars but allow for typos
        const escapedEmail = escapeRegex(email);
        conditions.push({
          "teamLeader.email": { $regex: escapedEmail, $options: "i" },
        });
      }
      if (conditions.length > 0) {
        orConditions.push({ $or: conditions });
      } else {
      }
    }
  }

  const query = { $or: orConditions, status: "accepted" };

  const results = await Project.find(query);

  return results;
};

export const getFeaturedProjects = async (): Promise<IProject[]> => {
  return await Project.find({ status: "accepted" })
    .sort({ stars: -1 })
    .limit(6);
};

export interface PaginatedProjectsResult {
  projects: IProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getProjects = async (
  page: number = 1,
  limit: number = 10,
  filters?: ProjectSearchCriteria
): Promise<PaginatedProjectsResult> => {
  const skip = (page - 1) * limit;

  // Build filter query with AND logic (all filters must match)
  const filterQuery: Record<string, unknown> = {};
  const andConditions: Record<string, unknown>[] = [];

  if (filters?.title) {
    filterQuery.title = { $regex: filters.title, $options: "i" };
  }
  if (filters?.major) {
    filterQuery.course = { $regex: filters.major, $options: "i" };
  }
  if (filters?.supervisor) {
    filterQuery.supervisor = { $regex: filters.supervisor, $options: "i" };
  }
  if (filters?.teamMember) {
    if (typeof filters.teamMember === "string") {
      // String search - search by name or email
      andConditions.push({
        $or: [
          { "teamMembers.name": { $regex: filters.teamMember, $options: "i" } },
          {
            "teamMembers.email": { $regex: filters.teamMember, $options: "i" },
          },
        ],
      });
    } else if (Array.isArray(filters.teamMember)) {
      // Array of team members - match projects containing any of these members by name or email
      // For arrays, we'll use $or with $elemMatch for each member
      const memberOrConditions: Record<string, unknown>[] = [];
      filters.teamMember.forEach((member, index) => {
        const elemMatchConditions: Record<string, unknown>[] = [];
        if (member.name && member.name.trim()) {
          elemMatchConditions.push({
            name: { $regex: member.name.trim(), $options: "i" },
          });
        }
        if (member.email && member.email.trim()) {
          const email = member.email.trim();

          const emailParts = email.split("@");
          if (emailParts.length === 2) {
            const username = emailParts[0];
            const domain = emailParts[1].replace(/\./g, "\\.");
            // Extract name part (before numbers) and numbers
            const match = username.match(/^([^.]+\.)?([a-z]+)(\d+)$/i);
            if (match) {
              const prefix = match[1] ? match[1].replace(/\./g, "\\.") : "";
              const namePart = match[2].substring(
                0,
                Math.min(8, match[2].length)
              ); // First 8 chars of name
              const numbers = match[3];
              // Match: prefix + namePart (first 8 chars) + numbers + @domain
              const matchPattern = `${prefix}${namePart}.*${numbers}@${domain}`;
              elemMatchConditions.push({
                email: {
                  $regex: matchPattern,
                  $options: "i",
                },
              });
            } else {
              // Fallback to simple partial match
              const escapedEmail = escapeRegex(email);
              elemMatchConditions.push({
                email: { $regex: escapedEmail, $options: "i" },
              });
            }
          } else {
            const escapedEmail = escapeRegex(email);
            elemMatchConditions.push({
              email: { $regex: escapedEmail, $options: "i" },
            });
          }
        }
        if (elemMatchConditions.length > 0) {
          // Use $elemMatch to find this member in the teamMembers array
          memberOrConditions.push({
            teamMembers: {
              $elemMatch: {
                $or: elemMatchConditions,
              },
            },
          });
        } else {
        }
      });
      if (memberOrConditions.length > 0) {
        // Match if ANY of the provided members exists in the teamMembers array
        andConditions.push({ $or: memberOrConditions });
      } else {
      }
    } else {
      // Single team member object - match by name or email
      const conditions: Record<string, unknown>[] = [];
      if (filters.teamMember.name && filters.teamMember.name.trim()) {
        conditions.push({
          "teamMembers.name": {
            $regex: filters.teamMember.name.trim(),
            $options: "i",
          },
        });
      }
      if (filters.teamMember.email && filters.teamMember.email.trim()) {
        const email = filters.teamMember.email.trim();

        // Use flexible match for email - escape special chars but allow for typos
        const escapedEmail = escapeRegex(email);
        conditions.push({
          "teamMembers.email": { $regex: escapedEmail, $options: "i" },
        });
      }
      if (conditions.length > 0) {
        andConditions.push({ $or: conditions });
      } else {
      }
    }
  }
  if (filters?.teamLeader) {
    if (typeof filters.teamLeader === "string") {
      // String search - search by name or email
      andConditions.push({
        $or: [
          { "teamLeader.name": { $regex: filters.teamLeader, $options: "i" } },
          { "teamLeader.email": { $regex: filters.teamLeader, $options: "i" } },
        ],
      });
    } else {
      // Team leader object - match by name or email
      const conditions: Record<string, unknown>[] = [];
      if (filters.teamLeader.name && filters.teamLeader.name.trim()) {
        conditions.push({
          "teamLeader.name": {
            $regex: filters.teamLeader.name.trim(),
            $options: "i",
          },
        });
      }
      if (filters.teamLeader.email && filters.teamLeader.email.trim()) {
        const email = filters.teamLeader.email.trim();
        // Use flexible match - extract key identifying parts
        const emailParts = email.split("@");
        if (emailParts.length === 2) {
          const username = emailParts[0];
          const domain = emailParts[1].replace(/\./g, "\\.");
          // Extract name part (before numbers) and numbers
          const match = username.match(/^([^.]+\.)?([a-z]+)(\d+)$/i);
          if (match) {
            const prefix = match[1] ? match[1].replace(/\./g, "\\.") : "";
            const namePart = match[2].substring(
              0,
              Math.min(8, match[2].length)
            ); // First 8 chars of name
            const numbers = match[3];
            // Match: prefix + namePart (first 8 chars) + numbers + @domain
            const matchPattern = `${prefix}${namePart}.*${numbers}@${domain}`;
            conditions.push({
              "teamLeader.email": {
                $regex: matchPattern,
                $options: "i",
              },
            });
          } else {
            // Fallback to simple partial match
            const escapedEmail = escapeRegex(email);
            conditions.push({
              "teamLeader.email": { $regex: escapedEmail, $options: "i" },
            });
          }
        } else {
          const escapedEmail = escapeRegex(email);
          conditions.push({
            "teamLeader.email": { $regex: escapedEmail, $options: "i" },
          });
        }
      }
      if (conditions.length > 0) {
        andConditions.push({ $or: conditions });
      } else {
      }
    }
  }

  // Combine all conditions
  // For teamMember/teamLeader filters, use OR logic (match if either matches)
  // For other filters (title, major/course, supervisor), use AND logic
  let finalQuery: Record<string, unknown> = {
    ...filterQuery,
    status: "accepted",
  };

  if (andConditions.length > 0) {
    // When we have team filters, we need to use $and to properly combine
    // the filterQuery (title, course, supervisor) with team conditions
    const allConditions: Record<string, unknown>[] = [];
    
    // Add all filterQuery conditions as separate $and conditions
    Object.keys(filterQuery).forEach((key) => {
      allConditions.push({ [key]: filterQuery[key] });
    });
    
    // Add status condition
    allConditions.push({ status: "accepted" });
    
    // Flatten team filter conditions
    const teamFilterConditions: Record<string, unknown>[] = [];
    andConditions.forEach((cond) => {
      if ("$or" in cond) {
        // Extract the conditions from nested $or
        const orConditions = cond.$or as Record<string, unknown>[];
        orConditions.forEach((oc) => teamFilterConditions.push(oc));
      } else {
        teamFilterConditions.push(cond);
      }
    });

    if (teamFilterConditions.length > 0) {
      // Add team filters as an $or condition within $and
      allConditions.push({ $or: teamFilterConditions });
    }
    
    // Use $and to ensure all conditions must match
    finalQuery = { $and: allConditions };
  }

  const [projects, total] = await Promise.all([
    Project.find(finalQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(finalQuery),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const updateProjectStars = async (
  id: string,
  action: "add" | "remove"
): Promise<IProject | null> => {
  const project = await Project.findById(id);
  if (!project) {
    return null;
  }

  const currentStars = project.stars || 0;
  const newStars =
    action === "add" ? currentStars + 1 : Math.max(0, currentStars - 1);

  return await Project.findByIdAndUpdate(
    id,
    { stars: newStars },
    { new: true }
  );
};

export const getStarredProjects = async (
  projectIds: string[]
): Promise<IProject[]> => {
  if (!projectIds || projectIds.length === 0) {
    return [];
  }
  return await Project.find({ _id: { $in: projectIds } });
};

export const getPendingProjectsByTA = async (
  taMail: string
): Promise<IProject[]> => {
  return await Project.find({
    teachingAssistant: {
      $regex: taMail.trim(),
      $options: "i",
    },
    status: "pending-ta",
  });
};

export const getRelatedProjects = async (
  projectId: string
) => {
  const currentProject = await Project.findById(projectId);

  if (!currentProject) {
    throw new Error("Project not found");
  }

  const allProjects = await Project.find({
    _id: { $ne: projectId }
  });

  if (allProjects.length === 0) {
    return [];
  }

  const calculateJaccard = (tagsA: string[], tagsB: string[]) => {
    const setA = new Set(tagsA);
    const setB = new Set(tagsB);

    const intersection = [...setA].filter(tag => setB.has(tag));
    const union = new Set([...setA, ...setB]);

    return intersection.length / union.size;
  };

  const projectsWithSimilarity = allProjects.map(project => {
    const similarity = calculateJaccard(
      currentProject.tags,
      project.tags
    );

    return {
      project,
      similarity
    };
  });

  const similarProjects = projectsWithSimilarity
    .filter(item => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity);

  const topSimilar = similarProjects.slice(0, 3).map(item => item.project);

  if (topSimilar.length >= 2) {
    return topSimilar;
  }

  const usedIds = new Set(topSimilar.map(p => p._id?.toString()));

  const remainingProjects = allProjects.filter(
    p => !usedIds.has(p._id?.toString())
  );

  const shuffled = remainingProjects.sort(() => 0.5 - Math.random());

  while (topSimilar.length < 4 && shuffled.length > 0) {
    topSimilar.push(shuffled.pop()!);
  }

  return topSimilar;
};
