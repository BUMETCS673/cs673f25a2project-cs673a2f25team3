/*
  20% AI
  80% Human
*/

import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import LoginForm from "../components/LoginForm"; 
import { styles } from "../styles/style";
import { Background } from "../components/Background";

export default function Login() {
  return (
    <Background>
      <LoginForm />
    </Background>
  );
}

