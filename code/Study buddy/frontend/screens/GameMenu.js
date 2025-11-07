import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Gamepad2, Play } from 'lucide-react-native';
import { Background } from '../components/Background';

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
    <Background>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Gamepad2 color="#E67E22" size={48} strokeWidth={2.5} />
          </View>
          <Text style={styles.headerTitle}>Game Center</Text>
          <Text style={styles.motto}>
            A balance between work and rest is better for learning
          </Text>
        </View>

        {/* Game Cards */}
        <View style={styles.cardContainer}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              activeOpacity={0.85}
              style={[
                styles.cardBase, 
                selectedGame === game.id ? styles.cardSelected : styles.cardUnselected,
              ]}
              onPress={() => setSelectedGame(game.id)}
            >
              <Text style={styles.category}>{game.category}</Text>
              <Text style={styles.title}>{game.title}</Text>
              <Text
                style={[
                  styles.status,
                  selectedGame === game.id && { color: '#E67E22' },
                ]}
              >
                {selectedGame === game.id ? '▶ Selected' : 'Ready to Play'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Game Info */}
        {selected && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>{selected.title}</Text>
            <Text style={styles.infoText}>Describe: {selected.description}</Text>

            <TouchableOpacity
              style={styles.launchButton}
              onPress={() => navigation.navigate(selected.route)}
            >
              <Play color="#fff" size={18} style={{ marginRight: 6 }} />
              <Text style={styles.launchText}>Launch</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  motto: {
  fontSize: 13,
  color: '#A0601A',
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: 4,
  marginBottom: 4,
},

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    backgroundColor: '#FFF5E6',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#F5C16C',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E67E22',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  cardBase: {
    width: '48%',
    height: 110, 
    borderWidth: 2,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },
  cardUnselected: {
    backgroundColor: '#FFF5E6',
    borderColor: '#F5C16C',
  },
  cardSelected: {
    backgroundColor: '#FFE8CC',
    borderColor: '#E67E22',
    shadowColor: '#E67E22',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  category: {
    fontSize: 12,
    color: '#E67E22',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginVertical: 4,
  },
  status: {
    fontSize: 12,
    color: '#27AE60',
  },
  infoBox: {
    marginTop: 20,
    backgroundColor: '#FFF8F0',
    borderWidth: 2,
    borderColor: '#F5C16C',
    borderRadius: 12,
    padding: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E67E22',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  launchButton: {
    marginTop: 12,
    backgroundColor: '#E67E22',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  launchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
