import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICommunity extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  category: "communication" | "personality" | "technical" | "general";
  creator: Types.ObjectId;
  members: Types.ObjectId[];
  maxMembers: number;
  tags: string[];
  meetings: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommunitySchema = new Schema<ICommunity>(
  {
    name: {
      type: String,
      required: [true, "Community name is required"],
      trim: true,
      maxlength: 60,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ["communication", "personality", "technical", "general"],
      default: "general",
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    maxMembers: {
      type: Number,
      default: 12,
    },
    tags: {
      type: [String],
      default: [],
    },
    meetings: {
      type: [{ type: Schema.Types.ObjectId, ref: "Meeting" }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Community =
  mongoose.models.Community ||
  mongoose.model<ICommunity>("Community", CommunitySchema);
export default Community;
