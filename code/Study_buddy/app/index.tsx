/*
  10% framework
  80% manual
  10% AI
*/


import { Asset } from "expo-asset";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

export default function HomeScreen() {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const asset = Asset.fromModule(require("../assets/HTML.file/personal.html"));
      await asset.downloadAsync();
      setUri(asset.localUri);
    })();
  }, []);

  if (!uri) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ uri }}
      allowFileAccess
      allowUniversalAccessFromFileURLs
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
    />
  );
}
