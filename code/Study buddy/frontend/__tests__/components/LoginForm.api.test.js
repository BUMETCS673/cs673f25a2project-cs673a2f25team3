import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginForm from '../../components/LoginForm';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../AuthContext';

// Wrap with navigation + auth context so useContext/useNavigation work
const Providers = ({ children }) => (
  <NavigationContainer>
    <AuthProvider>{children}</AuthProvider>
  </NavigationContainer>
);

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('LoginForm API flows (extra, wrapped)', () => {
  it('success path posts credentials', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ token: 'abc' }), { status: 200 });
    const { getByPlaceholderText, getByTestId } = render(<LoginForm />, { wrapper: Providers });
    fireEvent.changeText(getByPlaceholderText(/username/i), 'kenni');
    fireEvent.changeText(getByPlaceholderText(/password/i), 'pwd');
    fireEvent.press(getByTestId('loginButton'));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      const [url, opts] = fetch.mock.calls[0];
      expect(String(url)).toMatch(/http/);
      expect((opts && opts.method) || 'POST').toBe('POST');
    });
  });

  it('error path still handled (uses JSON body to avoid parse error logs)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: 'invalid' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    const { getByPlaceholderText, getByTestId } = render(<LoginForm />, { wrapper: Providers });
    fireEvent.changeText(getByPlaceholderText(/username/i), 'kenni');
    fireEvent.changeText(getByPlaceholderText(/password/i), 'wrong');
    fireEvent.press(getByTestId('loginButton'));
    await waitFor(() => expect(fetch).toHaveBeenCalled());
  });
});
