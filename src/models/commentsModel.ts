import { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
    content: string;
    createdAt: Date;
}

const commentSchema = new Schema<IComment>({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Comment = model<IComment>('Comment', commentSchema);
