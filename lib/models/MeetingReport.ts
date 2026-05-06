import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMeetingReport extends Document {
  _id: Types.ObjectId;
  meetingId: Types.ObjectId;
  userId: Types.ObjectId;
  talkToListenRatio: number; // e.g., 45 for 45% talking
  fillerWordCount: number;
  pacingWpm: number; // Words per minute
  overallScore: number; // Out of 100
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingReportSchema = new Schema<IMeetingReport>(
  {
    meetingId: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    talkToListenRatio: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    fillerWordCount: {
      type: Number,
      required: true,
      min: 0,
    },
    pacingWpm: {
      type: Number,
      required: true,
      min: 0,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user only gets one report per meeting
MeetingReportSchema.index({ meetingId: 1, userId: 1 }, { unique: true });

const MeetingReport =
  mongoose.models.MeetingReport ||
  mongoose.model<IMeetingReport>("MeetingReport", MeetingReportSchema);

export default MeetingReport;
