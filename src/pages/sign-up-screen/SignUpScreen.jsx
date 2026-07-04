import { useState } from "react";
import useNavigate from "../../components/navigation/useNavigate";
import SignUpForm from "../../components/forms/SignUpForm";
import { axiosInstance } from "../../utils";

function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");
    if (
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber
    ) {
      setError(
        "Indtast venligst alle felter (mellemnavn og nationalitet undtaget)",
      );
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/v1/users", {
        username: username.trim(),
        password: password.trim(),
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        nationality: nationality.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber,
      });

      setUsername("");
      setPassword("");
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setNationality("");
      setEmail("");
      setPhoneNumber("");
      navigate("/Home");
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.message || error;
      setError(`${errorMessage} - Fejl under oprettelse af bruger.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SignUpForm
      handleSignUp={handleSignUp}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
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
      isSubmitting={isSubmitting}
      error={error}
    />
  );
}

export default SignUpScreen;
