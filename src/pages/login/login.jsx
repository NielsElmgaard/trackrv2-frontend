import { useEffect, useState } from "react";
import "./login.css";
import useNavigate from "../../components/navigation/useNavigate.jsx";
import Link from "../../components/navigation/Link.jsx";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { axiosInstance } from "../../utils";

function Login({ setAccessToken }) {
  const [username, setUsername] = useState(() => {
    const saved = localStorage.getItem("username");
    return saved ? JSON.parse(saved) : "";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", JSON.stringify(username));
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Indtast venligst et gyldigt brugernavn og password");
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await axiosInstance.post("/v1/auth/login", {
        username: username.trim(),
        password: password.trim(),
        selectedRole: 1, // TODO: skal laves så den henter den aktive
      });

      const authHeader =
        response.headers["authorization"] || response.headers["Authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        setAccessToken(token);
        setPassword("");
        navigate("/Home");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.message || error;
      setError(`${errorMessage} - Fejl under login`);
    } finally {
      setIsLoggingIn(false);
    }
  }

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setError("");
  };

  return (
    <div className="login-container">
      <div className="custom-form">
        <form onSubmit={handleLogin}>
          <div className="custom-form-group">
            <label htmlFor="username">Brugernavn</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Indtast brugernavn"
              disabled={isLoggingIn}
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="password">Adgangskode </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Indtast adgangskode"
              disabled={isLoggingIn}
            />
          </div>

          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Vent venligst..." : "Log ind"}
          </button>

          <Snackbar
            open={!!error}
            autoHideDuration={5000}
            onClose={handleCloseToast}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            {error ? (
              <Alert
                variant="filled"
                severity="error"
                onClose={handleCloseToast}
                sx={{ width: "100%" }}
              >
                {error}
              </Alert>
            ) : undefined}
          </Snackbar>

          <div className="sign-up-link">
            <Link to="/signup">
              <span>Opret bruger</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
