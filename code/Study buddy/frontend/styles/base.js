import {StyleSheet, Dimensions} from 'react-native'

/*
  5% framework
  95% manual
*/

export const dimensions = {
  fullHeight: Dimensions.get('window').height,
  fullWidth: Dimensions.get('window').width
}
  
export const colors  = {
  primary: '#da7013ff',
  secondary: '#FFF8EE',
  tertiary: '#F5C16C',
  pale: '#FFFFFF',
  text: '#5e5e5eff',
}

export const padding = {
  xs: 4,
  sm: 10,
  md: 20,
  lg: 30,
  xl: 40
}

export const fonts = {
  sm: 12,
  md: 18,
  mdlg: 24,
  lg: 28,
  huge: 76
}

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 20
}