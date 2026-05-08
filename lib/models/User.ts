import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  role: "student" | "developer" | "professional" | "teacher";
  plan: "free" | "premium";
  createdCommunity: Types.ObjectId | null;
  joinedCommunities: Types.ObjectId[];
  points: number;
  streak: number;
  lastActiveDate: Date | null;
  meetingsAttended: Types.ObjectId[];
  workspaces: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },
    role: {
      type: String,
      enum: ["student", "developer", "professional", "teacher"],
      default: "student",
    },
    createdCommunity: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      default: null,
    },
    joinedCommunities: {
      type: [{ type: Schema.Types.ObjectId, ref: "Community" }],
      default: [],
    },
    points: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: null,
    },
    meetingsAttended: {
      type: [{ type: Schema.Types.ObjectId, ref: "Meeting" }],
      default: [],
    },
    workspaces: {
      type: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
