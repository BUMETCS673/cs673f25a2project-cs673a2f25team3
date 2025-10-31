/*
  100% AI generate
*/

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from '../../AuthContext';
import Home from '../../screens/Home';

const Stack = createNativeStackNavigator();

const LoginScreen = () => null;

const AppWithNavigation = () => (
  <NavigationContainer>
    <AuthProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </AuthProvider>
  </NavigationContainer>
);

describe('Home Screen', () => {
  test('renders correctly', async () => {
    const { getByText } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByText('Home')).toBeTruthy());
    expect(getByText('Start Studying!')).toBeTruthy();
    expect(getByText('Logout')).toBeTruthy();
  });

  test('logout works', async () => {
    const { getByText, queryByText } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByText('Home')).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByText('Logout'));
    });

    await waitFor(() => expect(queryByText('Home')).toBeNull());
  });
});
