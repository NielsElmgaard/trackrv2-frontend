import { useEffect, useState } from "react";
import useUnfollowUser from "../../hooks/useUnfollowUser.js";
import useNavigate from "../navigation/useNavigate.jsx";

import "./Following.css";

function Following({ followingDetails, mutualFollowers, setInfo, setError }) {
  const [username, setUsername] = useState("");
  const [isSubmittingUnFollow, setIsSubmittingUnFollow] = useState(false);
  const unFollowUser = useUnfollowUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (followingDetails) {
      setUsername(followingDetails.username || "");
    }
  }, [followingDetails]);

  const hasFollowings =
    Array.isArray(followingDetails) && followingDetails.length > 0;

  async function handleUnfollowUser(followingId) {
    setError("");
    setInfo("");
    setIsSubmittingUnFollow(true);

    try {
      await unFollowUser.mutateAsync(followingId);
      const unfollowedUser = followingDetails.find(
        (following) => following.id === followingId,
      );
      setInfo(`Stoppet med at følge ${unfollowedUser.username}`);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Kunne ikke stoppe med at følger bruger.",
      );
    } finally {
      setIsSubmittingUnFollow(false);
    }
  }

  const renderFollowingContent = () => {
    if (!hasFollowings) {
      return (
        <div>
          <span>Ingen fulgte fundet</span>
        </div>
      );
    } else {
      return (
        <div>
          {followingDetails.map((following) => (
            <div key={following.id} className="following-item-card">
              <div className="following-item-card-name">
                <button
                  onClick={() =>
                    navigate("/PublicProfile", {
                      state: { selectedUser: following },
                    })
                  }
                >
                  <h3>{following.username}</h3>
                </button>
              </div>

              <div className="unfollow-item-card">
                <button
                  className={"unfollow-name-item"}
                  disabled={isSubmittingUnFollow}
                  onClick={() => handleUnfollowUser(following.id)}
                >
                  <span>Stop med at følge</span>
                </button>
              </div>
            </div>
          ))}
          <div></div>
        </div>
      );
    }
  };

  return <>{renderFollowingContent()}</>;
}
export default Following;
