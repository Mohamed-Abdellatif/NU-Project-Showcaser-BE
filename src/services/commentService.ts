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

export const getAllCommentsByAdmin = async (): Promise<IComment[]> => {
    return await Comment.find({});
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