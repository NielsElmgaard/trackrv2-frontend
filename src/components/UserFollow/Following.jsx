import { useEffect, useState } from "react";
import useUnfollowUser from "../../hooks/useUnfollowUser.js";
import useFetchFollowingForUser from "../../hooks/useFetchFollowingForUser.js";

function Following({ setInfo, setError }) {
  const {
    isPending,
    data: followingDetails,
    fetchError,
  } = useFetchFollowingForUser();

  const [username, setUsername] = useState("");
  const [isSubmittingUnFollow, setIsSubmittingUnFollow] = useState(false);
  const unFollowUser = useUnfollowUser();

  useEffect(() => {
    if (followingDetails) {
      setUsername(followingDetails.username || "");
    }
  }, [followingDetails]);

  if (isPending)
    return (
      <div className="loading-screen-container">
        <div className="loading"></div>
      </div>
    );
  if (fetchError)
    return <div className="error-message">Kunne ikke hente følgere.</div>;

  const hasFollowings =
    Array.isArray(followingDetails) && followingDetails.length > 0;

  async function handleUnfollowUser(followingId) {
    setError("");
    setInfo("");
    setIsSubmittingUnFollow(true);

    try {
      await unFollowUser.mutateAsync(followingId);
      setInfo(
        `Stoppet med at følge ${followingDetails.map((following) => following.id === followingId && following.username)}`,
      );
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
                <h3>{following.username}</h3>
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
