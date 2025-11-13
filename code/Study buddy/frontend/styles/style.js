import { StyleSheet } from "react-native";
import { borderRadius, fonts, padding } from "./base";

/*
  100% unified styles for the app
  - combines original style.js + LoginForm styles + Statistics page styles
*/

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 300,
    maxWidth: 400,
    padding: padding.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 20,
  },
  cardH1: {
    fontSize: fonts.lg,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: padding.md,
  },
  paragraph: {
    fontSize: fonts.md,
    color: "white",
  },
  timer: {
    fontSize: fonts.huge,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: padding.md,
  },
  forgotText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  switchText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  field: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    color: "rgba(255,255,255,0.9)",
    marginBottom: 6,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
  },
  iconLeft: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  iconRight: {
    position: "absolute",
    right: 10,
    zIndex: 1,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
  },
  navigationButton: {
    backgroundColor: "white",
    color: "black",
    fontWeight: "bold",
    borderWidth: 2,
    borderColor: "transparent",
    paddingVertical: padding.sm,
    paddingHorizontal: padding.md,
    borderRadius: borderRadius.sm,
    fontSize: fonts.lg,
    textAlign: "center",
    textAlignVertical: "center",
    margin: padding.xs,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
  },
  loginFormButton: {
    width: "100%",
    maxWidth: "400%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  loginFormButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  checkboxOutline: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    fontSize: fonts.md,
    color: "white",
  },
  checkbox: {
    margin: padding.sm,
    fontSize: fonts.md,
    color: "white",
  },

  // ====== Statistics Page Styles ======
  statsContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  statsCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center", // horizontally center
    width: "100%",
    flexWrap: "wrap",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },
  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    width: "100%",
  },
  sessionText: {
    color: "#fff",
    fontSize: 16,
  },
  noSessions: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 10,
  },
  dayTotal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});