import { useEffect, useState } from "react";
import "./SettingsScreen.css";
import { useNavigate, Link } from "react-router-dom";
import useFetchUser from "../../hooks/useFetchUser.js";
import { axiosInstance } from "../../utils.js";

function SettingsScreen() {
  const { isPending, data: userDetails, fetchError } = useFetchUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [profileInfo, setProfileInfo] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordInfo, setPasswordInfo] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username || "");
      setFirstName(userDetails.firstName || "");
      setMiddleName(userDetails.middleName || "");
      setLastName(userDetails.lastName || "");
      setNationality(userDetails.nationality || "");
      setEmail(userDetails.email || "");
      setPhoneNumber(userDetails.phoneNumber || "");
    }
  }, [userDetails]);

  async function handleUpdateUserInfo(e) {
    e.preventDefault();
    setProfileError("");
    setProfileInfo("");
    if (!username || !firstName || !lastName || !email || !phoneNumber) {
      setProfileError(
        "Indtast venligst alle felter (mellemnavn og nationalitet undtaget)",
      );
      return;
    }
    setIsSubmittingProfile(true);

    try {
      const response = await axiosInstance.put("/v1/users", {
        username: username.trim(),
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        nationality: nationality.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber,
      });

      setProfileInfo("Profil opdateret succesfuldt!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        "En fejl skete under opdatering af brugeroplysninger.";
      setProfileError(errorMessage);
      setProfileInfo("");
    } finally {
      setIsSubmittingProfile(false);
    }
  }

  async function handleUpdateUserPassword(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordInfo("");
    if (!password) {
      setPasswordError("Indtast venligst adgangskode");
      return;
    }
    setIsSubmittingPassword(true);

    try {
      const response = await axiosInstance.put("/v1/users/password", {
        password: password.trim(),
      });

      setPasswordInfo("Adgangskode opdateret succesfuldt!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        "En fejl skete under opdatering af brugers adgangskode.";
      setPasswordError(errorMessage);
      setPasswordInfo("");
    } finally {
      setIsSubmittingPassword(false);
    }
  }
  if (isPending)
    return <div className="loading">Henter dine profiloplysninger...</div>;
  if (fetchError)
    return (
      <div className="error-message">Kunne ikke hente profiloplysninger.</div>
    );
  return (
    <div className="update-userinfo-container">
      <div className="update-userinfo-form">
        <form onSubmit={handleUpdateUserInfo}>
          <div className="update-userinfo-group">
            <label htmlFor="username">Brugernavn</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Indtast brugernavn"
              disabled={isSubmittingProfile}
            />
          </div>
          <div className="update-userinfo-group">
            <label htmlFor="firstName">Fornavn</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Indtast fornavn"
              disabled={isSubmittingProfile}
            />
          </div>
          <div className="update-userinfo-group">
            <label htmlFor="middleName">Mellemnavn</label>
            <input
              id="middleName"
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Indtast mellemnavn"
              disabled={isSubmittingProfile}
            />
          </div>
          <div className="update-userinfo-group">
            <label htmlFor="lastName">Efternavn</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Indtast efternavn"
              disabled={isSubmittingProfile}
            />
          </div>
          <div className="update-userinfo-group">
            <label htmlFor="nationality">Nationalitet</label>
            <input
              id="nationality"
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="Indtast nationalitet"
              disabled={isSubmittingProfile}
            />
          </div>
          <div className="update-userinfo-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Indtast e-mail"
              disabled={isSubmittingProfile}
            />
          </div>
          <div className="update-userinfo-group">
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
              disabled={isSubmittingProfile}
            />
          </div>

          <button type="submit" disabled={isSubmittingProfile}>
            {isSubmittingProfile ? "Vent venligst..." : "Opdatér bruger"}
          </button>
          {profileInfo && <div className="info-message">{profileInfo}</div>}
          {profileError && <div className="error-message">{profileError}</div>}
        </form>
      </div>
      <div className="change-password-form">
        <form onSubmit={handleUpdateUserPassword}>
          <div className="change-password-group">
            <label htmlFor="password">Ret Adgangskode </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Indtast ny adgangskode"
              disabled={isSubmittingPassword}
            />
          </div>
          <button type="submit" disabled={isSubmittingPassword}>
            {isSubmittingPassword ? "Vent venligst..." : "Opdatér adgangskode"}
          </button>
          {passwordInfo && <div className="info-message">{passwordInfo}</div>}
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SettingsScreen;
