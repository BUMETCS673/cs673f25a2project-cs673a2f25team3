import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Gamepad2, Play } from 'lucide-react-native';
import { Background } from '../components/Background';
import { colors } from '../styles/base';
import { gameMenuStyles } from '../styles/gamesStyle';

/*
  50% framework
  50% manual
*/

export default function GameMenu({ navigation }) {
  const [selectedGame, setSelectedGame] = useState(1);


  const games = [
    {
      id: 1,
      title: 'Game 1',
      category: 'Action',
      route: 'Game1',
      description:
        'You will control the block and jump over as many platforms as possible.',
    },
    {
      id: 2,
      title: 'Game 2',
      category: 'Racing',
      route: 'Game2',
      description:
        'You will control the ball and try your best to prevent the pillar from growing.',
    },
    {
      id: 3,
      title: 'Game 3',
      category: 'Strategy',
      route: 'Game3',
      description:
        'Try to prevent outside balls from hitting your ball.',
    },
  ];

  const selected = games.find((g) => g.id === selectedGame);

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
        </View>

        {/* Game Cards */}
        <View style={gameMenuStyles.cardContainer}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              activeOpacity={0.85}
              style={[
                gameMenuStyles.cardBase, 
                selectedGame === game.id ? gameMenuStyles.cardSelected : gameMenuStyles.cardUnselected,
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
                {selectedGame === game.id ? '▶ Selected' : 'Ready to Play'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Game Info */}
        {selected && (
          <View style={gameMenuStyles.infoBox}>
            <Text style={gameMenuStyles.infoTitle}>{selected.title}</Text>
            <Text style={gameMenuStyles.infoText}>Describe: {selected.description}</Text>

            <TouchableOpacity
              style={gameMenuStyles.launchButton}
              onPress={() => navigation.navigate(selected.route)}
            >
              <Play color={colors.pale} size={18} style={{ marginRight: 6 }} />
              <Text style={gameMenuStyles.launchText}>Launch</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
