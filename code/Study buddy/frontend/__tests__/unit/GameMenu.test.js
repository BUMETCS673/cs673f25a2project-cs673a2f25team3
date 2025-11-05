/*
  100% AI generated (adjusted for multiple matching elements)
*/
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import GameMenu from '../../screens/GameMenu';

const Wrapper = ({ children }) => <NavigationContainer>{children}</NavigationContainer>;

describe('GameMenu', () => {
  test('renders menu with game buttons', () => {
    const { getAllByText } = render(<GameMenu />, { wrapper: Wrapper });

    expect(getAllByText('Game 1').length).toBeGreaterThan(0);
    expect(getAllByText('Game 2').length).toBeGreaterThan(0);
    expect(getAllByText('Return Home').length).toBeGreaterThan(0);
  });
});
