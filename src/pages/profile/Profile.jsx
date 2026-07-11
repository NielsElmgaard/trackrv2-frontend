import useNavigate from "../../components/navigation/useNavigate.jsx";
import useFetchUser from "../../hooks/useFetchUser.js";
import useFetchFollowersForUser from "../../hooks/useFetchFollowersForUser.js";
import useFetchFollowingForUser from "../../hooks/useFetchFollowingForUser.js";
import { useEffect, useState } from "react";
import Followers from "../../components/UserFollow/Followers.jsx";
import PopUp from "../../components/popup/PopUp.jsx";
import "./Profile.css";
import Following from "../../components/UserFollow/Following.jsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function Profile() {
  const navigate = useNavigate();
  const { isPendingUser, data: userDetails, fetchErrorUser } = useFetchUser();
  const {
    isPendingFollowing,
    data: followingData,
    fetchErrorFollowing,
  } = useFetchFollowingForUser();
  const {
    isPendingFollower,
    data: followersData,
    fetchErrorFollower,
  } = useFetchFollowersForUser();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [isShowingFollowers, setIsShowingFollowers] = useState(false);
  const [isShowingFollowing, setIsShowingFollowing] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const followersList = Array.isArray(followersData) ? followersData : [];
  const followingList = Array.isArray(followingData) ? followingData : [];

  const mutualFollowers = followersList.filter((follower) =>
    followingList.some((followingUser) => followingUser.id === follower.id),
  );

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

  if (isPendingUser || isPendingFollowing || isPendingFollower)
    return (
      <div className="loading-screen-container">
        <div className="loading"></div>
      </div>
    );
  if (fetchErrorUser || fetchErrorFollowing || fetchErrorFollower)
    return <div className="error-message">Kunne ikke hente oplysninger.</div>;

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setError("");
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
            {!isShowingFollowers && (
              <button onClick={() => setIsShowingFollowers(true)}>
                Følgere
              </button>
            )}

            {isShowingFollowers && userDetails && (
              <div>
                <PopUp
                  trigger={isShowingFollowers}
                  setTrigger={setIsShowingFollowers}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Followers
                        followersDetails={followersList}
                        mutualFollowers={mutualFollowers}
                        setInfo={setInfo}
                        setError={setError}
                      />
                    </CardContent>
                  </Card>
                </PopUp>
              </div>
            )}
          </div>
          <div className="following-section">
            {!isShowingFollowing && (
              <button onClick={() => setIsShowingFollowing(true)}>
                Fulgte
              </button>
            )}
            {isShowingFollowing && userDetails && (
              <div>
                <PopUp
                  trigger={isShowingFollowing}
                  setTrigger={setIsShowingFollowing}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Following
                        followingDetails={followingList}
                        mutualFollowers={mutualFollowers}
                        setInfo={setInfo}
                        setError={setError}
                      />
                    </CardContent>
                  </Card>
                </PopUp>
              </div>
            )}
          </div>
        </section>
        <div>{info && <div className="info-message">{info}</div>}</div>
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
      </div>
    </>
  );
}

export default Profile;
