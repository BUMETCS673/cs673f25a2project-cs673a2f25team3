/*
  90% AI
  10% Human
*/

import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../AuthContext";
import { API_BASE_URL } from "@env";
import { increaseExp } from "../dataInterface/exp";
import { changeStatus, getStatus } from "../dataInterface/status";
import { goalCompleted } from "../dataInterface/goal";

const PRESET_MINUTES = [25, 45, 60];
const TIMER_STORAGE_KEY = "@StudyTimer:state";
const MAX_MINUTES = 180;

// Format helper for HH:MM:SS countdown label inside the circular timer.
const formatDuration = (totalSeconds) => {
  const safeValue = Math.max(0, totalSeconds);
  const hours = Math.floor(safeValue / 3600);
  const minutes = Math.floor((safeValue % 3600) / 60);
  const seconds = safeValue % 60;
  return [hours, minutes, seconds]
    .map((unit) => unit.toString().padStart(2, "0"))
    .join(":");
};

export default function StudyTimerInterface() {
  const { token } = useContext(AuthContext);
  const [status, setStatus] = useState("idle"); // idle | running | paused | complete
  const [targetMinutes, setTargetMinutes] = useState(null);
  const [customMinutes, setCustomMinutes] = useState("");
  const [sessionStartISO, setSessionStartISO] = useState(null);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const [hydrated, setHydrated] = useState(false);
const progressIntervalRef = useRef(null);

const totalTargetSeconds = targetMinutes ? targetMinutes * 60 : null;
const minutesRemaining = totalTargetSeconds
  ? Math.max(totalTargetSeconds - elapsedSeconds, 0)
  : null;
const progress = totalTargetSeconds
  ? Math.min(elapsedSeconds / totalTargetSeconds, 1)
  : 0;
const circleAngle = progress * 2 * Math.PI - Math.PI / 2;
const circleDiameter = 220;
const circleRadius = circleDiameter / 2 - 12;
const markerSize = 16;
const markerOffsetX =
  circleRadius * Math.cos(circleAngle) + circleDiameter / 2 - markerSize / 2;
const markerOffsetY =
  circleRadius * Math.sin(circleAngle) + circleDiameter / 2 - markerSize / 2;

const isIdle = status === "idle";
const isRunning = status === "running";
const isPaused = status === "paused";
const isComplete = status === "complete";

const statusLabel = isComplete
  ? "Session Complete"
  : isPaused
  ? "Session Paused"
  : "Study Session Active";

const statusMessage = isComplete
  ? "Great job! Session logged successfully."
  : isPaused
  ? "Take a breath and come back when you're ready."
  : "Stay focused and keep going!";

const footerMessage = isComplete
  ? "All set - start another session when you'd like."
  : isPaused
  ? "Paused - take a breath and come back when ready."
  : "Timer is running. Your progress is saved automatically.";

  const calculateElapsedSeconds = useCallback(
    (now = Date.now()) => {
      if (status === "running" && startTimestamp) {
        const diff = Math.floor((now - startTimestamp) / 1000);
        return accumulatedSeconds + Math.max(0, diff);
      }
      return accumulatedSeconds;
    },
    [status, startTimestamp, accumulatedSeconds]
  );

  const stopProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Persist the current timer snapshot to the backend so other devices can resume later.
  const persistProgress = useCallback(
    async (statusOverride) => {
      if (!token || !targetMinutes || !sessionStartISO) return;
      try {
        const response = await fetch(`${API_BASE_URL}/study/progress`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            target_minutes: targetMinutes,
            elapsed_seconds: calculateElapsedSeconds(),
            session_start: sessionStartISO,
            status: statusOverride || status,
          }),
        });
        if (response.status === 404) return;
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error || "Failed to store progress snapshot.");
        }
      } catch (err) {
        console.log("Failed to persist study progress", err);
      }
    },
    [token, targetMinutes, sessionStartISO, status, calculateElapsedSeconds]
  );

  // Remove the remote snapshot when we intentionally abandon the session.
  const clearProgressRecord = useCallback(async () => {
    stopProgressInterval();
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/study/progress`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 404) return;
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to clear progress snapshot.");
      }
    } catch (err) {
        console.log("Failed to clear study progress", err);
    }
  }, [token, stopProgressInterval]);

  useEffect(() => {
    let cancelled = false;
    const loadState = async () => {
      try {
        const serialized = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
        if (!serialized) {
          return;
        }
        const saved = JSON.parse(serialized);
        if (cancelled) return;

        setStatus(saved.status || "idle");
        setTargetMinutes(saved.targetMinutes ?? null);
        setCustomMinutes(saved.customMinutes ?? "");
        setSessionStartISO(saved.sessionStartISO ?? null);
        setStartTimestamp(saved.startTimestamp ?? null);
        setAccumulatedSeconds(saved.accumulatedSeconds ?? 0);
      } catch (err) {
        console.log("Failed to hydrate study timer state", err);
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    loadState();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (status === "idle" || status === "complete") {
      AsyncStorage.removeItem(TIMER_STORAGE_KEY).catch((err) =>
        console.log("Failed to clear study timer state", err)
      );
      return;
    }

    const stateToPersist = {
      status,
      targetMinutes,
      customMinutes,
      sessionStartISO,
      startTimestamp,
      accumulatedSeconds,
    };

    AsyncStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(stateToPersist)).catch(
      (err) => console.log("Failed to persist study timer state", err)
    );
  }, [
    status,
    targetMinutes,
    customMinutes,
    sessionStartISO,
    startTimestamp,
    accumulatedSeconds,
    hydrated,
  ]);

  useEffect(() => {
    if (!hydrated) return;
    setElapsedSeconds(calculateElapsedSeconds());
  }, [calculateElapsedSeconds, hydrated]);

  useEffect(() => {
    if (status !== "running") {
      setElapsedSeconds(calculateElapsedSeconds());
    }
  }, [status, calculateElapsedSeconds]);

  useEffect(() => {
    if (!hydrated || !token) return;
    if (status !== "idle") return;
    if (targetMinutes) return;

    let cancelled = false;
    const loadRemoteProgress = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/study/progress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (cancelled) return;
        if (response.status === 204 || response.status === 404) return;
        if (!response.ok) throw new Error("Failed to fetch study progress");

        const data = await response.json();
        if (!data) return;

        const {
          target_minutes,
          elapsed_seconds,
          session_start,
          status: remoteStatus,
          updated_at,
        } = data;

        if (!target_minutes || !session_start || !remoteStatus) return;

        let baseElapsed = Number(elapsed_seconds) || 0;
        const updatedAt = updated_at ? Date.parse(updated_at) : null;
        if (remoteStatus === "running" && updatedAt) {
          const delta = Math.max(
            0,
            Math.floor((Date.now() - updatedAt) / 1000)
          );
          baseElapsed += delta;
        }

        setTargetMinutes(target_minutes);
        setCustomMinutes(String(target_minutes));
        setSessionStartISO(session_start);
        setAccumulatedSeconds(baseElapsed);
        setElapsedSeconds(baseElapsed);
        if (remoteStatus === "running") {
          setStartTimestamp(Date.now());
          setStatus("running");
        } else if (remoteStatus === "paused") {
          setStartTimestamp(null);
          setStatus("paused");
        } else if (remoteStatus === "complete") {
          setStartTimestamp(null);
          setStatus("complete");
        }
      } catch (err) {
        console.log("Failed to load study progress", err);
      }
    };

    loadRemoteProgress();
    return () => {
      cancelled = true;
    };
  }, [hydrated, token, status, targetMinutes]);

  useEffect(() => {
    if (!token || !hydrated) return;
    stopProgressInterval();
    if (!targetMinutes || !sessionStartISO) return;

    if (status === "running") {
      persistProgress("running");
      progressIntervalRef.current = setInterval(() => {
        persistProgress("running");
      }, 30000);
    } else if (status === "paused") {
      persistProgress("paused");
    } else if (status === "complete") {
      clearProgressRecord();
    } else if (status === "idle") {
      clearProgressRecord();
    }

    return stopProgressInterval;
  }, [
    status,
    token,
    hydrated,
    targetMinutes,
    sessionStartISO,
    persistProgress,
    clearProgressRecord,
    stopProgressInterval,
  ]);
  useEffect(() => {
    return () => {
      stopProgressInterval();
    };
  }, [stopProgressInterval]);

  const handleStartTimer = (minutes) => {
    const clamped = Math.min(MAX_MINUTES, Math.max(1, Math.round(minutes)));
    const now = Date.now();
    const startISO = new Date(now).toISOString();

    setTargetMinutes(clamped);
    setCustomMinutes(String(clamped));
    setSessionStartISO(startISO);
    setStartTimestamp(now);
    setAccumulatedSeconds(0);
    setElapsedSeconds(0);
    setStatus("running");
    setError("");
  };

  const handleCustomStart = () => {
    const parsed = parseInt(customMinutes, 10);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > MAX_MINUTES) {
      setError(`Please enter between 1 and ${MAX_MINUTES} minutes.`);
      return;
    }
    handleStartTimer(parsed);
  };

  const handlePauseResume = () => {
    if (status === "running") {
      const now = Date.now();
      const total = calculateElapsedSeconds(now);
      setAccumulatedSeconds(total);
      setStartTimestamp(null);
      setStatus("paused");
    } else if (status === "paused") {
      setStartTimestamp(Date.now());
      setStatus("running");
    }
    setError("");
  };

  const handleReset = async () => {
    setStatus("idle");
    setTargetMinutes(null);
    setCustomMinutes("");
    setSessionStartISO(null);
    setStartTimestamp(null);
    setAccumulatedSeconds(0);
    setElapsedSeconds(0);
    setError("");
    await clearProgressRecord();
  };

  const handleStop = useCallback(async () => {
    const now = Date.now();
    const totalSeconds = calculateElapsedSeconds(now);
    const endISO = new Date(now).toISOString();
    const startISO = sessionStartISO || new Date(now).toISOString();

    setAccumulatedSeconds(totalSeconds);
    setElapsedSeconds(totalSeconds);
    setStartTimestamp(null);

    if (!token) {
      setError("You must be logged in to record study sessions.");
      setStatus("paused");
      return;
    }

    const durationMinutes = Math.max(
      1,
      Math.round(
        (new Date(endISO).getTime() - new Date(startISO).getTime()) / 60000
      )
    );
    const payload = {
      duration: durationMinutes,
      start_time: startISO,
      end_time: endISO,
    };

    setIsSubmitting(true);
    setError("");
    try {
      const goalStartedFinished = await goalCompleted(token);
      const response = await fetch(`${API_BASE_URL}/study/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to record study session.");
      }

      increaseExp(payload.duration, token);
      const goalNowFinished = await goalCompleted(token);
      
      if (await getStatus(token) < 4 && 
        !goalStartedFinished &&
        goalNowFinished
      ) {
        changeStatus(1, token);
      }
      
      setStatus("complete");
      await clearProgressRecord();
    } catch (err) {
      console.log("Failed to log study session", err);
      setError(err.message || "Failed to save study session.");
      setStatus("paused");
    } finally {
      setIsSubmitting(false);
    }
  }, [calculateElapsedSeconds, sessionStartISO, token, clearProgressRecord]);

  useEffect(() => {
    if (status !== "running") return;

    const tick = () => {
      const next = calculateElapsedSeconds();
      setElapsedSeconds(next);

      if (
        totalTargetSeconds &&
        next >= totalTargetSeconds &&
        !isSubmitting
      ) {
        handleStop();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [status, calculateElapsedSeconds, totalTargetSeconds, isSubmitting, handleStop]);


  const isCustomValid = () => {
    const value = parseInt(customMinutes, 10);
    return !Number.isNaN(value) && value >= 1 && value <= MAX_MINUTES;
  };

  if (!hydrated) {
    return (
      <View style={[styles.card, styles.loadingCard]}>
        <ActivityIndicator size="large" color="#E67E22" />
        <Text style={styles.tip}>Loading timer...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {isIdle && (
        <>
          <Text style={styles.title}>Set Study Duration</Text>
          <View style={styles.presetRow}>
            {PRESET_MINUTES.map((preset) => (
              <Pressable
                key={preset}
                style={styles.presetButton}
                onPress={() => handleStartTimer(preset)}
              >
                <Text style={styles.presetButtonText}>{preset} min</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter minutes (1-180)"
            keyboardType="numeric"
            value={customMinutes}
            onChangeText={(value) => {
              setCustomMinutes(value.replace(/[^0-9]/g, ""));
              setError("");
            }}
          />

          <Pressable
            testID="startTimerButton"
            onPress={handleCustomStart}
            disabled={!isCustomValid()}
            style={[
              styles.button,
              !isCustomValid() && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>Start Study Session</Text>
          </Pressable>
          <Text style={styles.tip}>Tip: Aim for 25-60 minute focus blocks.</Text>
          <Text style={styles.tip}>Maximum session length is 180 minutes.</Text>
        </>
      )}

      {!isIdle && (
        <>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{statusLabel}</Text>
          </View>
          <Text style={styles.statusMessage}>
            {statusMessage} {isPaused ? "🧘" : isComplete ? "🎉" : "💪"}
          </Text>

          <View style={styles.circleWrapper}>
            <View style={styles.circleOuter}>
              <View style={styles.circleInner}>
                <Text testID="timerDisplay" style={styles.timer}>
                  {formatDuration(elapsedSeconds)}
                </Text>
                {minutesRemaining !== null && !isComplete ? (
                  <Text style={styles.remainingText}>
                    {Math.max(1, Math.ceil(minutesRemaining / 60))} minute
                    {Math.ceil(minutesRemaining / 60) === 1 ? "" : "s"} left
                  </Text>
                ) : (
                  <Text style={styles.remainingText}>
                    Total logged: {Math.round(elapsedSeconds / 60)} minutes
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.circleMarker,
                  { top: markerOffsetY, left: markerOffsetX },
                ]}
                testID="timerMarker"
              />
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>0 min</Text>
            <Text style={styles.progressLabel}>
              {targetMinutes ? `${targetMinutes} min` : "--"}
            </Text>
          </View>

          <View style={styles.actionsRow}>
            {(isRunning || isPaused) && (
              <Pressable
                testID="pauseResumeButton"
                onPress={handlePauseResume}
                disabled={isSubmitting}
                style={[
                  styles.primaryAction,
                  isPaused && styles.primaryPaused,
                  isSubmitting && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.primaryActionText}>
                  {isRunning ? "Pause" : "Resume"}
                </Text>
              </Pressable>
            )}

            {(isRunning || isPaused) && (
              <Pressable
                testID="stopTimerButton"
                onPress={handleStop}
                disabled={isSubmitting}
                style={[
                  styles.secondaryAction,
                  styles.stopButton,
                  isSubmitting && styles.buttonDisabled,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.stopButtonText}>Stop &amp; Log</Text>
                )}
              </Pressable>
            )}
          </View>

          {isComplete && (
            <Pressable
              onPress={handleReset}
              style={[styles.button, styles.wideButton]}
            >
              <Text style={styles.buttonText}>Start Another Session</Text>
            </Pressable>
          )}

          {!isComplete && (
            <Pressable
              onPress={handleReset}
              disabled={isSubmitting}
              style={[styles.secondaryButton, styles.wideButton]}
            >
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </Pressable>
          )}

          <View style={[styles.footerBanner, isPaused && styles.footerPaused]}>
            <Text
              style={[
                styles.footerBannerText,
                isPaused && styles.footerPausedText,
              ]}
            >
              {footerMessage}
            </Text>
          </View>
        </>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    width: "92%",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  loadingCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E67E22",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    width: "80%",
    borderWidth: 2,
    borderColor: "#F4A261",
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "#FFF",
  },
  timer: {
    fontSize: 56,
    fontWeight: "700",
    color: "#1F1F1F",
    marginBottom: 4,
    lineHeight: 64,
  },
  button: {
    backgroundColor: "#E67E22",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 12,
    shadowColor: "#E67E22",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: "#E67E22",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#E67E22",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  stopButton: {
    borderColor: "#E67E22",
  },
  stopButtonText: {
    color: "#E67E22",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  tip: {
    color: "#7A7A7A",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  errorText: {
    color: "#E63946",
    marginTop: 16,
    textAlign: "center",
  },
  presetRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 12,
  },
  presetButton: {
    backgroundColor: "#F4A261",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  presetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  wideButton: {
    alignSelf: "stretch",
  },
  statusPill: {
    backgroundColor: "#FFE8C2",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 12,
  },
  statusPillText: {
    color: "#C26A00",
    fontWeight: "600",
    fontSize: 14,
  },
  statusMessage: {
    fontSize: 16,
    color: "#5A4B41",
    textAlign: "center",
    marginBottom: 24,
  },
  circleWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  circleOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 12,
    borderColor: "#FBC490",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9F1",
    position: "relative",
  },
  circleInner: {
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    gap: 6,
  },
  circleMarker: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E67E22",
    shadowColor: "#E67E22",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  remainingText: {
    fontSize: 14,
    color: "#7A7A7A",
    textAlign: "center",
  },
  progressTrack: {
    height: 6,
    width: "100%",
    backgroundColor: "#FCE4C6",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#E67E22",
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
    marginBottom: 24,
  },
  progressLabel: {
    fontSize: 12,
    color: "#A88974",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  primaryAction: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#FF8911",
    alignItems: "center",
    shadowColor: "#FF8911",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryPaused: {
    backgroundColor: "#FF9E3D",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 18,
  },
  secondaryAction: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E67E22",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  footerBanner: {
    marginTop: 24,
    backgroundColor: "#FFF0DA",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  footerBannerText: {
    color: "#A06B37",
    fontSize: 13,
    textAlign: "center",
  },
  footerPaused: {
    backgroundColor: "#E6F1FF",
  },
  footerPausedText: {
    color: "#2B67A2",
  },
});


