/*
  70% AI
  30% Human
*/

// Shared constants and helpers for the Study Timer UI.

export const PRESET_MINUTES = [25, 60];
export const TIMER_STORAGE_KEY = "@StudyTimer:state";
export const MAX_MINUTES = 180;
export const CIRCLE_DIAMETER = 200;
export const CIRCLE_BORDER_WIDTH = 10;
export const CIRCLE_MARKER_SIZE = 12;

// Format helper for HH:MM:SS countdown label inside the circular timer.
export const formatDuration = (totalSeconds) => {
  const safeValue = Math.max(0, totalSeconds);
  const hours = Math.floor(safeValue / 3600);
  const minutes = Math.floor((safeValue % 3600) / 60);
  const seconds = safeValue % 60;
  return [hours, minutes, seconds]
    .map((unit) => unit.toString().padStart(2, "0"))
    .join(":");
};
