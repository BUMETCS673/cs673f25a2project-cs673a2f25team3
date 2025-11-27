/*
  100% AI generate + FIXED for AuthContext
*/
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import GameMenu from '../../screens/GameMenu';
import { AuthContext } from '../../AuthContext';

// Mock Auth Context Value
const mockAuth = {
  gameTimeRemaining: 600, // 10 minutes unlocked
  setGameTimeRemaining: jest.fn(),
};

const Wrapper = ({ children }) => (
  <AuthContext.Provider value={mockAuth}>
    <NavigationContainer>{children}</NavigationContainer>
  </AuthContext.Provider>
);

describe('GameMenu', () => {
  test('renders menu with game buttons', () => {
    const { getAllByText } = render(<GameMenu />, { wrapper: Wrapper });

    expect(getAllByText('Game 1').length).toBeGreaterThan(0);
    expect(getAllByText('Game 2').length).toBeGreaterThan(0);
    expect(getAllByText('Game 3').length).toBeGreaterThan(0);
  });
});
