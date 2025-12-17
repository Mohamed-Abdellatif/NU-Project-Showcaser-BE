import { IComment, Comment } from '../models/commentModel';

export const getComment = async (id: string): Promise<IComment | null> => {
    return await Comment.findById(id);
};

export const addComment = async (commentObj: Partial<IComment>): Promise<IComment> => {
    const newComment = new Comment(commentObj);
    return await newComment.save();
};

export const deleteComment = async (id: string): Promise<boolean> => {
    const result = await Comment.findByIdAndDelete(id);
    return result !== null;
};

export const editComment = async (id: string, content: Partial<IComment>): Promise<IComment | null> => {
    return await Comment.findByIdAndUpdate(id, content, { new: true });
};

export const getCommentsByProjectId = async (projectId: string): Promise<IComment[]> => {
    return await Comment.find({ projectId });
};

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CommentAdminFilters {
    content?: string;
    projectId?: string;
    userId?: string;
    authorFirstName?: string;
    authorLastName?: string;
    authorEmail?: string;
}

export const getAllCommentsByAdmin = async (
    page: number = 1,
    limit: number = 10,
    filters?: CommentAdminFilters
): Promise<PaginatedResult<IComment>> => {
    const skip = (page - 1) * limit;

    // Build filter query
    const filterQuery: Record<string, unknown> = {};

    if (filters?.content) {
        filterQuery.content = { $regex: filters.content, $options: "i" };
    }
    if (filters?.projectId) {
        filterQuery.projectId = filters.projectId;
    }
    if (filters?.userId) {
        filterQuery.userId = filters.userId;
    }
    if (filters?.authorFirstName) {
        filterQuery.authorFirstName = { $regex: filters.authorFirstName, $options: "i" };
    }
    if (filters?.authorLastName) {
        filterQuery.authorLastName = { $regex: filters.authorLastName, $options: "i" };
    }
    if (filters?.authorEmail) {
        filterQuery.authorEmail = { $regex: filters.authorEmail, $options: "i" };
    }

    const [data, total] = await Promise.all([
        Comment.find(filterQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Comment.countDocuments(filterQuery),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
};

export const getCommentByAdmin = async (id: string): Promise<IComment | null> => {
    return await Comment.findById(id);
};

export const editCommentByAdmin = async (
    commentId: string,
    commentData: Partial<IComment>
): Promise<IComment | null> => {
    return await Comment.findByIdAndUpdate(commentId, commentData, { new: true });
};

export const deleteCommentByAdmin = async (commentId: string): Promise<IComment | null> => {
    return await Comment.findByIdAndDelete(commentId);
};