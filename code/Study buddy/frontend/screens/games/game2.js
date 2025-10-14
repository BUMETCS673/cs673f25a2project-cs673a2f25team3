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

// Constants
const PLAYER_SIZE = 16;
const GROUND_Y = Math.min(H * 0.8, 520);
const BAMBOO_WIDTH = 10;
const MAX_BAMBOOS = 5; // maximum number of bamboos at once

export default function Game2() {
  // Game frame dimensions
  const [frameH, setFrameH] = useState(H - 80);
  const [frameW, setFrameW] = useState(W - 24);
  // Score and game over state
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  // Runtime refs
  const player = useRef({ x: frameW * 0.5, y: GROUND_Y - PLAYER_SIZE });  // player position
  const vx = useRef(3); // horizontal velocity
  const bamboos = useRef([]); // list of active bamboos
  const ticks = useRef(0);  // frame counter
  const nextBamboo = useRef(0); // timer until next bamboo spawn

  // Force screen update
  const [, forceRender] = useState(0);

  // Main game loop
  useEffect(() => {
    let rafId;
    const loop = () => {
      if (over) return; // stop if game over
      ticks.current++;  // increment frame counter

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
        bamboos.current.push({
          x: randRange(20, frameW - 20),  // random x position
          height: 0,  // start height
          speed: randRange(0.3, 0.85),  // growth speed
          color: "yellow",  // start as yellow (young)
        });
        nextBamboo.current = randRange(80, 130);  // delay until next spawn
      }

      // Update existing bamboos
      const newB = [];
      for (const b of bamboos.current) {
        b.height += b.speed;  // grow upward

        // switch color from yellow → green(strong) when tall enough
        if (b.height > 200 && b.color === "yellow") {
          b.color = "green";
        }

        const bambooTop = GROUND_Y - b.height;
        // collision detection
        const collide =
          p.x + PLAYER_SIZE > b.x - BAMBOO_WIDTH / 2 &&
          p.x < b.x + BAMBOO_WIDTH / 2 &&
          p.y + PLAYER_SIZE >= bambooTop &&
          p.y <= GROUND_Y;

        if (collide) {
          // reverse direction always
          vx.current *= -1;

          if (b.color === "yellow") {
            // yellow: destroyed instantly + score
            setScore(s => s + 5);
            continue; // remove this bamboo
          } else {
            // green: cut
            let cut = 100;
            b.height -= cut;
            if (b.height <= 0) continue; // destroyed if fully cut
          }
        }

        // if bamboo reaches top, game over
        if (b.height > GROUND_Y - 30) {
          setOver(true);
          break;
        }

        newB.push(b); // keep active
      }

      // update current bamboo list
      bamboos.current = newB;

      // trigger re-render
      forceRender(t => (t + 1) % 100000);
      rafId = requestAnimationFrame(loop);
    };

    // start the loop
    rafId = requestAnimationFrame(loop);
    // cleanup on unmount
    return () => cancelAnimationFrame(rafId);
  }, [over, frameW, frameH]);

  // Controls: tap to turn
  const onPress = () => {
    if (over) return;
    vx.current *= -1; // Tap to turn manually
  };

  // Restart game after game over
  const reset = () => {
    player.current = { x: frameW * 0.5, y: GROUND_Y - PLAYER_SIZE };
    vx.current = 3;
    bamboos.current = [];
    ticks.current = 0;
    nextBamboo.current = 0;
    setOver(false);
    setScore(0);
  };

  // Render the player position
  const p = player.current;

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
        <Pressable onPress={onPress} style={{ flex: 1 }}>
          {/* ground */}
          <View style={[styles.ground, { top: GROUND_Y }]} />

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
                  top: GROUND_Y - b.height,
                  height: b.height,
                  backgroundColor: b.color === "yellow" ? "#facc15" : "#16a34a",
                },
              ]}
            />
          ))}

          {/* HUD */}
          <Text style={styles.hud}>Score: {score}</Text>
          {!over && <Text style={styles.help}>Tap = Turn</Text>}

          {/* Game Over */}
          {over && (
            <View style={styles.overlay}>
              <Text style={styles.overTitle}>Game Over</Text>
              <Text style={styles.overScore}>Score {score}</Text>
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
    flex: 1,
    margin: 12,
    borderWidth: 3,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    alignSelf: "center",
    width: "96%",
  },
  ground: {
    position: "absolute",
    width: "100%",
    height: 10,
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
