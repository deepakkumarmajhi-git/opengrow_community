import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMeeting extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  topic: string;
  template:
    | "custom"
    | "mock-interview"
    | "debate"
    | "group-discussion"
    | "english-speaking"
    | "product-pitch"
    | "leadership-circle";
  community: Types.ObjectId;
  host: Types.ObjectId;
  scheduledAt: Date;
  timezone: string;
  durationMinutes: number;
  recurrence: "none" | "daily" | "weekly" | "monthly";
  recurrenceGroupId: string;
  reminderMinutes: number[];
  availabilityOptions: {
    startsAt: Date;
    votes: Types.ObjectId[];
  }[];
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
    template: {
      type: String,
      enum: [
        "custom",
        "mock-interview",
        "debate",
        "group-discussion",
        "english-speaking",
        "product-pitch",
        "leadership-circle",
      ],
      default: "custom",
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
    timezone: {
      type: String,
      default: "UTC",
      trim: true,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    recurrence: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
    recurrenceGroupId: {
      type: String,
      default: "",
      trim: true,
    },
    reminderMinutes: {
      type: [Number],
      default: [60, 10],
    },
    availabilityOptions: {
      type: [
        {
          startsAt: { type: Date, required: true },
          votes: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
        },
      ],
      default: [],
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
