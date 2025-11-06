import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function Background({ children }) {
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1600636210649-8dce6a35173a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwYWJzdHJhY3QlMjBwYXN0ZWwlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2MjMzMjEyNXww&ixlib=rb-4.1.0&q=80&w=1080',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['#FFEDD5E6', '#FEF3C7E6', '#FFF7ED']}
        style={styles.overlay}
      />

      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
});
