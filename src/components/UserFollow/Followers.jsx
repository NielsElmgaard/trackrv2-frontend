import useFollowUser from "../../hooks/useFollowUser";
import { useState } from "react";
import "./Followers.css";

function Followers({ followersDetails, mutualFollowers, setInfo, setError }) {
  const followUser = useFollowUser();
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  async function handleFollowUser(followingId) {
    setError("");
    setInfo("");
    setIsFollowingUser(true);

    try {
      await followUser.mutateAsync(followingId);
      const followedUser = followersDetails.find(
        (follower) => follower.id === followingId,
      );
      setInfo(`${followedUser.username} fulgt`);
    } catch (err) {
      setError(err.response?.data?.detail || "Kunne ikke følge brugeren.");
    } finally {
      setIsFollowingUser(false);
    }
  }

  const hasFollowers =
    Array.isArray(followersDetails) && followersDetails.length > 0;

  if (!hasFollowers) {
    return (
      <div>
        <span>Ingen følgere fundet</span>
      </div>
    );
  }
  return (
    <div>
      {followersDetails.map((follower) => {
        const isMutual = mutualFollowers.some((m) => m.id === follower.id);

        return (
          <div key={follower.id} className="follower-item-card">
            <div className="follower-item-card-name">
              <h3>{follower.username}</h3>
            </div>
            {isMutual ? (
              <span
                className="mutual-tag"
                style={{ fontSize: "0.75rem", color: "#888" }}
              >
                (I følger hinanden)
              </span>
            ) : (
              <div className="follow-user-item-card">
                <button
                  className={"follow-user-item"}
                  disabled={isFollowingUser}
                  onClick={() => handleFollowUser(follower.id)}
                >
                  <span>Følg</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Followers;
