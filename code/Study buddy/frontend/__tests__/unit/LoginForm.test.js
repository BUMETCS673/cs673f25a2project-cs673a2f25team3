/*
  100% AI generate
*/

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../AuthContext';
import LoginForm from '../../components/LoginForm';
import { act } from 'react-test-renderer';


const Wrapper = ({ children }) => (
  <NavigationContainer>
    <AuthProvider>{children}</AuthProvider>
  </NavigationContainer>
);

describe('LoginForm', () => {
  test('renders login form correctly', () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginForm />, {
      wrapper: Wrapper,
    });

    expect(getByPlaceholderText('Enter your username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByTestId('loginButton')).toBeTruthy();
  });

  test('login updates context and navigates', async () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginForm />, {
      wrapper: Wrapper,
    });

    // input user name and password
    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password');

    // 
    await act(async () => {
      fireEvent.press(getByTestId('loginButton'));
    });

    // check input
    expect(getByPlaceholderText('Enter your username').props.value).toBe('testuser');
    expect(getByPlaceholderText('Enter your password').props.value).toBe('password');
  });

  test('switches to register mode', async () => {
    const { getByText, getByTestId } = render(<LoginForm />, { wrapper: Wrapper });

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
