import { StyleSheet } from "react-native";

export const studyingStyles = StyleSheet.create({
  iconSpacing: {
    marginRight: 6,
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E67E22",
  },

  motto: {
    fontSize: 13,
    color: "#A0601A",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
  },

  infoBox: {
    backgroundColor: "#FFF8F0",
    borderWidth: 2,
    borderColor: "#F5C16C",
    borderRadius: 12,
    padding: 18,
  },

  infoText: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },

  timerWrapper: {
    alignItems: "center",
    marginVertical: 10,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#E67E22",
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
