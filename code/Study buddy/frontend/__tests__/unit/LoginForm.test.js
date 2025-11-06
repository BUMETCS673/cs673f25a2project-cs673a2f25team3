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
import { AuthProvider } from '../../AuthContext';
import LoginForm from '../../components/LoginForm';

// 👇 新增：确保没有“已登录”的持久化状态
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const HomeScreen = () => <Text testID="home-screen">Home Screen</Text>;

const AppWithNavigation = () => (
  <NavigationContainer>
    <AuthProvider>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </AuthProvider>
  </NavigationContainer>
);

describe('LoginForm', () => {
  beforeEach(() => {
    // 登录相关接口的 fetch mock
    fetchMock.resetMocks();
    // 👇 关键：让 AuthProvider 初始化时拿不到 token
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders login form correctly', async () => {
    const { getByPlaceholderText, getByTestId } = render(<AppWithNavigation />);

    // 等待登录页出现（没有 token 就不会跳 Home）
    await waitFor(() => {
      expect(getByTestId('loginButton')).toBeTruthy();
    });

    expect(getByPlaceholderText('Enter your username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  test('login updates context and navigates', async () => {
    const { getByPlaceholderText, getByTestId, queryByPlaceholderText, findByTestId } = render(<AppWithNavigation />);

    await waitFor(() => {
      expect(getByTestId('loginButton')).toBeTruthy();
    });

    fetchMock.mockResponseOnce(
      JSON.stringify({
        message: 'Login successful',
        user: { username: 'testuser' },
        token: 'fake-token'
      })
    );

    // 输入用户名、密码并点击登录
    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password');

    await act(async () => {
      fireEvent.press(getByTestId('loginButton'));
    });

    // 登录后应离开登录页，并出现 Home
    await waitFor(() => expect(queryByPlaceholderText('Enter your username')).toBeNull());
    await findByTestId('home-screen');
  });

  test('switches to register mode', async () => {
    const { getByText, getByTestId } = render(<AppWithNavigation />);

    await waitFor(() => {
      expect(getByTestId('loginButton')).toBeTruthy();
    });

    // 切换到注册
    await act(async () => {
      fireEvent.press(getByText('Switch to Register'));
    });

    expect(getByTestId('loginButton').children[0].props.children).toBe('Register');

    // 再切回登录
    await act(async () => {
      fireEvent.press(getByText('Switch to Login'));
    });

    expect(getByTestId('loginButton').children[0].props.children).toBe('Login');
  });
});
