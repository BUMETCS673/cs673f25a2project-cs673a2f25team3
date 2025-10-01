import { StyleSheet } from "react-native";

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
  borderRadius: 12,
  padding: 28,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.45)',
  backgroundColor: 'rgba(255,255,255,0.08)',
  // blurRadius: 8
  // boxShadow: '0 12 30 rgba(0,0,0,0.15)'
},

// style for buttons
navigationButton: {
  backgroundColor: '#fff', 
  color: '#000',
  fontWeight: 700, 
  borderWidth: 2,
  borderColor: 'rgba(255, 0, 144, 0)',
  paddingVertical: 12,
  paddingHorizontal: 18,
  borderRadius: 8,
  cursor: 'pointer', 
  // transition: 0.25s ease; 
  fontSize: 30,
  textAlign: 'center',
  textAlignVertical: 'center'
}

});