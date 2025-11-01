/**
 * Use jsdom because we import react-dom's hook utilities,
 * but rely on RN mocks from jest.setup.js.
 * @jest-environment jsdom
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../AuthContext'; // root-level file
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides default values', () => {
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('login sets user and token and persists', async () => {
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });
    await act(async () => {
      await result.current.login({ username: 'testuser' }, 'fake-token');
    });
    expect(result.current.user).toEqual({ username: 'testuser' });
    expect(result.current.token).toBe('fake-token');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ username: 'testuser' }));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
  });

  it('logout clears user and token and storage', async () => {
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });
    await act(async () => {
      await result.current.login({ username: 'testuser' }, 'fake-token');
    });
    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
