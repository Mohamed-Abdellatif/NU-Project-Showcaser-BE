import { IComment, Comment } from '../models/commentsModel';

export const getComment = async (id: string): Promise<IComment | null> => {
    return await Comment.findById(id);
};

export const addComment = async (content: string): Promise<IComment> => {
    const newComment = new Comment(content);
    return await newComment.save();
};

export const deleteComment = async (id: string): Promise<void> => {
    await Comment.findByIdAndDelete(id);
};

export const editComment = async (id: string, content: Partial<IComment>): Promise<IComment | null> => {
    return await Comment.findByIdAndUpdate(id, content, { new: true });
};
