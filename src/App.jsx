import { Routes, Route, HashRouter } from "react-router-dom";
import Navigate from "./components/navigation/Navigate.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { axiosInstance, setTokenInMemory } from "./utils.js";
import Header from "./components/header/Header.jsx";

import "./App.css";

import Login from "./pages/login/login.jsx";
import HomeScreen from "./pages/home-screen/home-screen.jsx";
import SignUpScreen from "./pages/sign-up-screen/SignUpScreen.jsx";
import TrackersScreen from "./pages/trackers-screen/trackers-screen.jsx";
import SettingsScreen from "./pages/settings-screen/SettingsScreen.jsx";
import Tracker from "./pages/tracker/Tracker.jsx";
import TrackerHistory from "./pages/tracker-history/TrackerHistory.jsx";
import TrackerHistoryChart from "./pages/tracker-history-chart/TrackerHistoryChart.jsx";

import NotFound from "./pages/not-found/not-found.jsx";
import ProtectedRoute from "./components/route/protected-route.jsx";

import { useCallback, useEffect, useState, useRef } from "react";
import BackButton from "./components/navigation/BackButton.jsx";
const queryClient = new QueryClient();

function App() {
  const [error, setError] = useState("");

  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshPromiseRef = useRef(null);
  const loggedOutRef = useRef(false);

  const refreshAccessToken = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }
    const runRefresh = async () => {
      const savedUsername = localStorage.getItem("username");

      if (!savedUsername) {
        setAccessToken(null);
        setTokenInMemory(null);
        return null;
      }

      try {
        const username = savedUsername ? JSON.parse(savedUsername) : "";

        const response = await axiosInstance.post("/v1/auth/refresh", {
          username: username,
          refreshToken: "",
          selectedRole: null,
        });

        const authHeader =
          response.headers["authorization"] ||
          response.headers["Authorization"];
        if (authHeader?.startsWith("Bearer ")) {
          const token = authHeader.substring(7);
          if (!loggedOutRef.current) {
            setAccessToken(token);
            setTokenInMemory(token);
          }
          return token;
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.detail || error.message || error;
        setError(`${errorMessage} - Fejl under token refresh`);
      } finally {
        refreshPromiseRef.current = null;
      }

      setAccessToken(null);
      setTokenInMemory(null);
      return null;
    };

    refreshPromiseRef.current = runRefresh();

    return refreshPromiseRef.current;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshAccessToken();
      setLoading(false);
    };
    initializeAuth();
  }, [refreshAccessToken]);

  async function handleLogout() {
    loggedOutRef.current = true;
    try {
      const response = await axiosInstance.post("/v1/auth/logout");
    } catch (error) {
      const logoutError =
        error.response?.data?.detail || error.message || error;
      setError(`${logoutError} - Fejl under logout`);
    } finally {
      setAccessToken(null);
      setTokenInMemory(null);
      localStorage.removeItem("username");
      queryClient.clear();
    }
  }

  const handleLoginSuccess = (token) => {
    setAccessToken(token);
    setTokenInMemory(token);
    loggedOutRef.current = false;
  };

  // Logged in
  const isLoggedIn = !!accessToken;

  if (loading) {
    return (
      <div className="loading-screen-container">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <div className="app-container">
            <Header onLogout={handleLogout} isLoggedIn={isLoggedIn} />
            <main className="content">
              {isLoggedIn ? (
                <div className="go-back">
                  <BackButton />
                </div>
              ) : (
                <></>
              )}

              <Routes>
                <Route
                  path="/"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/Home" />
                    ) : (
                      <Login setAccessToken={handleLoginSuccess} />
                    )
                  }
                />
                <Route
                  path="/signup"
                  element={
                    isLoggedIn ? <Navigate to="/Home" /> : <SignUpScreen />
                  }
                />

                <Route element={<ProtectedRoute accessToken={accessToken} />}>
                  <Route
                    path="/Home"
                    element={<HomeScreen accessToken={accessToken} />}
                  />
                  <Route
                    path="/Trackers"
                    element={<TrackersScreen accessToken={accessToken} />}
                  />
                  <Route
                    path="/Settings"
                    element={<SettingsScreen accessToken={accessToken} />}
                  />
                  <Route
                    path="/Tracker"
                    element={<Tracker accessToken={accessToken} />}
                  />
                  <Route
                    path="/TrackerHistory"
                    element={<TrackerHistory accessToken={accessToken} />}
                  />
                  <Route
                    path="/TrackerHistoryChart"
                    element={<TrackerHistoryChart accessToken={accessToken} />}
                  />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
