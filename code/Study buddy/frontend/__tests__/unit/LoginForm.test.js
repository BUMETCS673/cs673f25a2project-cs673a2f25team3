/*
  global fetchMock 
*/

/*
  100% AI generate
*/

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from '../../AuthContext';
import LoginForm from '../../components/LoginForm';
const Stack = createNativeStackNavigator();

const HomeScreen = () => <Text testID="home-screen">Home Screen</Text>;

const AppWithNavigation = () => (
  <NavigationContainer>
    <AuthProvider>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </AuthProvider>
  </NavigationContainer>
);

describe('LoginForm', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders login form correctly', async () => {
    const { getByPlaceholderText, getByTestId } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByPlaceholderText('Enter your username')).toBeTruthy());
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByTestId('loginButton')).toBeTruthy();
  });

  test('login updates context and navigates', async () => {
    const { getByPlaceholderText, getByTestId, queryByPlaceholderText, findByTestId } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByPlaceholderText('Enter your username')).toBeTruthy());

    fetchMock.mockResponseOnce(
      JSON.stringify({
        message: 'Login successful',
        user: { username: 'testuser' },
        token: 'fake-token'
      })
    );

    // input user name and password
    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password');

    await act(async () => {
      fireEvent.press(getByTestId('loginButton'));
    });

    await waitFor(() => expect(queryByPlaceholderText('Enter your username')).toBeNull());
    await findByTestId('home-screen');
  });

  test('switches to register mode', async () => {
    const { getByText, getByTestId } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByTestId('loginButton')).toBeTruthy());

    // change to register
    await act(async () => {
      fireEvent.press(getByText('Switch to Register'));
    });

    // check button text 'Register'
    expect(getByTestId('loginButton').children[0].props.children).toBe('Register');

    // go back to login mode
    await act(async () => {
      fireEvent.press(getByText('Switch to Login'));
    });

    expect(getByTestId('loginButton').children[0].props.children).toBe('Login');
  });
});
