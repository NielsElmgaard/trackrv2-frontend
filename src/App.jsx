import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setTokenInMemory } from "./utils.js";
import Header from "./components/header/Header.jsx";

import "./App.css";

import Login from "./pages/login/login.jsx";
import HomeScreen from "./pages/home-screen/home-screen.jsx";
import SignUpScreen from "./pages/sign-up-screen/SignUpScreen.jsx";
import TrackersScreen from "./pages/trackers-screen/trackers-screen.jsx";
import SettingsScreen from "./pages/settings-screen/SettingsScreen.jsx";
import Tracker from "./pages/tracker/Tracker.jsx";
import TrackerHistory from "./pages/tracker-history/TrackerHistory.jsx";

import NotFound from "./pages/not-found/not-found.jsx";
import ProtectedRoute from "./components/route/protected-route.jsx";

import { useCallback, useEffect, useState, useRef } from "react";
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

        const response = await fetch(
          "https://ca-trackr.salmontree-f4468a82.swedencentral.azurecontainerapps.io/api/v1/auth/refresh",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              refreshToken: "",
              selectedRole: null,
            }),
          },
        );
        if (response.ok) {
          const authHeader = response.headers.get("Authorization");
          if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            if (!loggedOutRef.current) {
              setAccessToken(token);
              setTokenInMemory(token);
            }
            return token;
          }
        }
      } catch (error) {
        setError(`${error.message || error} - Fejl under token refresh`);
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
      await fetch("https://ca-trackr.salmontree-f4468a82.swedencentral.azurecontainerapps.io/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Fejl under logout:", error);
    } finally {
      setAccessToken(null);
      setTokenInMemory(null);
      localStorage.removeItem("username");
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
      <div style={{ padding: "20px", textAlign: "center" }}>Indlæser...</div>
    );
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <div className="app-container">
            <Header onLogout={handleLogout} isLoggedIn={isLoggedIn} />
            <main className="content">
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
