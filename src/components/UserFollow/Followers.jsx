import useFetchFollowersForUser from "../../hooks/useFetchFollowersForUser.js";
import { useEffect, useState } from "react";

function Followers() {
  const {
    isPending,
    data: followersDetails,
    fetchError,
  } = useFetchFollowersForUser();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (followersDetails) {
      setUsername(followersDetails.username || "");
    }
  }, [followersDetails]);

  if (isPending)
    return (
      <div className="loading-screen-container">
        <div className="loading"></div>
      </div>
    );
  if (fetchError)
    return <div className="error-message">Kunne ikke hente følgere.</div>;

  const hasFollowers =
    Array.isArray(followersDetails) && followersDetails.length > 0;


  const renderFollowersContent = () => {
    if (!hasFollowers) {
      return (
        <div>
          <span>Ingen følgere fundet</span>
        </div>
      );
    } else {
      return (
        <div>
          {followersDetails.map((follower) => (
            <div key={follower.id} className="follower-item-card">
              <div className="follower-item-card-name">
                <h3>{follower.username}</h3>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return <>{renderFollowersContent()}</>;
}
export default Followers;
