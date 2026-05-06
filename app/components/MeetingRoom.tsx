"use client";

import { useState, useEffect } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MeetingRoomProps {
  meetingId: string;
  meetingTitle: string;
  meetingTopic: string;
  communityName: string;
  userName: string;
}

export default function MeetingRoom({
  meetingId,
  meetingTitle,
  meetingTopic,
  communityName,
  userName,
}: MeetingRoomProps) {
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/livekit/token?meetingId=${meetingId}`);
        const data = await resp.json();
        
        if (!resp.ok) {
          setError(data.error || "Failed to fetch token");
          return;
        }

        setToken(data.token);
      } catch (e) {
        setError("Error connecting to the meeting");
        console.error(e);
      }
    })();
  }, [meetingId]);

  if (error) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 100 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: "var(--danger)" }}>
          Connection Error
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{error}</p>
        <p style={{ color: "var(--text-muted)", fontSize: 13, maxWidth: 400, margin: "0 auto 24px" }}>
          If you are seeing "LiveKit credentials not configured", please ask the administrator to add LIVEKIT_API_KEY and LIVEKIT_API_SECRET to the environment variables.
        </p>
        <Link href="/dashboard" className="btn btn-primary">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (token === "") {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent)" }} />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Connecting to meeting...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0a",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid #1f1f1f",
          background: "#0f0f0f",
        }}
      >
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>{meetingTitle}</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            <span>{communityName}</span>
            {meetingTopic && (
              <>
                <span>•</span>
                <span style={{ color: "var(--accent)" }}>{meetingTopic}</span>
              </>
            )}
          </div>
        </div>
        <Link href="/dashboard" className="btn btn-secondary btn-sm">
          Leave
        </Link>
      </div>

      {/* LiveKit Room */}
      <div style={{ flex: 1, minHeight: 0 }} data-lk-theme="default">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          // Use the default LiveKit theme, which provides the full Google Meet style UI:
          // Grid, Video/Audio controls, Screen Share, Chat, Participant List
          data-lk-theme="default"
          style={{ height: "100%", width: "100%" }}
        >
          {/* Your custom component with basic video conferencing functionality. */}
          <VideoConference />
          {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </div>
  );
}
