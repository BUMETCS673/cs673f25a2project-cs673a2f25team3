/**
 * @jest-environment jsdom
 */

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../../AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("AuthContext", () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
    AsyncStorage.removeItem.mockClear();
  });

  it("provides default values", () => {
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it("login sets user and token", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => React.useContext(AuthContext),
      { wrapper: AuthProvider }
    );

    await act(async () => {
      await result.current.login({ username: "testuser" }, "fake-token");
    });

    expect(result.current.user).toEqual({ username: "testuser" });
    expect(result.current.token).toBe("fake-token");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify({ username: "testuser" })
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("token", "fake-token");
  });

  it("logout clears user and token", async () => {
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login({ username: "testuser" }, "fake-token");
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("user");
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("token");
  });
});
