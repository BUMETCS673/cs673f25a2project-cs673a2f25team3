/*
  100% AI generate
*/

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../../AuthContext';
import Home from '../../screens/Home';

const Stack = createNativeStackNavigator();

const LoginScreen = () => null;

const TestAuthProvider = ({ children }) => {
  const [user, setUser] = React.useState({ username: 'testuser' });

  const value = React.useMemo(
    () => ({
      user,
      token: 'fake-token',
      studyData: null,
      fetchStudyBuddyData: jest.fn(),
      logout: () => setUser(null),
      loading: false,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const StackNavigator = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName="Home">
      {user ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

const AppWithNavigation = () => (
  <NavigationContainer>
    <TestAuthProvider>
      <StackNavigator />
    </TestAuthProvider>
  </NavigationContainer>
);

describe('Home Screen', () => {
  test('renders correctly', async () => {
    const { getByText } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByText('Home')).toBeTruthy());
    expect(getByText('Logout')).toBeTruthy();
  });

  test('logout works', async () => {
    const { getByText, queryByText } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByText('Home')).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByText('Logout'));
    });

    await waitFor(() => expect(queryByText('Home')).toBeNull());
  });
});
