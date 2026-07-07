import useFetchFollowersForUser from "../../hooks/useFetchFollowersForUser.js";
import { useEffect, useState } from "react";
import useUnfollowUser from "../../hooks/useUnfollowUser.js";

function Followers() {
  const {
    isPending,
    data: followersDetails,
    fetchError,
  } = useFetchFollowersForUser();

  const [username, setUsername] = useState("");
  const [isSubmittingUnFollow, setIsSubmittingUnFollow] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const unFollowUser = useUnfollowUser();

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

  async function handleUnfollowUser(followingId) {
    setError("");
    setInfo("");
    setIsSubmittingUnFollow(true);

    try {
      await unFollowUser.mutateAsync(followingId);
      setInfo(
        `Stoppet med at følge ${followersDetails.map((follower) => follower.id === followingId && follower.username)}`,
      );
    } catch (err) {
      setError(
        err.response?.data?.detail || "Kunne ikke stoppe med at følger bruger.",
      );
    } finally {
      setIsSubmittingUnFollow(false);
    }
  }

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
              <div className="unfollow-item-card">
                <button
                  className={"unfollow-name-item"}
                  disabled={isSubmittingUnFollow}
                  onClick={() => handleUnfollowUser(follower.id)}
                >
                  <BsFillTrash3Fill />
                </button>
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
