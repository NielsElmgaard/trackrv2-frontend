import { Link } from "react-router-dom";
import "./SignUpForm.css";

function SignUpForm({
  handleSignUp,
  username,
  setUsername,
  password,
  setPassword,
  firstName,
  setFirstName,
  middleName,
  setMiddleName,
  lastName,
  setLastName,
  nationality,
  setNationality,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  isSubmitting,
  error,
}) {
  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="login-link">
          <p>Allerede bruger?</p>
          <Link to="/">
            <span>Login</span>
          </Link>
        </div>
        <form onSubmit={handleSignUp}>
          <div className="signup-group">
            <label htmlFor="username">Brugernavn</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Indtast brugernavn"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="password">Adgangskode </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Indtast adgangskode"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="firstName">Fornavn</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Indtast fornavn"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="middleName">Mellemnavn</label>
            <input
              id="middleName"
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Indtast mellemnavn"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="lastName">Efternavn</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Indtast efternavn"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="nationality">Nationalitet</label>
            <input
              id="nationality"
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="Indtast nationalitet"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Indtast e-mail"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="phoneNumber">Telefonnummer (+45)</label>
            <input
              id="phoneNumber"
              type="number"
              value={phoneNumber}
              onChange={(e) => {
                const eightDigits = e.target.value.slice(0, 8);
                setPhoneNumber(eightDigits);
              }}
              placeholder="Indtast telefonnummer"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Vent venligst..." : "Opret bruger"}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
