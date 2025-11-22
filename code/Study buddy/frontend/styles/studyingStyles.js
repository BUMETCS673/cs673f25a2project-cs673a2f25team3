/*
  50% AI
  50% Human
*/

import { Dimensions, StyleSheet } from "react-native";
import {
  CIRCLE_BORDER_WIDTH,
  CIRCLE_DIAMETER,
  CIRCLE_MARKER_SIZE,
} from "../components/studyTimerConstants";

// Simple responsive font scaling to adapt typography to screen size.
const { width, height } = Dimensions.get("window");
const scale = Math.min(width / 375, height / 812);
const scaleFont = (size) =>
  Math.round(Math.max(size * 0.85, Math.min(size * 1.25, size * scale)));

// Timer geometry pulled from shared constants so math stays in sync.
const circleOuterSize = CIRCLE_DIAMETER;
const circleOuterRadius = circleOuterSize / 2;
const circleInnerSize = CIRCLE_DIAMETER - CIRCLE_BORDER_WIDTH * 2 - 16;

export const studyingStyles = StyleSheet.create({
  iconSpacing: {
    marginRight: 6,
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  scrollContent: {
    flexGrow: 1,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: scaleFont(24),
    fontWeight: "700",
    color: "#E67E22",
  },

  motto: {
    fontSize: scaleFont(13),
    color: "#A0601A",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
  },

  infoBox: {
    backgroundColor: "#FFF8F0",
    borderWidth: 2,
    borderColor: "#F5C16C",
    borderRadius: 12,
    padding: 18,
  },

  infoText: {
    fontSize: scaleFont(15),
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },

  timerWrapper: {
    alignItems: "center",
    marginVertical: 10,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#E67E22",
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: scaleFont(16),
    fontWeight: "600",
  },
});

// Styles for the Study Timer card and controls (shared across screens).
export const studyTimerStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    width: "92%",
    padding: 20,
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
    fontSize: scaleFont(18),
    fontWeight: "600",
    color: "#E67E22",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    width: "80%",
    borderWidth: 2,
    borderColor: "#F4A261",
    borderRadius: 12,
    padding: 12,
    fontSize: scaleFont(16),
    textAlign: "center",
    marginBottom: 16,
    backgroundColor: "#FFF",
  },
  timer: {
    fontSize: scaleFont(22),
    fontWeight: "700",
    color: "#1F1F1F",
    marginBottom: 4,
    lineHeight: scaleFont(26),
  },
  button: {
    backgroundColor: "#E67E22",
    paddingVertical: 12,
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
    fontSize: scaleFont(18),
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: "#E67E22",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#E67E22",
    fontSize: scaleFont(16),
    fontWeight: "500",
    textAlign: "center",
  },
  stopButton: {
    borderColor: "#E67E22",
  },
  stopButtonText: {
    color: "#E67E22",
    fontSize: scaleFont(16),
    fontWeight: "600",
    textAlign: "center",
  },
  tip: {
    color: "#7A7A7A",
    fontSize: scaleFont(14),
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
    marginBottom: 12,
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
    fontSize: scaleFont(16),
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
    fontSize: scaleFont(14),
  },
  statusMessage: {
    fontSize: scaleFont(16),
    color: "#5A4B41",
    textAlign: "center",
    marginBottom: 16,
  },
  circleWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  circleOuter: {
    width: circleOuterSize,
    height: circleOuterSize,
    borderRadius: circleOuterRadius,
    borderWidth: CIRCLE_BORDER_WIDTH,
    borderColor: "#FBC490",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9F1",
    position: "relative",
  },
  circleInner: {
    width: circleInnerSize,
    height: circleInnerSize,
    borderRadius: circleInnerSize / 2,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    gap: 6,
  },
  circleMarker: {
    position: "absolute",
    width: CIRCLE_MARKER_SIZE,
    height: CIRCLE_MARKER_SIZE,
    borderRadius: CIRCLE_MARKER_SIZE / 2,
    backgroundColor: "#E67E22",
    shadowColor: "#E67E22",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  remainingText: {
    fontSize: scaleFont(14),
    color: "#7A7A7A",
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
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
    fontSize: scaleFont(18),
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
    fontSize: scaleFont(13),
    textAlign: "center",
  },
  footerPaused: {
    backgroundColor: "#E6F1FF",
  },
  footerPausedText: {
    color: "#2B67A2",
  },
});
