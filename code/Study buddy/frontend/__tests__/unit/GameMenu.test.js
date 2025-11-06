/*
  100% AI generate
*/
<<<<<<< HEAD
=======

>>>>>>> origin/develop
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import GameMenu from '../../screens/GameMenu';

<<<<<<< HEAD
const Wrapper = ({ children }) => <NavigationContainer>{children}</NavigationContainer>;

describe('GameMenu', () => {
  test('renders menu with game buttons', () => {
    const { getByText } = render(<GameMenu />, { wrapper: Wrapper });
    expect(getByText('Game 1')).toBeTruthy();
    expect(getByText('Game 2')).toBeTruthy();
    expect(getByText('Return Home')).toBeTruthy();
=======
const Wrapper = ({ children }) => (
  <NavigationContainer>{children}</NavigationContainer>
);

describe('GameMenu', () => {
  test('renders menu with game buttons', () => {
    const { getAllByText } = render(<GameMenu />, { wrapper: Wrapper });

    expect(getAllByText('Game 1').length).toBeGreaterThan(0);
    expect(getAllByText('Game 2').length).toBeGreaterThan(0);
    expect(getAllByText('Game 3').length).toBeGreaterThan(0);
>>>>>>> origin/develop
  });
});
