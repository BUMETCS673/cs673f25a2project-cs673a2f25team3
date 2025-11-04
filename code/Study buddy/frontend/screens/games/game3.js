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

// Constants
const PLAYER_SIZE = 25;
const ENEMY_SIZE = 14;
const ENEMY_SPEED = 1;
const DIRECTION_SPAN = Math.PI / 12;
const FPS = 60;
const MIN_DELAY = 2 * FPS;
const MAX_DELAY = 4 * FPS;
const MIN_ENEMIES = 1;
const MAX_ENEMIES = 12;

// Visual
const ROTATION_SPEED = 0.07;
const BASE_RADIUS = 50;
const MAX_RADIUS = 270;
const MIN_RADIUS = 90;
const ARC_LIMIT = (150 * Math.PI) / 180;

// Wave spawn timing
const MIN_ENEMY_INTERVAL = 0.1 * FPS;
const MAX_ENEMY_INTERVAL = 0.4 * FPS;

export default function GameArcFire() {
  // Frame setup
  const [frameH, setFrameH] = useState(Math.min(W, H) - 80);
  const [frameW, setFrameW] = useState(Math.min(W, H) - 80);

  const player = useRef({ x: frameW / 2, y: frameH / 2 });
  const enemies = useRef([]);
  const ticks = useRef(0);
  const waveAngle = useRef(Math.random() * Math.PI * 2);
  const nextWaveTick = useRef(0);
  const nextEnemyTick = useRef(0);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [, forceRender] = useState(0);

  // Aim + Arc visual
  const aimAngle = useRef(0);
  const lockedAngle = useRef(null);
  const holding = useRef(false);
  const arcVisible = useRef(false);
  const currentLength = useRef(BASE_RADIUS);

  // Wave control
  const spawning = useRef(false);
  const enemiesSpawned = useRef(0);
  const enemiesTarget = useRef(0);

  // Main game Loop
  useEffect(() => {
    let raf;

    const loop = () => {
      if (over) return;
      ticks.current++;
      const now = ticks.current;

      // Continuous rotation
      aimAngle.current += ROTATION_SPEED;
      if (aimAngle.current > Math.PI * 2) aimAngle.current -= Math.PI * 2;

      // Handle holding + length
      if (holding.current && lockedAngle.current !== null) {
        let diff = Math.abs(aimAngle.current - lockedAngle.current);
        if (diff > Math.PI) diff = 2 * Math.PI - diff;

        if (diff >= ARC_LIMIT) {
          triggerAttack(); // auto-release
        } else {
          const ratio = diff / ARC_LIMIT;
          currentLength.current =
            MAX_RADIUS - (MAX_RADIUS - MIN_RADIUS) * ratio;
        }
      }

      // Wave spawning
      if (!spawning.current && now >= nextWaveTick.current) startWave();

      // Spawn enemies one by one
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
      enemies.current.forEach((e) => {
        e.x += e.vx;
        e.y += e.vy;
      });

      // Collision check
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
      raf = requestAnimationFrame(loop);
    };

    const startWave = () => {
      waveAngle.current = Math.random() * Math.PI * 2;
      enemiesSpawned.current = 0;
      enemiesTarget.current = Math.floor(
        randRange(MIN_ENEMIES, MAX_ENEMIES + 1)
      );
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

    nextWaveTick.current = 0;
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [frameW, frameH, over]);

  // Input handlers
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

  // Attack
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

    // Combo scoring system
    if (kills > 0) {
      // 1 + 2 + ... + n
      const comboScore = (kills * (kills + 1)) / 2;
      setScore((s) => s + comboScore);
    }

    holding.current = false;
    arcVisible.current = false;
    lockedAngle.current = null;
    currentLength.current = BASE_RADIUS;
  };

  // Reset
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

  const p = player.current;
  const cx = p.x;
  const cy = p.y;
  const radius = currentLength.current;

  return (
    <Background>
      <View
        style={styles.frame}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setFrameW(width);
          setFrameH(height);
          player.current = { x: width / 2, y: height / 2 };
        }}
      >
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={{ flex: 1 }}>
          {/* Player */}
          <View
            style={[
              styles.player,
              { left: p.x - PLAYER_SIZE / 2, top: p.y - PLAYER_SIZE / 2 },
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

          {/* Locked mark */}
          {lockedAngle.current !== null && (
            <View
              style={[
                styles.lockedLine,
                {
                  left: cx,
                  top: cy,
                  width: radius,
                  transform: [{ rotate: `${(lockedAngle.current * 180) / Math.PI}deg` }],
                },
              ]}
            />
          )}

          {/* Arc ring visual */}
          {arcVisible.current && lockedAngle.current !== null && (
            <View
              style={[
                styles.arcCurve,
                {
                  left: cx - MAX_RADIUS,
                  top: cy - MAX_RADIUS,
                  transform: [{ rotate: `${(lockedAngle.current * 180) / Math.PI}deg` }],
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

// Styles
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
  arcCurve: {
    position: "absolute",
    width: MAX_RADIUS * 2,
    height: MAX_RADIUS * 2,
    borderWidth: 2,
    borderColor: "rgba(0, 180, 255, 0.3)",
    borderRadius: MAX_RADIUS,
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
