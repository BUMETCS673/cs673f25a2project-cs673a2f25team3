import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationButton } from '../components/NavigationButton';
import { NavigationContainer } from '@react-navigation/native';

describe('NavigationButton', () => {
  const Wrapper = ({ children }) => <NavigationContainer>{children}</NavigationContainer>;
  it('renders label', () => {
    const { getByText } = render(<NavigationButton text="Go Home" link="Home" />, { wrapper: Wrapper });
    expect(getByText('Go Home')).toBeTruthy();
  });
});
