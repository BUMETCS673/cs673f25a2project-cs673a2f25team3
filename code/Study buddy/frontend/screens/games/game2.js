/*******************************************************************************
 * File: game2.js
 * Author: Qiuting Zhao
 * bamboo game
 * Use AI to understand the basic structure within React Native framework
 * For the logic part, 80% human-written, 20% AI-assisted (for rendering part)
 * The stylesheet structure is mostly AI(Self-generated), but values and parameters are human-tuned
********************************************************************************/

import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Background } from "../../components/Background";

// Get device dimensions
const { width: W, height: H } = Dimensions.get("window");

// Base unit for scaling
const BASE_UNIT = Math.min(W, H);

// Constants
const PLAYER_SIZE = BASE_UNIT * 0.03;
const BAMBOO_WIDTH = BASE_UNIT * 0.015;
const MAX_BAMBOOS = 5; // maximum number of bamboos at once
const PLAYER_SPEED = BASE_UNIT * 0.004;
const BAMBOO_GROWTH_MIN = BASE_UNIT * 0.0003;
const BAMBOO_GROWTH_MAX = BASE_UNIT * 0.0009;
const BAMBOO_CUT_HEIGHT = BASE_UNIT * 0.23;
const BAMBOO_SPAWN_DELAY_MIN = BASE_UNIT * 0.1;
const BAMBOO_SPAWN_DELAY_MAX = BASE_UNIT * 0.2;

export default function Game2() {
  // Game frame dimensions
  const [frameH, setFrameH] = useState(Math.min(W, H) - 20);
  const [frameW, setFrameW] = useState(Math.min(W, H) - 20);
  // Ground Y position
  const groundY = Math.min(frameH * 0.8, H * 0.7);
  // Score and game over state
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [showStartTip, setShowStartTip] = useState(true);
  const [started, setStarted] = useState(false);

  // Runtime refs
  const player = useRef({ x: frameW * 0.5, y: groundY - PLAYER_SIZE });  // player position
  const vx = useRef(PLAYER_SPEED); // horizontal velocity
  const bamboos = useRef([]); // list of active bamboos
  const ticks = useRef(0);  // frame counter
  const nextBamboo = useRef(0); // timer until next bamboo spawn

  // Handle window resize dynamically
  useEffect(() => {
    const handleResize = ({ window }) => {
      setFrameW(Math.min(window.width, window.height) - 20);
      setFrameH(Math.min(window.width, window.height) - 20);
    };
    const subscription = Dimensions.addEventListener("change", handleResize);
    return () => subscription?.remove();
  }, []);
  // Force screen update
  const [, forceRender] = useState(0);

  // Main game loop
  useEffect(() => {
    let rafId;
    const loop = () => {
      if (over || !started) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      ticks.current++;

      const p = player.current;

      // move player horizontally
      p.x += vx.current;

      // bounce back if reaching edges
      if (p.x <= 0 || p.x + PLAYER_SIZE >= frameW) {
        vx.current *= -1;
        p.x = Math.max(0, Math.min(p.x, frameW - PLAYER_SIZE));
      }

      // spawn bamboos (only if count < MAX_BAMBOOS)
      nextBamboo.current--;
      if (nextBamboo.current <= 0 && bamboos.current.length < MAX_BAMBOOS) {
        const newX = randRange(20, frameW - 20);

        // prevent overlapping with nearby existing bamboos
        const BAMBOO_SPAWN_MIN_DIST = BASE_UNIT * 0.12; // min distance between bamboos
        const tooClose = bamboos.current.some(b => Math.abs(b.x - newX) < BAMBOO_SPAWN_MIN_DIST);

        if (!tooClose) {
          bamboos.current.push({
            x: newX,
            height: 0,
            speed: randRange(BAMBOO_GROWTH_MIN, BAMBOO_GROWTH_MAX),
            color: "yellow",
          });
        }

        nextBamboo.current = randRange(BAMBOO_SPAWN_DELAY_MIN, BAMBOO_SPAWN_DELAY_MAX);
      }


      // Update existing bamboos
      const newB = [];
      for (const b of bamboos.current) {
        b.height += b.speed;

        if (b.height > BASE_UNIT * 0.3 && b.color === "yellow") {
          b.color = "green";
        }

        const bambooTop = groundY - b.height;
        const collide =
          p.x > b.x - BAMBOO_WIDTH / 2 &&
          p.x < b.x + BAMBOO_WIDTH / 2 &&
          p.y + PLAYER_SIZE >= bambooTop &&
          p.y <= groundY;

        if (collide) {

          if (b.color === "yellow") {
            setScore(s => s + 5);
            continue;
          } else {
            vx.current *= -1;
            let cut = BAMBOO_CUT_HEIGHT;
            b.height -= cut;
            if (b.height <= 0) continue;
          }
        }

        if (b.height > groundY - BASE_UNIT * 0.05) {
          setOver(true);
          break;
        }

        newB.push(b);
      }

      bamboos.current = newB;

      // if (ticks.current % 60 === 0) setScore(s => s + 1);
      forceRender(t => (t + 1) % 100000);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [over, frameW, frameH, started, groundY]);

  // Controls
  const onPress = () => {
    if (over) return;
    if (showStartTip) {
      setShowStartTip(false);
      setStarted(true);
      return;
    }
    vx.current *= -1;
  };

  // Restart game after game over
  const reset = () => {
    player.current = { x: frameW * 0.5, y: groundY - PLAYER_SIZE };
    vx.current = PLAYER_SPEED;
    bamboos.current = [];
    ticks.current = 0;
    nextBamboo.current = 0;
    setOver(false);
    setScore(0);
    setShowStartTip(true);
    setStarted(false);
  };

  // Render
  const p = player.current;

  return (
    <Background>
      <View style={styles.container}>
        <View
          style={[
            styles.frame,
            { width: frameW, height: frameH },
          ]}
        >
          <Pressable onPress={onPress} style={{ flex: 1 }}>
            {/* start tip overlay */}
            {showStartTip && (
              <View style={styles.startTipOverlay}>
                <Text style={styles.startTipText}>Tap to Turn</Text>
                <Text style={styles.startTipText}>Avoid Tall Bamboos</Text>
                <Text style={styles.startSubText}>(Tap anywhere to start)</Text>
              </View>
            )}

            {/* ground */}
            <View style={[styles.ground, { top: groundY }]} />

            {/* player */}
            <View
              style={[
                styles.player,
                {
                  left: p.x - PLAYER_SIZE / 2,
                  top: p.y,
                },
              ]}
            />

            {/* bamboos */}
            {bamboos.current.map((b, i) => (
              <View
                key={i}
                style={[
                  styles.bamboo,
                  {
                    left: b.x - BAMBOO_WIDTH / 2,
                    top: groundY - b.height,
                    height: b.height,
                    backgroundColor: b.color === "yellow" ? "#facc15" : "#16a34a",
                  },
                ]}
              />
            ))}

            {/* HUD */}
            <Text style={styles.hud}>Score: {Math.floor(score)}</Text>

            {/* overlay */}
            {over && (
              <View style={styles.overlay}>
                <Text style={styles.overTitle}>Game Over</Text>
                <Text style={styles.overScore}>Score {Math.floor(score)}</Text>
                <Pressable onPress={reset} style={styles.button}>
                  <Text style={styles.buttonText}>Restart</Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </Background>
  );
}

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    margin: 12,
    borderWidth: 3,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    alignSelf: "center",
    maxWidth: "95%",
    maxHeight: "95%",
    aspectRatio: 1,
  },
  ground: {
    position: "absolute",
    width: "100%",
    height: H * 0.015,
    backgroundColor: "#a855f7",
  },
  player: {
    position: "absolute",
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    backgroundColor: "#22c55e",
    borderRadius: 3,
  },
  bamboo: {
    position: "absolute",
    width: BAMBOO_WIDTH,
    borderRadius: 2,
  },
  hud: {
    position: "absolute",
    left: 12,
    top: 10,
    color: "#111",
    fontWeight: "bold",
    fontSize: 16,
    userSelect: "none",
    pointerEvents: "none",
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
    gap: 8,
  },
  startTipOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    zIndex: 10,
  },
  startTipText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 6,
  },
  startSubText: {
    fontSize: 16,
    color: "#555",
  },
  overTitle: {
    color: "#111",
    fontSize: 28,
    fontWeight: "bold",
  },
  overScore: {
    color: "#111",
    fontSize: 18,
    marginBottom: 8,
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
