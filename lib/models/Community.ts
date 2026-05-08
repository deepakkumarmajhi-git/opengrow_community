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
  pinnedNotes: { title: string; body: string; updatedAt: Date }[];
  resources: { title: string; url: string; description: string }[];
  announcements: { body: string; createdAt: Date }[];
  weeklyGoals: { text: string; done: boolean }[];
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
    pinnedNotes: {
      type: [
        {
          title: { type: String, required: true, trim: true, maxlength: 80 },
          body: { type: String, default: "", trim: true, maxlength: 800 },
          updatedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    resources: {
      type: [
        {
          title: { type: String, required: true, trim: true, maxlength: 80 },
          url: { type: String, required: true, trim: true, maxlength: 300 },
          description: { type: String, default: "", trim: true, maxlength: 180 },
        },
      ],
      default: [],
    },
    announcements: {
      type: [
        {
          body: { type: String, required: true, trim: true, maxlength: 300 },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    weeklyGoals: {
      type: [
        {
          text: { type: String, required: true, trim: true, maxlength: 140 },
          done: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

CommunitySchema.index({ members: 1 });
CommunitySchema.index({ category: 1 });

const Community =
  mongoose.models.Community ||
  mongoose.model<ICommunity>("Community", CommunitySchema);
export default Community;
