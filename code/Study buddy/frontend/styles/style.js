import { StyleSheet } from "react-native";
import { borderRadius, fonts, padding } from "./base";

// general stylesheet used across the app
export const styles = StyleSheet.create({

// standard background for entire website
background: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center'
},

// container to put elements into
card: {
  width: 400,
  // maxWidth: '92vw',
  borderRadius: borderRadius.md,
  padding: padding.lg,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.45)',
  backgroundColor: 'rgba(255,255,255,0.2)',
  // blurRadius: 8
  // boxShadow: '0 12 30 rgba(0,0,0,0.15)'
},

// text in card
cardH1: {
  color: 'white',
  textAlign: 'center',
  fontSize: fonts.lg,
  fontWeight: 'bold',
  marginBottom: padding.md
},

// style for buttons
navigationButton: {
  backgroundColor: 'white', 
  color: 'black',
  fontWeight: 'bold', 
  borderWidth: 2,
  borderColor: 'transparent',
  paddingVertical: padding.sm,
  paddingHorizontal: padding.md,
  borderRadius: borderRadius.sm,
  cursor: 'pointer', 
  // transition: 0.25s ease; 
  fontSize: fonts.lg,
  textAlign: 'center',
  textAlignVertical: 'center',
  margin: padding.xs
}

});