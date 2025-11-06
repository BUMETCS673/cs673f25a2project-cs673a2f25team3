/*******************************************************************************
 * File: game1.js
 * Author: Qiuting Zhao
 * golfme game
 * Use AI to understand the basic structure within React Native framework
 * For the logic part, 85% human-written, 15% AI-assisted (for rendering part)
 * The stylesheet structure is mostly AI(Self-generated), but values and parameters are human-tuned
********************************************************************************/

import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Background } from "../../components/Background";

// Get device dimensions
const { width: W, height: H } = Dimensions.get("window");

// Constants
const BASE_UNIT = Math.min(W, H);
const PLAYER_SIZE = BASE_UNIT * 0.035;
const GRAVITY = BASE_UNIT * 0.0007;
const JUMP_SPEED = BASE_UNIT * 0.011;
const WORLD_SCROLL = BASE_UNIT * 0.003;
const FONT_SCALE = BASE_UNIT * 0.01;

// Gap between platforms
const MIN_GAP = BASE_UNIT * 0.1;
const MAX_GAP = BASE_UNIT * 0.15;

// Platform width ratios
const MIN_WIDTH_RATIO = 0.2;
const MAX_WIDTH_RATIO = 0.38;

export default function Game1() {
  // Game frame dimensions
  const [frameH, setFrameH] = useState(Math.min(W, H) - 20);
  const [frameW, setFrameW] = useState(Math.min(W, H) - 20);
  // Ground Y position
  const groundY = Math.min(frameH * 0.8, H * 0.7);
  // Score and game states
  const [score, setScore] = useState(0);
  const [showStartTip, setShowStartTip] = useState(true);
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);

  // Runtime refs
  const player = useRef({ x: W * 0.25, y: groundY - PLAYER_SIZE });
  const velocity = useRef({ x: 0, y: 0 });
  const isJumping = useRef(false);
  const angle = useRef(0);
  const holding = useRef(false);
  const segments = useRef([]);
  const ticks = useRef(0);
  const lastAddX = useRef(0);

  // Handle window resize dynamically
  useEffect(() => {
    const handleResize = ({ window }) => {
      setFrameW(Math.min(window.width, window.height) - 20);
      setFrameH(Math.min(window.width, window.height) - 20);
    };
    const subscription = Dimensions.addEventListener("change", handleResize);
    return () => subscription?.remove();
  }, []);

  // Initial platforms
  useEffect(() => {
    const initial = [];
    const firstWidth = randRange(W * MIN_WIDTH_RATIO, W * MAX_WIDTH_RATIO);
    initial.push({ x: 0, width: firstWidth });
    let x = firstWidth + randRange(MIN_GAP, MAX_GAP);

    for (let i = 1; i < 3; i++) {
      const width = randRange(W * MIN_WIDTH_RATIO, W * MAX_WIDTH_RATIO);
      const gap = randRange(MIN_GAP, MAX_GAP);
      initial.push({ x, width });
      x += width + gap;
    }
    segments.current = initial;
    lastAddX.current = x;

    player.current = {
      x: initial[0].x + initial[0].width - PLAYER_SIZE,
      y: groundY - PLAYER_SIZE,
    };
  }, []);

  // Force screen update
  const [, forceRender] = useState(0);

  // Main game loop
  useEffect(() => {
    let rafId;
    const loop = () => {
      ticks.current += 1;

      if (over || !started) { // pause loop until started
        rafId = requestAnimationFrame(loop);
        return;
      }

      // adjust angle if holding (not jumping)
      if (!isJumping.current && holding.current) angle.current -= 0.05;

      const p = player.current;
      const v = velocity.current;

      // update player position if jumping
      if (isJumping.current) {
        p.x += v.x;
        p.y += v.y;
        v.y += GRAVITY;

        // landing check
        let onGround = false;
        for (const seg of segments.current) {
          if (
            p.x + 0.7 * PLAYER_SIZE > seg.x &&
            p.x + 0.3 * PLAYER_SIZE < seg.x + seg.width &&
            p.y + PLAYER_SIZE >= groundY &&
            p.y + PLAYER_SIZE <= groundY + PLAYER_SIZE * 0.6
          ) {
            onGround = true;
            break;
          }
        }
        // reset if landed
        if (onGround) {
          p.y = groundY - PLAYER_SIZE;
          isJumping.current = false;
          v.x = 0;
          v.y = 0;
          angle.current = 0;
        }
      } else {
        p.x -= WORLD_SCROLL;
      }

      // game over checks
      if (
        p.x <= 0 ||
        p.x + PLAYER_SIZE >= frameW ||
        p.y <= 0 ||
        p.y + PLAYER_SIZE >= frameH
      ) {
        setOver(true);
        return;
      }

      // move and recycle ground
      const segs = segments.current.map(s => ({ ...s, x: s.x - WORLD_SCROLL }));
      const visible = segs.filter(s => s.x + s.width > -50);

      const rightmost = visible[visible.length - 1];
      if (rightmost && rightmost.x + rightmost.width < frameW + 50) {
        const newGap =
          randRange(MIN_GAP, MAX_GAP) *
          (Math.random() < 0.5 ? 0.7 : 1.0 + Math.random() * 0.3);
        const newWidth = randRange(frameW * MIN_WIDTH_RATIO, frameW * MAX_WIDTH_RATIO);
        const newX = rightmost.x + rightmost.width + Math.min(newGap, MAX_GAP);

        if (newX > rightmost.x + 20) {
          visible.push({ x: newX, width: newWidth });
          lastAddX.current = newX + newWidth;
        }
      }

      segments.current = visible;

      if (ticks.current % 60 === 0) setScore(s => s + 1);

      forceRender(t => (t + 1) % 100000);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [over, frameW, frameH, groundY, started]);

  // Controls
  const onPressIn = () => {
    if (over) return;

    if (showStartTip) {
      setShowStartTip(false);
      setStarted(true); // officially start game
      return; // avoid aiming immediately
    }

    if (!isJumping.current) holding.current = true;
  };

  const onPressOut = () => {
    if (over) return;
    if (!isJumping.current && holding.current) {
      holding.current = false;
      isJumping.current = true;
      const a = angle.current;
      velocity.current = {
        x: JUMP_SPEED * Math.cos(a),
        y: JUMP_SPEED * Math.sin(a),
      };
    }
  };

  // Restart game after game over
  const reset = () => {
    const newSegs = [];
    const firstWidth = randRange(frameW * MIN_WIDTH_RATIO, frameW * MAX_WIDTH_RATIO);
    newSegs.push({ x: 0, width: firstWidth });

    let x = firstWidth + randRange(MIN_GAP, MAX_GAP);
    for (let i = 1; i < 3; i++) {
      const width = randRange(frameW * MIN_WIDTH_RATIO, frameW * MAX_WIDTH_RATIO);
      const gap = randRange(MIN_GAP, MAX_GAP);
      newSegs.push({ x, width });
      x += width + gap;
    }
    segments.current = newSegs;
    lastAddX.current = x;

    player.current = {
      x: newSegs[0].x + newSegs[0].width - PLAYER_SIZE,
      y: groundY - PLAYER_SIZE,
    };
    velocity.current = { x: 0, y: 0 };
    isJumping.current = false;
    holding.current = false;
    angle.current = 0;
    ticks.current = 0;
    setScore(0);
    setOver(false);
    setStarted(true);
  };

  // aim line calculations
  const p = player.current;
  const aimLen = BASE_UNIT * 0.06;
  const aimX2 = p.x + aimLen * Math.cos(angle.current);
  const aimY2 = p.y + aimLen * Math.sin(angle.current);

  // Render the game
  return (
    <Background>
      <View style={styles.container}>
        <View
          style={[
            styles.frame,
            { width: frameW, height: frameH },
          ]}
        >
          <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={{ flex: 1 }}>
            {/* start tip overlay */}
            {showStartTip && (
              <View style={styles.startTipOverlay}>
                <Text style={styles.startTipText}>Hold to aim angle</Text>
                <Text style={styles.startTipText}>Release to jump</Text>
                <Text style={styles.startSubText}>(Tap anywhere to start)</Text>
              </View>
            )}

            {/* ground */}
            {segments.current.map((seg, i) => (
              <View
                key={i}
                style={[
                  styles.ground,
                  { left: seg.x, top: groundY, width: seg.width },
                ]}
              />
            ))}

            {/* player */}
            <View
              style={[
                styles.player,
                {
                  left: p.x - PLAYER_SIZE / 2,
                  top: p.y,
                  width: PLAYER_SIZE,
                  height: PLAYER_SIZE,
                },
              ]}
            />

            {/* aim line */}
            {!isJumping.current && holding.current && (
              <View
                style={[
                  styles.aimLine,
                  {
                    left: p.x,
                    top: p.y + PLAYER_SIZE / 2,
                    width: Math.max(
                      1,
                      Math.hypot(aimX2 - p.x, aimY2 - (p.y + PLAYER_SIZE / 2))
                    ),
                    transform: [{ rotate: `${(angle.current * 180) / Math.PI}deg` }],
                  },
                ]}
              />
            )}

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
    height: H * 0.015,
    backgroundColor: "#3b82f6",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  player: {
    position: "absolute",
    backgroundColor: "#16a34a",
    borderRadius: 3,
  },
  aimLine: {
    position: "absolute",
    height: 2,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: 1,
    transformOrigin: "left center",
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


// // Red of TDD
// export function updateScore(currentScore, ticks) {
//   // TODO: implement after test fails
//   throw new Error("Not implemented");
// }

// // Green of TDD
// export function updateScore(currentScore, ticks) {
//   if (ticks % 60 === 0) {
//     return currentScore + 1;
//   }
//   return currentScore;
// }

// // Refactor of TDD
// export function updateScore(currentScore, ticks, rate = 60) {
//   const shouldIncrease = ticks % rate === 0;
//   return shouldIncrease ? currentScore + 1 : currentScore;
// }
