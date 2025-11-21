/**
 * @jest-environment jsdom
 */

import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../../AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
  100% AI generate
*/


jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Helper function to create a fake JWT token with a valid structure and future expiration
const createFakeValidToken = () => {
  // Create header (base64 encoded)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  
  // Create payload with expiration 1 hour from now
  const payload = {
    id: 1,
    username: "testuser",
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  };
  const encodedPayload = btoa(JSON.stringify(payload));
  
  // Fake signature
  const signature = btoa("fake-signature");
  
  return `${header}.${encodedPayload}.${signature}`;
};

describe("AuthContext", () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
    AsyncStorage.removeItem.mockClear();
  });

  it("provides default values", async () => {
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("login sets user and token", async () => {
    const fakeToken = createFakeValidToken();
    const { result, waitForNextUpdate } = renderHook(
      () => React.useContext(AuthContext),
      { wrapper: AuthProvider }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login({ username: "testuser" }, fakeToken);
    });

    expect(result.current.user).toEqual({ username: "testuser" });
    expect(result.current.token).toBe(fakeToken);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify({ username: "testuser" })
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("token", fakeToken);
  });

  it("logout clears user and token", async () => {
    const fakeToken = createFakeValidToken();
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login({ username: "testuser" }, fakeToken);
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
