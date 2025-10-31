/*
  90% AI
  10% Human
*/

import React from "react";
import { render, fireEvent, act, cleanup, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";
import { AuthContext } from "../../AuthContext";
import StudyTimerInterface from "../../components/StudyTimerInterface";

jest.setTimeout(40000);

const renderWithAuth = () =>
  render(
    <AuthContext.Provider
      value={{
        user: { id: 1, username: "student" },
        token: "fake-token",
        login: jest.fn(),
        logout: jest.fn(),
        loading: false,
      }}
    >
      <StudyTimerInterface />
    </AuthContext.Provider>
  );

// Centralized fetch mock that simulates both backend timer progress APIs and logging endpoints.
const setFetchMock = (overrides = {}) => {
  fetch.mockImplementation((input, options = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    const method = (options.method || "GET").toUpperCase();

    if (url.endsWith("/study/progress")) {
      if (method === "DELETE") {
        return Promise.resolve({
          ok: true,
          status: 204,
          json: async () => ({}),
          text: async () => "",
        });
      }
      const status = method === "PUT" ? 200 : overrides.progressGetStatus ?? 204;
      const body =
        method === "PUT"
          ? overrides.progressPutResponse ?? {}
          : overrides.progressGetBody ?? {};

      return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
        text: async () => JSON.stringify(body),
      });
    }

    if (url.endsWith("/study/me")) {
      const status = overrides.studyMeStatus ?? 200;
      const body = overrides.studyMeResponse ?? {};
      return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
        text: async () => JSON.stringify(body),
      });
    }

    const defaultBody = overrides.defaultResponse ?? {};
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => defaultBody,
      text: async () => JSON.stringify(defaultBody),
    });
  });
};

describe("StudyTimerInterface", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01T00:00:00Z"));
    fetch.resetMocks();
    setFetchMock();
    await AsyncStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

test("logs study session duration and timestamps when stopped", async () => {
  fetch.mockReset();
  setFetchMock({ studyMeResponse: { id: 42 } });

  const start = new Date("2025-01-15T14:00:00Z");
  jest.setSystemTime(start);

  const utils = renderWithAuth();
  await act(async () => {});
  const { getByPlaceholderText, getByTestId } = utils;

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Enter minutes (1-180)"),
        "90"
      );
    });

    await act(async () => {
      fireEvent.press(getByTestId("startTimerButton"));
    });

    const stopTime = new Date(start.getTime() + 90 * 60 * 1000);
    await act(async () => {
      jest.advanceTimersByTime(90 * 60 * 1000);
      await Promise.resolve();
    });

    await act(async () => {});
    expect(utils.getByText("Session Complete")).toBeTruthy();
    expect(utils.getByText("Start Another Session")).toBeTruthy();

  const studyCall = fetch.mock.calls.find(
    ([requestUrl, requestOptions]) =>
      typeof requestUrl === "string" &&
      requestUrl.endsWith("/study/me") &&
      (requestOptions?.method || "GET").toUpperCase() === "POST"
  );
  expect(studyCall).toBeDefined();
  const [url, options] = studyCall;
  expect(url).toBe(`${API_BASE_URL}/study/me`);
  expect(options.method).toBe("POST");
  expect(options.headers.Authorization).toBe("Bearer fake-token");

  const payload = JSON.parse(options.body);
  expect(payload.duration).toBe(90);
  expect(payload.start_time).toBe(start.toISOString());
  expect(payload.end_time).toBe(stopTime.toISOString());
  expect(utils.getByText("Session Complete")).toBeTruthy();
  expect(utils.getByText("Start Another Session")).toBeTruthy();

});

test("continues timing while app is closed and resumes on reopen", async () => {
  fetch.mockReset();
  setFetchMock();

  const start = new Date("2025-02-01T08:00:00Z");
  jest.setSystemTime(start);

  const firstRender = renderWithAuth();
  await act(async () => {});

    await act(async () => {
      fireEvent.changeText(
        firstRender.getByPlaceholderText("Enter minutes (1-180)"),
        "120"
      );
    });

    await act(async () => {
      fireEvent.press(firstRender.getByTestId("startTimerButton"));
    });

    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
    });

    firstRender.unmount();

    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
    });

    const reopened = renderWithAuth();
    await act(async () => {});
    expect(reopened.getByTestId("timerDisplay").props.children).toBe("01:00:00");

  reopened.unmount();
});

test("progress marker tracks elapsed ratio", async () => {
  fetch.mockReset();
  setFetchMock();

  const start = new Date("2025-03-10T10:00:00Z");
  jest.setSystemTime(start);

  const { getByPlaceholderText, getByTestId } = renderWithAuth();
  await act(async () => {});

  await act(async () => {
    fireEvent.changeText(getByPlaceholderText("Enter minutes (1-180)"), "60");
  });

  await act(async () => {
    fireEvent.press(getByTestId("startTimerButton"));
  });

  const circleDiameter = 220;
  const circleRadius = circleDiameter / 2 - 12;
  const markerSize = 16;

  let elapsedMsTotal = 0;
  const validateMarker = async (elapsedMinutes, expectedProgress) => {
    const targetMs = elapsedMinutes * 60 * 1000;
    const delta = targetMs - elapsedMsTotal;
    await act(async () => {
      jest.advanceTimersByTime(delta);
    });
    elapsedMsTotal = targetMs;

    const timerLabel = getByTestId("timerDisplay").props.children;
    const expectedSeconds = Math.min(targetMs / 1000, 60 * 60);
    const expectedLabel = [
      Math.floor(expectedSeconds / 3600),
      Math.floor((expectedSeconds % 3600) / 60),
      expectedSeconds % 60,
    ]
      .map((unit) => unit.toString().padStart(2, "0"))
      .join(":");
    expect(timerLabel).toBe(expectedLabel);

    const marker = getByTestId("timerMarker");
    const markerStyle = Array.isArray(marker.props.style)
      ? marker.props.style.reduce(
          (acc, entry) => (entry ? { ...acc, ...entry } : acc),
          {}
        )
      : marker.props.style;
    const { top, left } = markerStyle;

    const expectedAngle = expectedProgress * 2 * Math.PI - Math.PI / 2;
    const expectedX =
      circleRadius * Math.cos(expectedAngle) + circleDiameter / 2 - markerSize / 2;
    const expectedY =
      circleRadius * Math.sin(expectedAngle) + circleDiameter / 2 - markerSize / 2;
    expect(Math.abs(left - expectedX)).toBeLessThan(2);
    expect(Math.abs(top - expectedY)).toBeLessThan(2);
  };

  await validateMarker(15, 0.25);
  await validateMarker(30, 0.5);
  await validateMarker(60, 1);
});
});
