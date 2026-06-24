import { Routes, Route, HashRouter, Navigate } from "react-router-dom";

import "./App.css";
import Login from "./components/login/login.jsx";
import HomeScreen from "./pages/home-screen/home-screen.jsx";
import TrackersScreen from "./pages/trackers-screen/trackers-screen.jsx";
import NotFound from "./pages/not-found/not-found.jsx";
import ProtectedRoute from "./components/route/protected-route.jsx";
import { useCallback, useEffect, useState, useRef } from "react";

function App() {
  const [error, setError] = useState("");

  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshPromiseRef = useRef(null);

  const refreshAccessToken = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }
    const runRefresh = async () => {
      try {
        const savedUsername = localStorage.getItem("username");
        const username = savedUsername ? JSON.parse(savedUsername) : "";

        const response = await fetch(
          "https://trackrv2-api.onrender.com/api/v1/auth/refresh",
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
          if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            setAccessToken(token);
            return token;
          }
        }
      } catch (error) {
        setError(`${error.message || error} - Fejl under token refresh`);
      } finally {
        refreshPromiseRef.current = null;
      }

      setAccessToken(null);
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
    try {
      await fetch("https://trackrv2-api.onrender.com/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Fejl under logout:", error);
    } finally {
      setAccessToken(null);
      localStorage.removeItem("username");
    }
  }

  // Logged in
  const isLoggedIn = !!accessToken;

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Indlæser...</div>
    );
  }

  return (
    <>
      <HashRouter>
        <div className="app-container">
          <main className="content">
            <Routes>
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/Home" />
                  ) : (
                    <Login setAccessToken={setAccessToken} />
                  )
                }
              />

              <Route element={<ProtectedRoute accessToken={accessToken} />}>
                <Route
                  path="/Home"
                  element={
                    <HomeScreen
                      onLogout={handleLogout}
                      accessToken={accessToken}
                    />
                  }
                />
                <Route
                  path="/Trackers"
                  element={
                    <TrackersScreen
                      onLogout={handleLogout}
                      accessToken={accessToken}
                    />
                  }
                />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </>
  );
}

export default App;
