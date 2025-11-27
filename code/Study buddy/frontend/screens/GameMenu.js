/*
  50% framework
  50% manual (with game-time restriction logic)
*/

import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Gamepad2, Play } from "lucide-react-native";
import { AuthContext } from "../AuthContext";
import { gameMenuStyles } from "../styles/gamesStyle";
import { colors } from "../styles/base";

export default function GameMenu({ navigation }) {
  const [selectedGame, setSelectedGame] = useState(1);
  const { gameTimeRemaining } = useContext(AuthContext);

  // Convert seconds → minutes
  const allowedMinutes = Math.floor(gameTimeRemaining / 60);

  const games = [
    {
      id: 1,
      title: "Game 1",
      category: "Action",
      route: "Game1",
      description:
        "You will control the block and jump over as many platforms as possible.",
    },
    {
      id: 2,
      title: "Game 2",
      category: "Racing",
      route: "Game2",
      description:
        "You will control the ball and try your best to prevent the pillar from growing.",
    },
    {
      id: 3,
      title: "Game 3",
      category: "Strategy",
      route: "Game3",
      description: "Try to prevent outside balls from hitting your ball.",
    },
  ];

  const selected = games.find((g) => g.id === selectedGame);

  // Whether the user can launch any game
  const canPlay = allowedMinutes > 0;

  const handleLaunch = () => {
    if (!canPlay) return; // just extra protection
    navigation.navigate(selected.route);
  };

  return (
    <View style={gameMenuStyles.background}>
      <View style={gameMenuStyles.container}>
        {/* Header */}
        <View style={gameMenuStyles.header}>
          <View style={gameMenuStyles.iconWrapper}>
            <Gamepad2 color={colors.primary} size={48} strokeWidth={2.5} />
          </View>
          <Text style={gameMenuStyles.headerTitle}>Game Center</Text>
          <Text style={gameMenuStyles.motto}>
            A balance between work and rest is better for learning
          </Text>

          {/* Game time remaining */}
          <Text style={{ marginTop: 10, fontSize: 16, color: "#333" }}>
            {canPlay
              ? `You can play for ${allowedMinutes} minute${
                  allowedMinutes === 1 ? "" : "s"
                }`
              : "Please complete a study session to unlock game time"}
          </Text>
        </View>

        {/* Game Cards */}
        <View style={gameMenuStyles.cardContainer}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              activeOpacity={0.85}
              style={[
                gameMenuStyles.cardBase,
                selectedGame === game.id
                  ? gameMenuStyles.cardSelected
                  : gameMenuStyles.cardUnselected,
              ]}
              onPress={() => setSelectedGame(game.id)}
            >
              <Text style={gameMenuStyles.category}>{game.category}</Text>
              <Text style={gameMenuStyles.title}>{game.title}</Text>
              <Text
                style={[
                  gameMenuStyles.status,
                  selectedGame === game.id && { color: colors.primary },
                ]}
              >
                {selectedGame === game.id ? "▶ Selected" : "Ready"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Game Info */}
        {selected && (
          <View style={gameMenuStyles.infoBox}>
            <Text style={gameMenuStyles.infoTitle}>{selected.title}</Text>
            <Text style={gameMenuStyles.infoText}>
              Describe: {selected.description}
            </Text>

            <TouchableOpacity
              style={[
                gameMenuStyles.launchButton,
                !canPlay && { backgroundColor: "#ccc" },
              ]}
              disabled={!canPlay}
              onPress={handleLaunch}
            >
              <Play
                color={canPlay ? colors.pale : "#666"}
                size={18}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  gameMenuStyles.launchText,
                  !canPlay && { color: "#444" },
                ]}
              >
                {canPlay ? "Launch" : "Locked"}
              </Text>
            </TouchableOpacity>

            {!canPlay && (
              <Text style={{ marginTop: 8, color: "#cc4444", fontSize: 14 }}>
                You need to study 25 or 60 minutes before playing.
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
