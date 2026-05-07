"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  LiveKitRoom,
  PreJoin,
  RoomAudioRenderer,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import {
  ArrowLeft,
  Loader2,
  LogOut,
  Maximize2,
  Minimize2,
  PanelBottomClose,
  PictureInPicture2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./MeetingRoom.module.css";

type UserChoices = {
  videoEnabled: boolean;
  audioEnabled: boolean;
  videoDeviceId: string;
  audioDeviceId: string;
  username: string;
};

interface MeetingRoomProps {
  meetingId: string;
  meetingTitle: string;
  meetingTopic: string;
  communityName: string;
  communityId: string;
  scheduledAtIso: string;
  userName: string;
}

function getErrorName(error: unknown) {
  if (error instanceof DOMException) return error.name;
  if (error instanceof Error) return error.name || error.message;
  return "UnknownError";
}

function isMediaPermissionError(errorName: string) {
  return errorName === "NotAllowedError" || errorName === "PermissionDeniedError";
}

function buildAudioOptions(choices: UserChoices) {
  if (!choices.audioEnabled) return false;
  return {
    deviceId: choices.audioDeviceId || undefined,
    echoCancellation: true,
    noiseSuppression: true,
  };
}

function buildVideoOptions(choices: UserChoices) {
  if (!choices.videoEnabled) return false;
  return {
    deviceId: choices.videoDeviceId || undefined,
  };
}

export default function MeetingRoom({
  meetingId,
  meetingTitle,
  meetingTopic,
  communityName,
  communityId,
  scheduledAtIso,
  userName,
}: MeetingRoomProps) {
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [token, setToken] = useState("");
  const [choices, setChoices] = useState<UserChoices | null>(null);
  const [error, setError] = useState("");
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [mediaError, setMediaError] = useState("");
  const [lkError, setLkError] = useState("");
  const [pipError, setPipError] = useState("");
  const [joining, setJoining] = useState(false);
  const [connected, setConnected] = useState(false);
  const [leftMeeting, setLeftMeeting] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const scheduledAt = useMemo(() => new Date(scheduledAtIso), [scheduledAtIso]);
  const scheduledText = useMemo(
    () =>
      scheduledAt.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [scheduledAt]
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(document.fullscreenElement === shellRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleJoin = async (values: UserChoices) => {
    setJoining(true);
    setError("");
    setStatusCode(null);
    setMediaError("");
    setLkError("");

    try {
      const resp = await fetch(`/api/livekit/token?meetingId=${meetingId}`, {
        cache: "no-store",
      });
      const data = (await resp.json()) as { token?: string; error?: string };

      if (!resp.ok || !data.token) {
        setStatusCode(resp.status);
        setError(data.error || "Failed to prepare the meeting");
        return;
      }

      setChoices(values);
      setToken(data.token);
    } catch (e) {
      setStatusCode(null);
      setError("Error connecting to the meeting");
      console.error(e);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = () => {
    setLeftMeeting(true);
    setMinimized(false);
    setToken("");
    setChoices(null);
    router.replace(`/community/${communityId}`);
  };

  const toggleFullscreen = async () => {
    if (!shellRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await shellRef.current.requestFullscreen();
      }
    } catch (e) {
      console.error("Fullscreen request failed:", e);
    }
  };

  const requestPip = async () => {
    setPipError("");

    try {
      if (!document.pictureInPictureEnabled) {
        setPipError("Picture-in-picture is not available in this browser.");
        return;
      }

      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return;
      }

      const videos = Array.from(
        shellRef.current?.querySelectorAll("video") || []
      );
      const video =
        videos.find((item) => item.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) ||
        videos[0];

      if (!video) {
        setPipError("PiP will be available once a video tile is visible.");
        return;
      }

      await video.requestPictureInPicture();
    } catch (e) {
      setPipError("Unable to start picture-in-picture for this video.");
      console.error(e);
    }
  };

  const renderAccessMessage = (
    title: string,
    message: string,
    danger = true,
    extra?: ReactNode
  ) => (
    <div className={styles.centerScreen}>
      <div className={styles.messagePanel}>
        <h2 className={danger ? styles.dangerTitle : styles.messageTitle}>{title}</h2>
        <p className={styles.messageText}>{message}</p>
        {extra}
        <div className={styles.messageActions}>
          <Link href={`/community/${communityId}`} className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to Community
          </Link>
          <Link href="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );

  if (leftMeeting) {
    return renderAccessMessage(
      "You left the meeting",
      "Your audio and video are disconnected. Return to the community when you are ready.",
      false
    );
  }

  if (error) {
    const isNotStartedYet =
      statusCode === 403 &&
      (error.toLowerCase().includes("not started") ||
        error.toLowerCase().includes("has not started"));

    return renderAccessMessage(
      isNotStartedYet ? "Meeting has not started yet" : "Connection error",
      error,
      true,
      isNotStartedYet ? (
        <p className={styles.helperText}>
          Scheduled for <strong>{scheduledAt.toLocaleString()}</strong>. Come back
          closer to the start time.
        </p>
      ) : (
        <p className={styles.helperText}>
          If this mentions LiveKit credentials, ask the administrator to configure
          LIVEKIT_API_KEY and LIVEKIT_API_SECRET.
        </p>
      )
    );
  }

  if (mediaError) {
    const isDenied = isMediaPermissionError(mediaError);
    const isNoDevice =
      mediaError === "NotFoundError" || mediaError === "DevicesNotFoundError";

    return renderAccessMessage(
      isDenied ? "Camera and microphone permission needed" : "Audio/video setup error",
      isDenied
        ? "Allow browser access to your camera and microphone, then try joining again."
        : isNoDevice
          ? "No camera or microphone was found. Connect a device and try again."
          : `Unable to access media devices (${mediaError}). Try again after checking your device settings.`
    );
  }

  if (lkError) {
    const isDenied = isMediaPermissionError(lkError);

    return renderAccessMessage(
      isDenied ? "Camera and microphone permission needed" : "Meeting connection error",
      isDenied
        ? "The browser blocked access to your camera or microphone. Allow permissions and refresh to join."
        : `Live meeting error (${lkError}). Refresh and try again.`
    );
  }

  if (!token || !choices) {
    return (
      <div className={styles.previewShell}>
        <div className={styles.previewHeader}>
          <Link href={`/community/${communityId}`} className={styles.backLink}>
            <ArrowLeft size={16} />
            Community
          </Link>
          <div className={styles.previewMeta}>
            <span>{communityName}</span>
            <span>{scheduledText}</span>
          </div>
        </div>

        <main className={styles.previewGrid}>
          <section className={styles.previewCopy}>
            <span className={styles.kicker}>Ready room</span>
            <h1>{meetingTitle}</h1>
            <p>
              Check your camera, microphone, and device selection before entering.
              You will only be marked as attending after you click Join.
            </p>
            <div className={styles.topicRow}>
              <span>{meetingTopic || "Open discussion"}</span>
              <span>{communityName}</span>
            </div>
          </section>

          <section className={styles.prejoinCard} data-lk-theme="default">
            <PreJoin
              defaults={{
                username: userName,
                audioEnabled: true,
                videoEnabled: true,
              }}
              joinLabel={joining ? "Joining..." : "Join meeting"}
              micLabel="Microphone"
              camLabel="Camera"
              userLabel="Display name"
              persistUserChoices
              onValidate={(values) => values.username.trim().length > 0}
              onSubmit={handleJoin}
              onError={(e) => setMediaError(getErrorName(e))}
            />
            {joining && (
              <div className={styles.joiningOverlay}>
                <Loader2 size={24} className="animate-spin" />
                <span>Preparing your seat...</span>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={`${styles.meetingShell} ${minimized ? styles.minimized : ""}`}
      data-lk-theme="default"
    >
      <div className={styles.meetingHeader}>
        <div className={styles.meetingTitleBlock}>
          <h2>{meetingTitle}</h2>
          <div>
            <span>{communityName}</span>
            {meetingTopic && <span>{meetingTopic}</span>}
            <span>{connected ? "Live" : "Connecting"}</span>
          </div>
        </div>

        <div className={styles.meetingActions}>
          {pipError && <span className={styles.inlineError}>{pipError}</span>}
          {minimized ? (
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => setMinimized(false)}
              title="Restore meeting"
              aria-label="Restore meeting"
            >
              <Maximize2 size={16} />
            </button>
          ) : (
            <>
              <button
                type="button"
                className={styles.iconButton}
                onClick={requestPip}
                title="Picture in picture"
                aria-label="Picture in picture"
              >
                <PictureInPicture2 size={16} />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={toggleFullscreen}
                title={fullscreen ? "Exit full screen" : "Full screen"}
                aria-label={fullscreen ? "Exit full screen" : "Full screen"}
              >
                {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setMinimized(true)}
                title="Minimize meeting"
                aria-label="Minimize meeting"
              >
                <PanelBottomClose size={16} />
              </button>
            </>
          )}
          <button
            type="button"
            className={styles.leaveButton}
            onClick={handleLeave}
            title="Leave meeting"
          >
            <LogOut size={16} />
            Leave
          </button>
        </div>
      </div>

      <div className={styles.roomStage}>
        <LiveKitRoom
          video={buildVideoOptions(choices)}
          audio={buildAudioOptions(choices)}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          onConnected={() => setConnected(true)}
          onDisconnected={() => {
            setConnected(false);
            setLeftMeeting(true);
            setMinimized(false);
            setToken("");
            setChoices(null);
          }}
          onError={(e) => setLkError(getErrorName(e))}
          onMediaDeviceFailure={(failure, kind) => {
            setMediaError(failure || kind || "MediaDeviceError");
          }}
          style={{ height: "100%", width: "100%" }}
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </div>
  );
}
