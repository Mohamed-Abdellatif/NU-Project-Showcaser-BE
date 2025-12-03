import { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
    content: string;
    projectId: string;
    userId: string;
    authorFirstName: string;
    authorLastName: string;
    authorEmail: string;
}


const commentSchema = new Schema<IComment>({
    content: { type: String, required: true },
    projectId: { type: String, required: true },
    userId: { type: String, required: true },
    authorFirstName: { type: String, required: true },
    authorLastName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});

export const Comment = model<IComment>('Comment', commentSchema);
