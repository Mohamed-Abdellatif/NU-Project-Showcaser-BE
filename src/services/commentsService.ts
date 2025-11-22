import { IComment, Comment } from '../models/commentsModel';

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