import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMeeting extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  topic: string;
  community: Types.ObjectId;
  host: Types.ObjectId;
  scheduledAt: Date;
  durationMinutes: number;
  status: "upcoming" | "active" | "completed";
  attendees: Types.ObjectId[];
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    topic: {
      type: String,
      default: "",
      trim: true,
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      default: "upcoming",
    },
    attendees: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    roomId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Meeting =
  mongoose.models.Meeting ||
  mongoose.model<IMeeting>("Meeting", MeetingSchema);
export default Meeting;
