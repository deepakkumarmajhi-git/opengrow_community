import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMeetingReport extends Document {
  _id: Types.ObjectId;
  meetingId: Types.ObjectId;
  userId: Types.ObjectId;
  talkToListenRatio: number; // e.g., 45 for 45% talking
  speakingTimeSeconds: number;
  listeningTimeSeconds: number;
  clarityScore: number;
  confidenceScore: number;
  confidenceTrend: "rising" | "steady" | "dipping";
  fillerWordCount: number;
  fillerHeatmap: { word: string; count: number; severity: "low" | "medium" | "high" }[];
  pacingWpm: number; // Words per minute
  overallScore: number; // Out of 100
  summary: string;
  transcript: string;
  feedback: string;
  actionItems: string[];
  tryNextTime: string;
  badgesEarned: string[];
  nextGoals: string[];
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
    speakingTimeSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    listeningTimeSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    clarityScore: {
      type: Number,
      default: 75,
      min: 0,
      max: 100,
    },
    confidenceScore: {
      type: Number,
      default: 75,
      min: 0,
      max: 100,
    },
    confidenceTrend: {
      type: String,
      enum: ["rising", "steady", "dipping"],
      default: "steady",
    },
    fillerWordCount: {
      type: Number,
      required: true,
      min: 0,
    },
    fillerHeatmap: {
      type: [
        {
          word: { type: String, required: true, trim: true },
          count: { type: Number, required: true, min: 0 },
          severity: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
          },
        },
      ],
      default: [],
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
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    transcript: {
      type: String,
      default: "",
      trim: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    actionItems: {
      type: [String],
      default: [],
    },
    tryNextTime: {
      type: String,
      default: "",
      trim: true,
    },
    badgesEarned: {
      type: [String],
      default: [],
    },
    nextGoals: {
      type: [String],
      default: [],
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
