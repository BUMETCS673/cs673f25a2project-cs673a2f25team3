/*
  80% Human
  20% AI
*/

import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { AuthContext } from "../AuthContext";
import { API_BASE_URL } from "@env";
import { styles } from "../styles/style";

export default function Statistics() {
  const { token } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const fetchSessions = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/study/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch study sessions");
        const data = await res.json();
        setSessions(data);
        markCalendarDates(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token]);

  const markCalendarDates = (sessionsData) => {
    const marked = {};
    const todayStr = new Date().toISOString().split("T")[0];

    sessionsData.forEach((s) => {
      const dateStr = new Date(s.start_time).toISOString().split("T")[0];
      marked[dateStr] = { marked: true, dotColor: "#fff" };
    });

    if (selectedDate && !marked[selectedDate]) {
      marked[selectedDate] = { selected: true, selectedColor: "#2196F3" };
    }

    // Bold today
    if (marked[todayStr]) {
      marked[todayStr].customStyles = { text: { fontWeight: "bold" } };
    } else {
      marked[todayStr] = { customStyles: { text: { fontWeight: "bold" } } };
    }

    setMarkedDates(marked);
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    const updated = { ...markedDates };
    Object.keys(updated).forEach((key) => {
      if (updated[key].selected && key !== day.dateString) {
        updated[key] = { ...updated[key], selected: false, selectedColor: undefined };
      }
    });
    updated[day.dateString] = { ...updated[day.dateString], selected: true, selectedColor: "#2196F3" };
    setMarkedDates(updated);
  };

  const getSessionsForDate = (date) =>
    sessions.filter((s) => new Date(s.start_time).toISOString().split("T")[0] === date);

  const formatDuration = (minutes) => {
    if (!minutes) return "0m";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const getStats = () => {
    const uniqueDays = new Set(sessions.map((s) => new Date(s.start_time).toISOString().split("T")[0]));
    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    return { totalSessions: sessions.length, totalDays: uniqueDays.size, totalMinutes };
  };

  if (!token) {
    return (
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1673526759317-be71a1243e3d" }}
        style={styles.background}
        blurRadius={4}
      >
        <View style={styles.centered}>
          <Text style={styles.noSessions}>Please login to view your study history</Text>
        </View>
      </ImageBackground>
    );
  }

  if (loading) {
    return (
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1673526759317-be71a1243e3d" }}
        style={styles.background}
        blurRadius={4}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.noSessions}>Loading your study history...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1673526759317-be71a1243e3d" }}
        style={styles.background}
        blurRadius={4}
      >
        <View style={styles.centered}>
          <Text style={styles.noSessions}>Error: {error}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setLoading(true)}>
            <Text style={styles.noSessions}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  const selectedDaySessions = selectedDate ? getSessionsForDate(selectedDate) : [];
  const stats = getStats();
  const dayTotalMinutes = selectedDaySessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1673526759317-be71a1243e3d" }}
      style={styles.background}
      blurRadius={4}
    >
      <ScrollView contentContainerStyle={styles.statsContainer}>
        {/* Overall Statistics Card */}
        <View style={styles.card}>
          <Text style={styles.statsCardTitle}>Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.totalDays}</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{formatDuration(stats.totalMinutes)}</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
          </View>
        </View>

        {/* Calendar Card */}
        <View style={styles.card}>
          <Calendar
            markedDates={markedDates}
            onDayPress={onDayPress}
            style={{ backgroundColor: "transparent" }}
            theme={{
              calendarBackground: "transparent",
              todayTextColor: "#fff",
              arrowColor: "#fff",
              monthTextColor: "#fff",
              textMonthFontWeight: "bold",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              dayTextColor: "#fff",
              textDisabledColor: "rgba(255,255,255,0.3)",
              selectedDayBackgroundColor: "#555",
              selectedDayTextColor: "#fff",
              dotColor: "#fff",
            }}
            markingType="custom"
          />
        </View>

        {/* Daily Detail Card */}
        {selectedDate && (
          <View style={styles.card}>
            <Text style={styles.statsCardTitle}>
              {new Date(selectedDate).toLocaleDateString("en-US")}
            </Text>
            {selectedDaySessions.length === 0 ? (
              <Text style={styles.noSessions}>No study sessions on this day</Text>
            ) : (
              selectedDaySessions.map((s) => (
                <View key={s.id} style={styles.sessionRow}>
                  <Text style={styles.sessionText}>
                    {formatTime(s.start_time)} - {formatTime(s.end_time)}
                  </Text>
                  <Text style={styles.sessionText}>{formatDuration(s.duration)}</Text>
                </View>
              ))
            )}
            {selectedDaySessions.length > 0 && (
              <Text style={styles.dayTotal}>Total: {formatDuration(dayTotalMinutes)}</Text>
            )}
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}