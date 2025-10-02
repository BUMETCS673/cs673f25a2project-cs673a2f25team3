import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import React, { useState, useEffect } from "react";
import { createClock, timeToString } from "../util/formatString";

// Studying page - this is the page that is open during studying
export default function Studying({ route, navigation }) {
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [countdownActive, setCountdownActive] = useState(false);
  const [timeOnClock, setTimeOnClock] = useState(0);
  const [totalTimeStudied, setTotalTimeStudied] = useState(0);
  const [countingUp, setCountingUp] = useState(false);
  
// starts countdown on load
  useEffect(() => {
    if (Object.hasOwn(route.params, 'countingUp')) {
      setCountingUp(route.params.countingUp);
    } else {
      setCountingUp(false);
    }
    startCountdown();
  }, []);

// counts down
  useEffect(() => {
    if (countdownActive) {
      const countdownInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        if (countingUp) {
          setTimeOnClock(currentTime - startTime);
        } else {
          let remainingTime = endTime - currentTime;

          // when done, do this
          if (remainingTime <= 0) {
            remainingTime = 0;
            endCountdown();
            clearInterval(countdownInterval);
          }

          setTimeOnClock(remainingTime);
        }
        
      }, 500);

      return () => clearInterval(countdownInterval);
    }
  }, [countdownActive, endTime, timeOnClock]);

// resets timer
  const startCountdown = () => {
    const currentTime = new Date().getTime();
    setStartTime(currentTime);
    if (countdownActive) {
      setTotalTimeStudied(totalTimeStudied + (currentTime - startTime));
    }
    if (countingUp) {
      setTimeOnClock(0);
    } else {
      const goal = route.params.minutes * 60 * 1000;
      setEndTime(currentTime + goal);
      setTimeOnClock(goal);
    }
    setCountdownActive(true);
  };

// end countdown
  const endCountdown = () => {
    const currentTime = new Date().getTime();
    setTotalTimeStudied(totalTimeStudied + (currentTime - startTime));
    setCountdownActive(false);
  };

// store study time
  const storeStudyTime = () => {
    if (countdownActive) {
      endCountdown();
    }
    // add code here to store time to device
    setTotalTimeStudied(0);
  }

  if (countdownActive) {
    return (
      <Background>
        <View style={styles.card}>
          <Text h1 style={styles.cardH1}>Study hard!</Text>

          {/* display the amount of time left */}
          <Text style={styles.timer}>{createClock(timeOnClock)}</Text>

          {/* When counting up, have a button that stops the clock */}
          {!!countingUp && 
          <TouchableOpacity onPress={endCountdown}>
            <Text style={styles.navigationButton}>Done</Text>
          </TouchableOpacity>
          }

          {/* reset button */}
          <TouchableOpacity onPress={startCountdown}>
            <Text style={styles.navigationButton}>Reset</Text>
          </TouchableOpacity>

          {/* navigation */}
          <TouchableOpacity onPress={() => {storeStudyTime(); navigation.navigate("SelectStudyTime")}} as="a">
            <Text style={styles.navigationButton}>Select Different Time</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {storeStudyTime(); navigation.navigate("Home")}} as="a">
            <Text style={styles.navigationButton}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  } else {
    return (
      <Background>
        <View style={styles.card}>
          <Text h1 style={styles.cardH1}>You finished!</Text>

          <Text style={styles.paragraph}>You studied for {timeToString(totalTimeStudied)}</Text>

          {/* reset button */}
          <TouchableOpacity onPress={startCountdown}>
            <Text style={styles.navigationButton}>Reset</Text>
          </TouchableOpacity>

          {/* navigation */}
          <TouchableOpacity onPress={() => {storeStudyTime(); navigation.navigate("Home")}} as="a">
            <Text style={styles.navigationButton}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }
}