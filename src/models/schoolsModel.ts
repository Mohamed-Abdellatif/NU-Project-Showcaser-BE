import { Schema, model, Document } from "mongoose";

// Interface for the School document
export interface ISchool extends Document {
  name: string;
  majors: string[];
}

// School schema definition
const schoolSchema = new Schema<ISchool>({
  name: { type: String, required: true },
  majors: { type: [String], required: true },
});

export const School = model<ISchool>("School", schoolSchema);
