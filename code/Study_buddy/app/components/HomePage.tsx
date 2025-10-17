import {
    BookOpen,
    Calendar,
    Gamepad2,
    Home,
    Settings,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Avatar */}
        <TouchableOpacity onPress={() => console.log("Avatar clicked")}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1599566147214-ce487862ea4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdCUyMGF2YXRhcnxlbnwxfHx8fDE3NjA1NjU3NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => console.log("Settings clicked")}
        >
          <Settings color="#4B5563" size={24} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        <View style={styles.iconCircle}>
          <Home color="#fff" size={48} />
        </View>
        <Text style={styles.title}>Welcome Home</Text>
        <Text style={styles.subtitle}>
          Select a tab below to get started
        </Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <View style={styles.nav}>
          <NavButton
            label="Study"
            icon={BookOpen}
            active={activeTab === "study"}
            onPress={() => setActiveTab("study")}
          />
          <NavButton
            label="Game"
            icon={Gamepad2}
            active={activeTab === "game"}
            onPress={() => setActiveTab("game")}
          />
          <NavButton
            label="Calendar"
            icon={Calendar}
            active={activeTab === "calendar"}
            onPress={() => setActiveTab("calendar")}
          />
          <NavButton
            label="Home"
            icon={Home}
            active={activeTab === "home"}
            onPress={() => setActiveTab("home")}
          />
        </View>
      </View>
    </View>
  );
}

/* 单个导航按钮组件 */
function NavButton({
  label,
  icon: Icon,
  active,
  onPress,
}: {
  label: string;
  icon: any;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.navButton,
        active ? styles.navButtonActive : styles.navButtonInactive,
      ]}
      onPress={onPress}
    >
      <Icon color={active ? "#fff" : "#6B7280"} size={24} />
      <Text style={[styles.navText, active && styles.navTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF", // 类似 from-purple-50 to-blue-50 的浅色背景
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
  },
  settingsButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(147,51,234,1)", // purple-500
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    color: "#111827",
    marginBottom: 4,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  navContainer: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 9999,
  },
  navButtonActive: {
    backgroundColor: "rgba(168,85,247,1)", // purple-400
    transform: [{ scale: 1.1 }],
  },
  navButtonInactive: {
    backgroundColor: "transparent",
  },
  navText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  navTextActive: {
    color: "#fff",
    fontWeight: "500",
  },
});
