import { StyleSheet } from "react-native";
import { colors } from "./base";

/*
  100% manual
*/

export const loginStyles = StyleSheet.create({
    hint: {
        color: colors.text,
        fontSize: 12,
        marginTop: 4
    },
    error: {
        color: colors.primary, 
        marginTop: 12, 
        textAlign: "center"
    }
});