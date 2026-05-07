import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeedItem extends Document {
  _id: Types.ObjectId;
  communityId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  type: "join" | "meeting_scheduled" | "meeting_completed" | "goal_completed" | "announcement";
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const FeedSchema = new Schema<IFeedItem>(
  {
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["join", "meeting_scheduled", "meeting_completed", "goal_completed", "announcement"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Auto-expire feed items after 14 days to keep it fresh
FeedSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 14 });

const FeedItem =
  mongoose.models.FeedItem ||
  mongoose.model<IFeedItem>("FeedItem", FeedSchema);

export default FeedItem;
