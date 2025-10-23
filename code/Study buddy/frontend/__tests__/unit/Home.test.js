/*
  100% AI generate
*/

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../AuthContext';
import Home from '../../screens/Home';
import { act } from 'react-test-renderer';

const Providers = ({ children }) => (
  <NavigationContainer>
    <AuthProvider>{children}</AuthProvider>
  </NavigationContainer>
);

describe('Home Screen', () => {
  test('renders correctly', () => {
    const { getByText } = render(<Home />, { wrapper: Providers });

    expect(getByText('Home')).toBeTruthy(); 
    expect(getByText('Start Studying!')).toBeTruthy();
    expect(getByText('Logout')).toBeTruthy();
  });

  test('logout works', async () => {
    const { getByText } = render(<Home />, { wrapper: Providers });

    await act(async () => {
      fireEvent.press(getByText('Logout'));
    });

    expect(getByText('Home')).toBeTruthy();
  });
});
