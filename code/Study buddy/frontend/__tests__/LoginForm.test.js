import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../AuthContext';
import LoginForm from '../components/LoginForm';

const Wrapper = ({ children }) => (
  <NavigationContainer>
    <AuthProvider>{children}</AuthProvider>
  </NavigationContainer>
);

describe('LoginForm', () => {
  it('renders inputs and button', () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginForm />, { wrapper: Wrapper });
    expect(getByPlaceholderText('Enter your username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByTestId('loginButton')).toBeTruthy();
  });

  it('fills and presses login', () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginForm />, { wrapper: Wrapper });
    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password');
    fireEvent.press(getByTestId('loginButton'));
    // Assert the inputs reflect values
    expect(getByPlaceholderText('Enter your username').props.value).toBe('testuser');
    expect(getByPlaceholderText('Enter your password').props.value).toBe('password');
  });

  it('can switch register/login mode', () => {
    const { getByText, getByTestId } = render(<LoginForm />, { wrapper: Wrapper });
    fireEvent.press(getByText('Switch to Register'));
    expect(getByTestId('loginButton').children[0].props.children).toBe('Register');
    fireEvent.press(getByText('Switch to Login'));
    expect(getByTestId('loginButton').children[0].props.children).toBe('Login');
  });
});
