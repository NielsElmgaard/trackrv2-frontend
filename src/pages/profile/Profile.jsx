import useNavigate from "../../components/navigation/useNavigate.jsx";
import useFetchUser from "../../hooks/useFetchUser.js";
import { useEffect, useState } from "react";
import Followers from "../../components/UserFollow/Followers.jsx";
import PopUp from "../../components/popup/PopUp.jsx"
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { isPending, data: userDetails, fetchError } = useFetchUser();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [isShowingFollowers, setIsShowingFollowers] = useState(false);

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username || "");
      setFirstName(userDetails.firstName || "");
      setMiddleName(userDetails.middleName || "");
      setLastName(userDetails.lastName || "");
      setNationality(userDetails.nationality || "");
    }
  }, [userDetails]);

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

  const renderFollowersManagement = () => {
    if (!isShowingFollowers) {
      return (
        <button onClick={() => setIsShowingFollowers(true)}>Følgere</button>
      );
    } else {
      return (
        <button onClick={() => setIsShowingFollowers(false)}>
          Skjul følgere
        </button>
      );
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-username">
          <h1>{username}</h1>
        </div>
        <h2>
          {firstName} {middleName} {lastName}
        </h2>
        <section className="manage-followers-section">
          {renderFollowersManagement()}
          {isShowingFollowers && userDetails && (
            <div>
              <PopUp
                showPopUp={isShowingFollowers}
                closePopUp={() => setIsShowingFollowers(false)}
              >
                <Followers />
              </PopUp>
            </div>
          )}
        </section>
        <div className="profile-settings-container">
          <button onClick={() => navigate("/Settings")}>Rediger profil</button>
        </div>
      </div>
    </>
  );
}
export default Profile;
