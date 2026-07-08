import useNavigate from "../../components/navigation/useNavigate.jsx";
import useFetchUser from "../../hooks/useFetchUser.js";
import { useEffect, useState } from "react";
import Followers from "../../components/UserFollow/Followers.jsx";
import PopUp from "../../components/popup/PopUp.jsx";
import "./Profile.css";
import Following from "../../components/UserFollow/Following.jsx";

function Profile() {
  const navigate = useNavigate();
  const { isPending, data: userDetails, fetchError } = useFetchUser();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [isShowingFollowers, setIsShowingFollowers] = useState(false);
  const [isShowingFollowing, setIsShowingFollowing] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (userDetails) {
      setError("");
      setInfo("");
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

  const renderFollowingManagement = () => {
    if (!isShowingFollowing) {
      return (
        <button onClick={() => setIsShowingFollowing(true)}>Fulgte</button>
      );
    } else {
      return (
        <button onClick={() => setIsShowingFollowing(false)}>
          Skjul fulgte
        </button>
      );
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-settings-container">
          <button onClick={() => navigate("/Settings")}>Redigér profil</button>
        </div>
        <div className="profile-username">
          <h1>{username}</h1>
        </div>
        <h2>
          {firstName} {middleName} {lastName}
        </h2>
        <section className="manage-follow-section">
          <div className="follower-section">
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
          </div>
          <div className="following-section">
            {renderFollowingManagement()}
            {isShowingFollowing && userDetails && (
              <div>
                <PopUp
                  showPopUp={isShowingFollowing}
                  closePopUp={() => setIsShowingFollowing(false)}
                >
                  <Following  setInfo={setInfo} setError={setError}/>
                </PopUp>
              </div>
            )}
          </div>
        </section>
        <div>
          {info && <div className="info-message">{info}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </>
  );
}
export default Profile;
