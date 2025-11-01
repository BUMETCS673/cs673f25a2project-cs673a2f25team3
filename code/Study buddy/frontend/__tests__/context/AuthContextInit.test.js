/**
 * @jest-environment jsdom
 */
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../../AuthContext'; // fixed path
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('AuthContext init (no act warnings)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    AsyncStorage.getItem.mockResolvedValueOnce(null);
  });

  it('loading becomes false after init', async () => {
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
