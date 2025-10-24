import { StyleSheet } from "react-native";
import { borderRadius, fonts, padding } from "./base";

/*
  100% unified styles for the app
  - combines original style.js + LoginForm styles
*/

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  // ====== Containers ======
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "90%",
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

  // ====== Text ======
  cardH1: {
    fontSize: fonts.lg,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: padding.md,
  },
  cardH2: {
    color: 'white',
    textAlign: 'center',
    fontSize: fonts.md,
    fontWeight: 'bold',
    marginBottom: padding.md
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

  // ====== Input Fields ======
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
  inputBox: {
  },
  inputText: {
    fontSize: fonts.md,
    color:'white'
  },
  inputOutline: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ====== Buttons ======
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
  submitButton: {
    backgroundColor: 'white', 
    color: 'black',
    fontWeight: 'bold', 
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: padding.sm,
    paddingHorizontal: padding.md,
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    fontSize: fonts.lg,
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: padding.xs
  },

  // ====== Bottom Row ======
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

  // ====== Checkbox ======
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
  }
});
