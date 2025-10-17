import {
    BookOpen,
    CheckCircle2,
    Pause,
    Play,
    RotateCcw,
    Timer
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type TimerPhase = "select" | "countdown" | "complete";

export default function StudyTimerInterface() {
  const [phase, setPhase] = useState<TimerPhase>("select");
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");

  // 倒计时逻辑
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setPhase("complete");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds]);

  const handleStartTimer = (minutes: number) => {
    setSelectedMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setPhase("countdown");
    setIsRunning(true);
  };

  const handleCustomStart = () => {
    const minutes = parseInt(customMinutes);
    if (minutes > 0 && minutes <= 180) {
      handleStartTimer(minutes);
    }
  };

  const handlePauseResume = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setPhase("select");
    setRemainingSeconds(0);
    setSelectedMinutes(0);
    setCustomMinutes("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 选择时间阶段
  if (phase === "select") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <BookOpen color="#fff" size={48} />
          </View>
          <Text style={styles.title}>Study Time</Text>
          <Text style={styles.subtitle}>
            How long would you like to study today?
          </Text>
        </View>

        <View style={styles.card}>
          <Timer color="#ea580c" size={32} style={{ alignSelf: "center" }} />
          <Text style={styles.cardTitle}>Set Your Timer</Text>
          <Text style={styles.cardSubtitle}>
            Choose your study duration (minutes)
          </Text>

          <TextInput
            keyboardType="numeric"
            placeholder="Enter minutes"
            placeholderTextColor="#aaa"
            value={customMinutes}
            onChangeText={setCustomMinutes}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={handleCustomStart}
            disabled={
              !customMinutes ||
              parseInt(customMinutes) <= 0 ||
              parseInt(customMinutes) > 180
            }
            style={[
              styles.startButton,
              (!customMinutes ||
                parseInt(customMinutes) <= 0 ||
                parseInt(customMinutes) > 180) && { opacity: 0.5 },
            ]}
          >
            <Play color="#fff" size={20} />
            <Text style={styles.startButtonText}>Start Study Session</Text>
          </TouchableOpacity>

          <Text style={styles.tip}>💡 Recommended: 25–60 minutes</Text>
          <Text style={styles.tipSecondary}>Maximum: 180 minutes</Text>
        </View>
      </View>
    );
  }

  // 倒计时阶段
  if (phase === "countdown") {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sessionText}>Study Session Active</Text>
          <Text style={styles.sessionSubtext}>Stay focused! 💪</Text>

          <Text style={styles.timeText}>{formatTime(remainingSeconds)}</Text>
          <Text style={styles.timeSub}>
            {Math.ceil(remainingSeconds / 60)} minutes left
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handlePauseResume}
              style={styles.primaryButton}
            >
              {isRunning ? (
                <>
                  <Pause color="#fff" size={20} />
                  <Text style={styles.primaryButtonText}>Pause</Text>
                </>
              ) : (
                <>
                  <Play color="#fff" size={20} />
                  <Text style={styles.primaryButtonText}>Resume</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleReset} style={styles.secondaryButton}>
              <RotateCcw color="#ea580c" size={20} />
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {!isRunning && (
            <Text style={styles.pausedText}>⏸️ Paused - Take a break</Text>
          )}
        </View>
      </View>
    );
  }

  // 完成阶段
  if (phase === "complete") {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: "#22c55e" }]}>
            <CheckCircle2 color="#fff" size={48} />
          </View>

          <Text style={styles.title}>Congratulations! 🎉</Text>
          <Text style={styles.subtitle}>
            You studied {selectedMinutes} minutes!
          </Text>

          <TouchableOpacity onPress={handleReset} style={styles.primaryButton}>
            <Play color="#fff" size={20} />
            <Text style={styles.primaryButtonText}>Start Another Session</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleReset} style={styles.secondaryButton}>
            <RotateCcw color="#ea580c" size={20} />
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f59e0b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    padding: 24,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginVertical: 8,
  },
  cardSubtitle: {
    color: "#777",
    textAlign: "center",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginBottom: 16,
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#f59e0b",
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  tip: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },
  tipSecondary: {
    fontSize: 11,
    color: "#aaa",
    textAlign: "center",
  },
  timeText: {
    fontSize: 56,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginVertical: 16,
  },
  timeSub: {
    textAlign: "center",
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 16,
  },
  primaryButton: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#f59e0b",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  secondaryButton: {
    flexDirection: "row",
    padding: 12,
    borderWidth: 2,
    borderColor: "#fbbf24",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  secondaryButtonText: {
    color: "#ea580c",
    fontWeight: "600",
  },
  pausedText: {
    textAlign: "center",
    marginTop: 16,
    color: "#666",
  },
  sessionText: {
    fontSize: 18,
    color: "#ea580c",
    textAlign: "center",
  },
  sessionSubtext: {
    fontSize: 13,
    textAlign: "center",
    color: "#666",
    marginBottom: 12,
  },
});
