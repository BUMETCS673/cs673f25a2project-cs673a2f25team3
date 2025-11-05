/*
  100% AI generate
*/
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import GameMenu from '../../screens/GameMenu';

const Wrapper = ({ children }) => <NavigationContainer>{children}</NavigationContainer>;

describe('GameMenu', () => {
  test('renders menu with game buttons', () => {
    const { getByText } = render(<GameMenu />, { wrapper: Wrapper });
    expect(getByText('Game 1')).toBeTruthy();
    expect(getByText('Game 2')).toBeTruthy();
    expect(getByText('Return Home')).toBeTruthy();
  });
});
