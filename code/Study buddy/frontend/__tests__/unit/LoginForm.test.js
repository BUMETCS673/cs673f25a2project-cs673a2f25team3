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
<<<<<<< HEAD
import { AuthContext } from '../../AuthContext';
=======
import { AuthProvider } from '../../AuthContext';
>>>>>>> main
import LoginForm from '../../components/LoginForm';
const Stack = createNativeStackNavigator();

const HomeScreen = () => <Text testID="home-screen">Home Screen</Text>;

<<<<<<< HEAD
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
=======
const AppWithNavigation = () => (
  <NavigationContainer>
    <AuthProvider>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </AuthProvider>
>>>>>>> main
  </NavigationContainer>
);

describe('LoginForm', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders login form correctly', async () => {
    const { getByPlaceholderText, getByTestId } = render(<AppWithNavigation />);

<<<<<<< HEAD
    await waitFor(() => expect(getByPlaceholderText('Username')).toBeTruthy());
    expect(getByPlaceholderText('Password')).toBeTruthy();
=======
    await waitFor(() => expect(getByPlaceholderText('Enter your username')).toBeTruthy());
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
>>>>>>> main
    expect(getByTestId('loginButton')).toBeTruthy();
  });

  test('login updates context and navigates', async () => {
<<<<<<< HEAD
    const { getByPlaceholderText, getByTestId, findByTestId } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByPlaceholderText('Username')).toBeTruthy());
=======
    const { getByPlaceholderText, getByTestId, queryByPlaceholderText, findByTestId } = render(<AppWithNavigation />);

    await waitFor(() => expect(getByPlaceholderText('Enter your username')).toBeTruthy());
>>>>>>> main

    fetchMock.mockResponseOnce(
      JSON.stringify({
        message: 'Login successful',
        user: { username: 'testuser' },
        token: 'fake-token'
      })
    );

    // input user name and password
<<<<<<< HEAD
    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Password'), '$Password123');
=======
    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password');
>>>>>>> main

    await act(async () => {
      fireEvent.press(getByTestId('loginButton'));
    });

<<<<<<< HEAD
    // Home screen should render once user is set in AuthContext
=======
    await waitFor(() => expect(queryByPlaceholderText('Enter your username')).toBeNull());
>>>>>>> main
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
