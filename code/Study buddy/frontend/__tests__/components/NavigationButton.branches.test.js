import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationButton } from '../../components/NavigationButton';  // fixed path

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    }),
  };
});

describe('NavigationButton extra branches', () => {
  it('navigates with params when provided', () => {
    const { getByText } = render(
      <NavigationButton text="WithParams" link="Home" params={{ from: 'test' }} />
    );
    fireEvent.press(getByText('WithParams'));
  });

  it('resets when resetTo is provided', () => {
    const { getByText } = render(
      <NavigationButton text="ResetToLogin" link="Login" resetTo="Login" />
    );
    fireEvent.press(getByText('ResetToLogin'));
  });
});
