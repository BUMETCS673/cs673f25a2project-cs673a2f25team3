/*
  80% Human
  20% AI helper
*/

import React from 'react';
import { render } from '@testing-library/react-native';
import LoginForm from '../../components/LoginForm';
import { AuthProvider } from '../../AuthContext';

// 简单 mock @env，防止 API_BASE_URL 导致组件崩溃
jest.mock('@env', () => ({
  API_BASE_URL: 'http://localhost:3000',
}));

// 简单 mock useNavigation，避免 “Couldn't find a navigation object”
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      reset: jest.fn(),
    }),
  };
});

describe('LoginForm', () => {
  it('renders username, password and login button', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByTestId('loginButton')).toBeTruthy();
  });
});
