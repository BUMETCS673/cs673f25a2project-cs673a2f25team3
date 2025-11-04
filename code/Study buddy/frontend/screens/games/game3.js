/*******************************************************************************
 * File: game3.js
 * Author: Qiuting Zhao
 * arcfire game
 * For the logic part, 75% human-written, 25% AI-assisted (for rendering part)
 * The stylesheet structure is mostly AI(Self-generated), but values and parameters are human-tuned
********************************************************************************/

import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Background } from "../../components/Background";

const { width: W, height: H } = Dimensions.get("window");

// CONSTANTS
const PLAYER_SIZE = 25;
const ENEMY_SIZE = 14;
const ENEMY_SPEED = 1;
const DIRECTION_SPAN = Math.PI / 12; // ±15°
const FPS = 60;
const MIN_DELAY = 2 * FPS; // 2s between waves
const MAX_DELAY = 4 * FPS; // 4s between waves
const MIN_ENEMIES = 1;
const MAX_ENEMIES = 12;
const MIN_ENEMY_INTERVAL = 0.1 * FPS; // 0.1s between enemies
const MAX_ENEMY_INTERVAL = 0.4 * FPS; // 0.4s between enemies
const ROTATION_SPEED = 0.07;
const BASE_RADIUS = 50;
const MAX_RADIUS = 270;
const MIN_RADIUS = 90;
const ARC_LIMIT = (150 * Math.PI) / 180; // 150° attack limit
const FRAME_INTERVAL = 1000 / FPS;

export default function Game3() {
  const [frameW, setFrameW] = useState(Math.min(W, H) - 80);
  const [frameH, setFrameH] = useState(Math.min(W, H) - 80);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [, forceRender] = useState(0);

  // Refs for game state
  const ticks = useRef(0);
  const enemies = useRef([]);
  const waveAngle = useRef(Math.random() * Math.PI * 2);
  const nextWaveTick = useRef(0);
  const nextEnemyTick = useRef(0);
  const spawning = useRef(false);
  const enemiesSpawned = useRef(0);
  const enemiesTarget = useRef(0);

  // Player + aim state
  const aimAngle = useRef(0);
  const lockedAngle = useRef(null);
  const holding = useRef(false);
  const arcVisible = useRef(false);
  const currentLength = useRef(BASE_RADIUS);

  // Main Game Loop
  useEffect(() => {
    const timer = setInterval(() => {
      if (over) return;
      ticks.current++;
      const now = ticks.current;

      // Continuous rotation
      aimAngle.current += ROTATION_SPEED;
      if (aimAngle.current > Math.PI * 2) aimAngle.current -= Math.PI * 2;

      // Handle holding arc
      if (holding.current && lockedAngle.current !== null) {
        let diff = Math.abs(aimAngle.current - lockedAngle.current);
        if (diff > Math.PI) diff = 2 * Math.PI - diff;

        if (diff >= ARC_LIMIT) {
          triggerAttack(); // auto release
        } else {
          const ratio = diff / ARC_LIMIT;
          currentLength.current =
            MAX_RADIUS - (MAX_RADIUS - MIN_RADIUS) * ratio;
        }
      }

      // Start new wave
      if (!spawning.current && now >= nextWaveTick.current) startWave();

      // Spawn enemies in wave
      if (
        spawning.current &&
        enemiesSpawned.current < enemiesTarget.current &&
        now >= nextEnemyTick.current
      ) {
        spawnEnemy();
        enemiesSpawned.current++;

        const interval = randRange(MIN_ENEMY_INTERVAL, MAX_ENEMY_INTERVAL);
        nextEnemyTick.current = now + interval;

        if (enemiesSpawned.current >= enemiesTarget.current) {
          spawning.current = false;
          const delay = randRange(MIN_DELAY, MAX_DELAY);
          nextWaveTick.current = now + delay;
        }
      }

      // Move enemies
      moveEnemies();

      // Collision detection
      const cx = frameW / 2;
      const cy = frameH / 2;
      const newEnemies = [];
      for (const e of enemies.current) {
        const dx = e.x - cx;
        const dy = e.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < (PLAYER_SIZE + ENEMY_SIZE) / 2) {
          setOver(true);
          return;
        } else newEnemies.push(e);
      }
      enemies.current = newEnemies;

      forceRender((t) => (t + 1) % 10000);
    }, FRAME_INTERVAL);

    return () => clearInterval(timer);
  }, [frameW, frameH, over]);

  const startWave = () => {
    waveAngle.current = Math.random() * Math.PI * 2;
    enemiesSpawned.current = 0;
    enemiesTarget.current = Math.floor(randRange(MIN_ENEMIES, MAX_ENEMIES + 1));
    spawning.current = true;
    nextEnemyTick.current = ticks.current; // start immediately
  };

  const spawnEnemy = () => {
    const cx = frameW / 2;
    const cy = frameH / 2;
    const baseA = waveAngle.current;
    const a = baseA + (Math.random() - 0.5) * DIRECTION_SPAN;
    const radius = frameW / 2 + 10;

    const x = cx + radius * Math.cos(a);
    const y = cy + radius * Math.sin(a);
    const dx = cx - x;
    const dy = cy - y;
    const len = Math.sqrt(dx * dx + dy * dy);
    enemies.current.push({
      x,
      y,
      vx: (dx / len) * ENEMY_SPEED,
      vy: (dy / len) * ENEMY_SPEED,
    });
  };

  const moveEnemies = () => {
    const cx = frameW / 2;
    const cy = frameH / 2;
    const maxDist = frameW / 2 + 40;
    const newEnemies = [];

    enemies.current.forEach((e) => {
      e.x += e.vx;
      e.y += e.vy;
      const dx = e.x - cx;
      const dy = e.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) newEnemies.push(e);
    });

    enemies.current = newEnemies;
  };

  // INPUT HANDLING
  const onPressIn = () => {
    if (over) return;
    holding.current = true;
    arcVisible.current = true;
    lockedAngle.current = aimAngle.current;
    currentLength.current = MAX_RADIUS;
  };

  const onPressOut = () => {
    if (over) return;
    triggerAttack();
  };

  const triggerAttack = () => {
    if (!lockedAngle.current) return;
    const cx = frameW / 2;
    const cy = frameH / 2;
    const radius = currentLength.current;
    let start = lockedAngle.current;
    let end = aimAngle.current;
    if (end < start) [start, end] = [end, start];

    const newEnemies = [];
    let kills = 0;

    enemies.current.forEach((e) => {
      const dx = e.x - cx;
      const dy = e.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let a = Math.atan2(dy, dx);
      if (a < 0) a += Math.PI * 2;

      let inArc = false;
      if (start < end) inArc = a >= start && a <= end;
      else inArc = a >= start || a <= end;

      if (inArc && dist <= radius) kills++;
      else newEnemies.push(e);
    });

    enemies.current = newEnemies;

    if (kills > 0) {
      const comboScore = (kills * (kills + 1)) / 2;
      setScore((s) => s + comboScore);
    }

    holding.current = false;
    arcVisible.current = false;
    lockedAngle.current = null;
    currentLength.current = BASE_RADIUS;
  };

  const reset = () => {
    enemies.current = [];
    ticks.current = 0;
    setScore(0);
    setOver(false);
    spawning.current = false;
    enemiesSpawned.current = 0;
    enemiesTarget.current = 0;
    nextWaveTick.current = 0;
    waveAngle.current = Math.random() * Math.PI * 2;
    currentLength.current = BASE_RADIUS;
  };

  const cx = frameW / 2;
  const cy = frameH / 2;
  const radius = currentLength.current;

  return (
    <Background>
      <View
        style={styles.frame}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setFrameW(width);
          setFrameH(height);
        }}
      >
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={{ flex: 1 }}>
          {/* Player */}
          <View
            style={[
              styles.player,
              { left: cx - PLAYER_SIZE / 2, top: cy - PLAYER_SIZE / 2 },
            ]}
          />

          {/* Rotating aim line */}
          <View
            style={[
              styles.line,
              {
                left: cx,
                top: cy,
                width: radius,
                transform: [{ rotate: `${(aimAngle.current * 180) / Math.PI}deg` }],
              },
            ]}
          />

          {/* Locked aim indicator */}
          {lockedAngle.current !== null && (
            <View
              style={[
                styles.lockedLine,
                {
                  left: cx,
                  top: cy,
                  width: radius,
                  transform: [
                    { rotate: `${(lockedAngle.current * 180) / Math.PI}deg` },
                  ],
                },
              ]}
            />
          )}

          {/* Enemies */}
          {enemies.current.map((e, i) => (
            <View
              key={i}
              style={[
                styles.enemy,
                { left: e.x - ENEMY_SIZE / 2, top: e.y - ENEMY_SIZE / 2 },
              ]}
            />
          ))}

          {/* HUD */}
          <Text style={styles.hud}>Score: {score}</Text>
          {!over && (
            <Text style={styles.help}>Combo: 1+2+3 per multi-kill attack</Text>
          )}

          {over && (
            <View style={styles.overlay}>
              <Text style={styles.overTitle}>Game Over</Text>
              <Pressable onPress={reset} style={styles.button}>
                <Text style={styles.buttonText}>Restart</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </View>
    </Background>
  );
}

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

// STYLES
const styles = StyleSheet.create({
  frame: {
    margin: 12,
    borderWidth: 3,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    alignSelf: "center",
    width: Math.min(W, H) - 80,
    height: Math.min(W, H) - 80,
  },
  player: {
    position: "absolute",
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2,
    backgroundColor: "#0077ff",
  },
  line: {
    position: "absolute",
    height: 2,
    backgroundColor: "rgba(0,0,0,0.7)",
    transformOrigin: "left center",
  },
  lockedLine: {
    position: "absolute",
    height: 2,
    backgroundColor: "#00b4ff",
    transformOrigin: "left center",
  },
  enemy: {
    position: "absolute",
    width: ENEMY_SIZE,
    height: ENEMY_SIZE,
    borderRadius: ENEMY_SIZE / 2,
    backgroundColor: "#ff4d4d",
  },
  hud: {
    position: "absolute",
    left: 12,
    top: 10,
    color: "#111",
    fontWeight: "bold",
    fontSize: 16,
  },
  help: {
    position: "absolute",
    right: 12,
    top: 10,
    color: "#666",
    fontSize: 14,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  overTitle: {
    color: "#111",
    fontSize: 28,
    fontWeight: "bold",
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#111",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
