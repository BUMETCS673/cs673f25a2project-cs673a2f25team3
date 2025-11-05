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
const PLAYER_SIZE = 18;
const GRAVITY = 0.5;
const JUMP_SPEED = 7;
const WORLD_SCROLL = 2;

// Gap between platforms
const MIN_GAP = 50;
const MAX_GAP = 120;

// Platform width ratios
const MIN_WIDTH_RATIO = 0.22;
const MAX_WIDTH_RATIO = 0.38;

export default function Game1() {
  // Game frame dimensions
  const [frameH, setFrameH] = useState(Math.min(W, H) - 80);
  const [frameW, setFrameW] = useState(Math.min(W, H) - 80);
  // Ground Y position
  const groundY = Math.min(frameH * 0.8, 520);
  // Score and game over state
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  // Runtime refs
  const player = useRef({ x: W * 0.25, y: groundY - PLAYER_SIZE }); // player start position
  const velocity = useRef({ x: 0, y: 0 });  // player velocity
  const isJumping = useRef(false);  // jumping state
  const angle = useRef(0);  // chosing angle
  const holding = useRef(false);  // player action state
  const segments = useRef([]);  // list of platform segments
  const ticks = useRef(0);  // frame counter
  const lastAddX = useRef(0); // last platform end x position

  // Initial platforms
  useEffect(() => {
    const initial = []; // starting platform
    let x = 0;
    for (let i = 0; i < 3; i++) {
      const width = randRange(W * MIN_WIDTH_RATIO, W * MAX_WIDTH_RATIO);
      const gap = randRange(MIN_GAP, MAX_GAP);
      initial.push({ x, width });
      x += width + gap;
    }
    segments.current = initial;
    lastAddX.current = x;
  }, []);

  // Force screen update
  const [, forceRender] = useState(0);

  // Main game loop
  useEffect(() => {
    let rafId;
    const loop = () => {
      ticks.current += 1; // increment frame count
      if (over) return; // stop if game over

      // adjust angle if holding (not jumping)
      if (!isJumping.current && holding.current) angle.current -= 0.05;

      const p = player.current;
      const v = velocity.current;

      // update player position if jumping
      if (isJumping.current) {
        p.x += v.x;
        p.y += v.y;
        v.y += GRAVITY; // apply gravity

        // landing check
        let onGround = false;
        for (const seg of segments.current) {
          if (
            p.x + PLAYER_SIZE > seg.x &&  // within platform x range
            p.x < seg.x + seg.width &&
            p.y + PLAYER_SIZE >= groundY && // at or below ground level
            p.y + PLAYER_SIZE <= groundY + 10
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
        // scroll frame if not jumping
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
      const segs = segments.current.map(s => ({ ...s, x: s.x - WORLD_SCROLL }));  // scroll left
      const visible = segs.filter(s => s.x + s.width > -50);  // remove off-screen

      // find rightmost platform to add new ones
      const rightmost = visible[visible.length - 1];
      if (rightmost && rightmost.x + rightmost.width < frameW + 50) {
        // random gap
        const newGap = randRange(MIN_GAP, MAX_GAP) * (Math.random() < 0.5 ? 0.7 : 1.0 + Math.random() * 0.3);
        // random width
        const newWidth = randRange(frameW * MIN_WIDTH_RATIO, frameW * MAX_WIDTH_RATIO);
        // new platform position
        const newX = rightmost.x + rightmost.width + Math.min(newGap, MAX_GAP);

        // ensure no overlap
        if (newX > rightmost.x + 20) {
          visible.push({ x: newX, width: newWidth });
          lastAddX.current = newX + newWidth;
        }
      }

      // update playforms
      segments.current = visible;

      // get score every ~1 second
      if (ticks.current % 60 === 0) setScore(s => s + 1);

      // trigger re-render
      forceRender(t => (t + 1) % 100000);
      // schedule next frame
      rafId = requestAnimationFrame(loop);
    };

    // start loop
    rafId = requestAnimationFrame(loop);
    // cleanup on unmount
    return () => cancelAnimationFrame(rafId);
  }, [over, frameW, frameH, groundY]);

  // Controls
  const onPressIn = () => {
    if (over) return; // ignore if game over
    if (!isJumping.current) holding.current = true; // start aiming
  };

  const onPressOut = () => {
    if (over) return;
    if (!isJumping.current && holding.current) {
      holding.current = false;
      isJumping.current = true;
      // calculate jump velocity based on angle
      const a = angle.current;
      velocity.current = {
        x: JUMP_SPEED * Math.cos(a),
        y: JUMP_SPEED * Math.sin(a),
      };
    }
  };

  // Restart game after game over
  const reset = () => {
    // reset player position and state
    player.current = { x: frameW * 0.25, y: groundY - PLAYER_SIZE };
    velocity.current = { x: 0, y: 0 };
    isJumping.current = false;
    holding.current = false;
    angle.current = 0;
    ticks.current = 0;
    setScore(0);
    setOver(false);

    // regenerate initial platforms
    const newSegs = [];
    let x = 0;
    for (let i = 0; i < 3; i++) {
      const width = randRange(frameW * MIN_WIDTH_RATIO, frameW * MAX_WIDTH_RATIO);
      const gap = randRange(MIN_GAP, MAX_GAP);
      newSegs.push({ x, width });
      x += width + gap;
    }
    segments.current = newSegs;
    lastAddX.current = x;
  };

  // aim line calculations
  const p = player.current;
  const aimLen = 40;  // length of aim line
  const aimX2 = p.x + aimLen * Math.cos(angle.current);
  const aimY2 = p.y + aimLen * Math.sin(angle.current);

  // Render the game
  return (
    <Background>
      <View
        style={styles.frame}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setFrameH(height);
          setFrameW(width);
        }}
      >
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={{ flex: 1 }}>
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
          {!over && <Text style={styles.help}>Hold = aim ↓, Release = jump</Text>}

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
    </Background>
  );
}

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Stylesheet
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

  ground: {
    position: "absolute",
    height: 12,
    backgroundColor: "#3b82f6",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
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

