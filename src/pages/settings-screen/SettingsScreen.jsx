import { useEffect, useState } from "react";
import "./SettingsScreen.css";
import { useNavigate, Link } from "react-router-dom";
import useFetchUser from "../../hooks/useFetchUser.js";
import { axiosInstance } from "../../utils.js";
import UpdateUserInfoForm from "../../components/forms/UpdateUserInfoForm.jsx";
import ChangePasswordForm from "../../components/forms/ChangePasswordForm.jsx";

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
    return (
      <div className="loading-screen-container">
        <div className="loading"></div>
      </div>
    );
  if (fetchError)
    return (
      <div className="error-message">Kunne ikke hente profiloplysninger.</div>
    );
  return (
    <div className="update-userinfo-container">
      <UpdateUserInfoForm
        handleUpdateUserInfo={handleUpdateUserInfo}
        username={username}
        setUsername={setUsername}
        firstName={firstName}
        setFirstName={setFirstName}
        middleName={middleName}
        setMiddleName={setMiddleName}
        lastName={lastName}
        setLastName={setLastName}
        nationality={nationality}
        setNationality={setNationality}
        email={email}
        setEmail={setEmail}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        isSubmittingProfile={isSubmittingProfile}
        profileError={profileError}
        profileInfo={profileInfo}
      />
      <ChangePasswordForm
        handleUpdateUserPassword={handleUpdateUserPassword}
        password={password}
        setPassword={setPassword}
        isSubmittingPassword={isSubmittingPassword}
        passwordError={passwordError}
        passwordInfo={passwordInfo}
      />
    </div>
  );
}

export default SettingsScreen;
