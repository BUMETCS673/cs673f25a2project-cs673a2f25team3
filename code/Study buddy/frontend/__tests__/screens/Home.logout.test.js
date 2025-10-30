import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../../screens/Home';  // fixed path
import { AuthProvider } from '../../AuthContext';  // fixed path
import { NavigationContainer } from '@react-navigation/native';

const Wrapper = ({ children }) => (
  <NavigationContainer>
    <AuthProvider>{children}</AuthProvider>
  </NavigationContainer>
);

describe('Home logout smoke', () => {
  it('presses logout button safely', () => {
    const { getByText } = render(<Home />, { wrapper: Wrapper });
    fireEvent.press(getByText(/logout/i));
  });
});
