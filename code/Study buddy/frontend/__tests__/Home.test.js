import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../AuthContext';
import Home from '../screens/Home';

const Providers = ({ children }) => (
  <NavigationContainer>
    <AuthProvider>{children}</AuthProvider>
  </NavigationContainer>
);

describe('Home Screen', () => {
  it('renders basic UI', () => {
    const { getByText } = render(<Home />, { wrapper: Providers });
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Start Studying!')).toBeTruthy();
    expect(getByText('Logout')).toBeTruthy();
  });

  it('logout button is pressable', () => {
    const { getByText } = render(<Home />, { wrapper: Providers });
    fireEvent.press(getByText('Logout'));
    expect(getByText('Home')).toBeTruthy();
  });
});
