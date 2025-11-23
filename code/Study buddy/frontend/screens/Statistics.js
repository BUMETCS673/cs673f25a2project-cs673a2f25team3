import React, { useState, useContext, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import { AuthContext } from "../AuthContext";
import { API_BASE_URL } from "@env";
import { styles } from "../styles/style";
import { Background } from "../components/Background";
import { colors, fonts } from "../styles/base";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarDays } from "lucide-react-native";
import { gameMenuStyles } from '../styles/gamesStyle';
import { useFocusEffect } from '@react-navigation/native';

export default function Statistics() {
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get("window");
  const calendarMinHeight = Math.max(320, height * 0.45);
  const { token } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  const getLocalDateString = (dateInput) => {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const formatSelectedDateForDisplay = (ymd) => {
    if (!ymd) return "";
    const [year, month, day] = ymd.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US");
  };

  const fetchSessions = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/study/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch study sessions");

      const data = await res.json();
      setSessions(data);
      markCalendarDates(data, selectedDate);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [token])
  );

  const markCalendarDates = (sessionsData, selected = selectedDate) => {
    const marked = {};
    const todayStr = getLocalDateString(new Date());

    sessionsData.forEach((s) => {
      const dateStr = getLocalDateString(s.start_time);
      marked[dateStr] = {
        ...(marked[dateStr] || {}),
        marked: true,
        dotColor: colors.primary,
      };
    });

    if (selected) {
      marked[selected] = {
        ...(marked[selected] || {}),
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: colors.pale,
      };
    }

    const todayMarked = { ...(marked[todayStr] || {}) };
    todayMarked.customStyles = {
      text: {
        fontWeight: "bold",
        color: selected === todayStr ? colors.pale : colors.primary,
      },
    };
    marked[todayStr] = todayMarked;

    setMarkedDates(marked);
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    markCalendarDates(sessions, day.dateString);
  };

  const getSessionsForDate = (date) =>
    sessions.filter((s) => getLocalDateString(s.start_time) === date);

  const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return "0m";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStats = () => {
    const uniqueDays = new Set(
      sessions.map((s) => getLocalDateString(s.start_time))
    );
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    return {
      totalSessions: sessions.length,
      totalDays: uniqueDays.size,
      totalMinutes,
    };
  };

  if (!token) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Background>
          <View style={styles.centered}>
            <Text style={styles.noSessions}>Please login to view your study history</Text>
          </View>
        </Background>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Background>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.noSessions}>Loading your study history...</Text>
          </View>
        </Background>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Background>
          <View style={styles.centered}>
            <Text style={styles.noSessions}>Error: {error}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => fetchSessions()}
            >
              <Text style={styles.noSessions}>Retry</Text>
            </TouchableOpacity>
          </View>
        </Background>
      </SafeAreaView>
    );
  }

  const stats = getStats();
  const selectedDaySessions = selectedDate ? getSessionsForDate(selectedDate) : [];
  const dayTotalMinutes = selectedDaySessions.reduce(
    (sum, s) => sum + (s.duration || 0),
    0
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.secondary, // match Background color so the inset area blends in
      }}
      edges={["top", "bottom"]}
    >
      <Background>
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={[
            styles.statsContainer,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 16,
              minHeight: height - insets.top - insets.bottom,
            },
          ]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
        >

          <View style={gameMenuStyles.header}>
            <View style={gameMenuStyles.iconWrapper}>
              <CalendarDays color={colors.primary} size={48} strokeWidth={2.5} />
            </View>
            <Text style={gameMenuStyles.headerTitle}>Calendar</Text>
            <Text style={gameMenuStyles.motto}>
              Every study day matters — keep track of your progress
            </Text>
          </View>

          <View style={[styles.card, styles.statsCardSpacing]}>
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
                <Text style={styles.statNumber}>
                  {formatDuration(stats.totalMinutes)}
                </Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, styles.statsCardSpacing]}>
            <Calendar
              markedDates={markedDates}
              onDayPress={onDayPress}
              style={{
                backgroundColor: "transparent",
                minHeight: calendarMinHeight,
                width: "100%",
              }}
              markingType="custom"
              theme={{
                calendarBackground: "transparent",
                monthTextColor: colors.primary,
                textMonthFontSize: fonts.lg,
                textMonthFontWeight: "bold",
                dayTextColor: colors.text,
                textDayFontSize: fonts.md,
                textDisabledColor: "rgba(0,0,0,0.2)",
                todayTextColor: colors.primary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.pale,
                dotColor: colors.primary,
                selectedDotColor: colors.pale,
                arrowColor: colors.primary,
              }}
            />
          </View>

          {selectedDate && (
            <View style={[styles.card, styles.statsCardSpacing]}>
              <Text style={styles.statsCardTitle}>
                {formatSelectedDateForDisplay(selectedDate)}
              </Text>
              {selectedDaySessions.length === 0 ? (
                <Text style={styles.noSessions}>No study sessions on this day</Text>
              ) : (
                selectedDaySessions.map((s) => (
                  <View key={s.id} style={styles.sessionRow}>
                    <Text style={styles.sessionText}>
                      {formatTime(s.start_time)} - {formatTime(s.end_time)}
                    </Text>
                    <Text style={styles.sessionText}>
                      {formatDuration(s.duration)}
                    </Text>
                  </View>
                ))
              )}
              {selectedDaySessions.length > 0 && (
                <Text style={styles.dayTotal}>
                  Total: {formatDuration(dayTotalMinutes)}
                </Text>
              )}
            </View>
          )}

        </ScrollView>
      </Background>
    </SafeAreaView>
  );
}
