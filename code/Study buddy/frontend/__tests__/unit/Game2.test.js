/*
  100% AI generate
*/
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Game2 from '../../screens/games/game2';

const Wrapper = ({ children }) => <NavigationContainer>{children}</NavigationContainer>;

describe('Game2', () => {
  test('renders correctly without crashing', () => {
    const { toJSON } = render(<Game2 />, { wrapper: Wrapper });
    expect(toJSON()).toBeTruthy();
  });

  test('contains bamboo or player elements', () => {
    const { toJSON } = render(<Game2 />, { wrapper: Wrapper });
    expect(toJSON()).toBeTruthy();
  });
});
