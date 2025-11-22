/*
  70% AI
  30% Human
*/

import React from "react";
import { View, Text, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useStudyTimer } from "./useStudyTimer";
import { formatDuration, MAX_MINUTES, PRESET_MINUTES } from "./studyTimerConstants";
import { studyTimerStyles as styles } from "../styles/studyingStyles";

// UI wrapper that delegates all timer logic to the useStudyTimer hook.
export default function StudyTimerInterface() {
  const {
    isIdle,
    isRunning,
    isPaused,
    isComplete,
    statusLabel,
    statusMessage,
    footerMessage,
    targetMinutes,
    customMinutes,
    setCustomMinutes,
    minutesRemaining,
    progress,
    markerOffsetX,
    markerOffsetY,
    elapsedSeconds,
    timerDisplaySeconds,
    error,
    hydrated,
    isSubmitting,
    handleStartTimer,
    handleCustomStart,
    handlePauseResume,
    handleReset,
    handleStop,
    isCustomValid,
    clearError,
  } = useStudyTimer();

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
            placeholder={`Enter minutes (1-${MAX_MINUTES})`}
            keyboardType="numeric"
            value={customMinutes}
            onChangeText={(value) => {
              setCustomMinutes(value.replace(/[^0-9]/g, ""));
              clearError();
            }}
          />

          <Pressable
            testID="startTimerButton"
            onPress={handleCustomStart}
            disabled={!isCustomValid()}
            style={[styles.button, !isCustomValid() && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Start Study Session</Text>
          </Pressable>
          <Text style={styles.tip}>Tip: Aim for 25-60 minute focus blocks.</Text>
          <Text style={styles.tip}>Maximum session length is {MAX_MINUTES} minutes.</Text>
        </>
      )}

      {!isIdle && (
        <>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{statusLabel}</Text>
          </View>
          <Text style={styles.statusMessage}>
            {statusMessage}
          </Text>

          <View style={styles.circleWrapper}>
            <View style={styles.circleOuter}>
              <View style={styles.circleInner}>
                <Text testID="timerDisplay" style={styles.timer}>
                  {formatDuration(timerDisplaySeconds)}
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
