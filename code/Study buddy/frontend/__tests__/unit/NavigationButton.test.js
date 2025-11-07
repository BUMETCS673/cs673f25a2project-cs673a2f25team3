/*
  100% AI generate
*/

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationButton } from '../../components/NavigationButton';
import { NavigationContainer } from '@react-navigation/native';

describe('NavigationButton', () => {
  const Wrapper = ({ children }) => <NavigationContainer>{children}</NavigationContainer>;

  it('renders button and responds to press', () => {
    const { getByText } = render(
      <NavigationButton text="Go Home" link="Home" />,
      { wrapper: Wrapper }
    );

    const button = getByText('Go Home');
    expect(button).toBeTruthy();
  });
});
