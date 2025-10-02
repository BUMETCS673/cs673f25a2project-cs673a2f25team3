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
  borderRadius: borderRadius.md,
  padding: padding.lg,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.45)',
  backgroundColor: 'rgba(255,255,255,0.2)'
},

// text

// headers
cardH1: {
  color: 'white',
  textAlign: 'center',
  fontSize: fonts.lg,
  fontWeight: 'bold',
  marginBottom: padding.md
},

// general text
paragraph: {
  fontSize: fonts.md,
  color:'white',
},

// button
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
  fontSize: fonts.lg,
  textAlign: 'center',
  textAlignVertical: 'center',
  margin: padding.xs
},

// checkbox
checkboxOutline: {
  flexDirection: 'row',
  alignItems: 'center',
},
checkboxText: {
  fontSize: fonts.md,
  color:'white',
},
checkbox: {
  margin: padding.sm,
  fontSize: fonts.md,
  color:'white'
},

});