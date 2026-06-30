import { useEffect, useState } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";

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
      const response = await fetch(
        "https://ca-trackr.salmontree-f4468a82.swedencentral.azurecontainerapps.io/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim(),
            selectedRole: 1, // TODO: skal laves så den henter den aktive
          }),
        },
      );

      if (response.ok) {
        const authHeader = response.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.substring(7);
          setAccessToken(token);
          setPassword("");
          navigate("/Home");
        }
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || "En fejl skete under login.";
        setError(errorMessage);
      }
    } catch (error) {
      setError(
        `${error.message || error} - Kunne ikke oprette forbindelse til serveren.`,
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <div className="login-group">
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
          <div className="login-group">
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
          {error && <div className="error-message">{error}</div>}

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
