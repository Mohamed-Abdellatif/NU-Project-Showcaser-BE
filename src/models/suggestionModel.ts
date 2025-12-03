import { Schema, model, Document } from "mongoose";

// Interface for the Suggestion document
export interface ISuggestion extends Document {
  title: string;
  description: string;
  images?: string[];
}

// Suggestion schema definition
const suggestionSchema = new Schema<ISuggestion>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: false },
});

export const Suggestion = model<ISuggestion>("Suggestion", suggestionSchema);
