/*
  global fetchMock 
*/

/*
  100% AI generate
*/

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../../AuthContext';
import LoginForm from '../../components/LoginForm';
const Stack = createNativeStackNavigator();

const HomeScreen = () => <Text testID="home-screen">Home Screen</Text>;

const StackNavigator = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName="Login">
      {!user ? (
        <Stack.Screen name="Login" component={LoginForm} />
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
};

const TestAuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);

  const login = async (userData) => {
    setUser(userData);
  };

  const value = React.useMemo(
    () => ({
      user,
      token: null,
      login,
      logout: jest.fn(),
      loading: false,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const AppWithNavigation = () => (
  <NavigationContainer>
    <TestAuthProvider>
      <StackNavigator />
    </TestAuthProvider>
  </NavigationContainer>
);

describe('LoginForm', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders login form correctly', async () => {
    const { getByPlaceholderText, getByTestId } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByPlaceholderText('Username')).toBeTruthy());
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByTestId('loginButton')).toBeTruthy();
  });

  test('login updates context and navigates', async () => {
    const { getByPlaceholderText, getByTestId, findByTestId } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByPlaceholderText('Username')).toBeTruthy());

    fetchMock.mockResponseOnce(
      JSON.stringify({
        message: 'Login successful',
        user: { username: 'testuser' },
        token: 'fake-token'
      })
    );

    // input user name and password
    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Password'), '$Password123');

    await act(async () => {
      fireEvent.press(getByTestId('loginButton'));
    });

    // Home screen should render once user is set in AuthContext
    await findByTestId('home-screen');
  });

  test('switches to register mode', async () => {
    const { getByText, getByTestId } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByTestId('loginButton')).toBeTruthy());

    // change to register
    await act(async () => {
      fireEvent.press(getByText('Switch to Register'));
    });

    // check button text 'Register'
    expect(getByTestId('loginButton').children[0].props.children).toBe('Register');

    // go back to login mode
    await act(async () => {
      fireEvent.press(getByText('Switch to Login'));
    });

    expect(getByTestId('loginButton').children[0].props.children).toBe('Login');
  });
});
