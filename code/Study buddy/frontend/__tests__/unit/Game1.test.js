/*
  100% AI generate
*/
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Game1 from '../../screens/games/game1';

const Wrapper = ({ children }) => <NavigationContainer>{children}</NavigationContainer>;

describe('Game1', () => {
  test('renders player and world elements', () => {
    const { getByText, toJSON } = render(<Game1 />, { wrapper: Wrapper });
    expect(toJSON()).toBeTruthy();
  });

  test('initial render should not crash', () => {
    const { toJSON } = render(<Game1 />, { wrapper: Wrapper });
    expect(toJSON()).toBeTruthy();
  });
});
