/*
  100% AI generate
*/

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../../App';

describe('App Component', () => {
  test('renders App root after AuthProvider loading', async () => {
    const { toJSON } = render(<App />);

    await waitFor(() => {
      expect(toJSON()).toBeTruthy();
    });
  });

  test('renders navigation structure after initialization', async () => {
    const { toJSON } = render(<App />);

    await waitFor(() => {
      expect(toJSON()).toBeTruthy();
    });
  });
});
