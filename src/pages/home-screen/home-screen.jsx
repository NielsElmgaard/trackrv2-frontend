import { useEffect, useState } from "react";
import useFetchSearchUsers from "../../hooks/useFetchSearchUsers";
import useFollowUser from "../../hooks/useFollowUser";
import "./home-screen.css";
function HomeScreen() {
  const username = JSON.parse(localStorage.getItem("username"));
  const [search, setSearch] = useState("");
  const { isPending, data: searchUsers, fetchError } = useFetchSearchUsers();
  const followUser = useFollowUser();
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  const searchUsersList = Array.isArray(searchUsers) ? searchUsers : [];
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const filteredSearchUsers = searchUsersList.filter((s) => {
    if (search === "") {
      return s;
    }
    return (
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.middleName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.nationality.toLowerCase().includes(search.toLowerCase())
    );
  });

  async function handleFollowUser(followingId) {
    setError("");
    setInfo("");
    setIsFollowingUser(true);

    try {
      await followUser.mutateAsync(followingId);
      setInfo("Bruger fulgt");
    } catch (err) {
      setError(err.response?.data?.detail || "Kunne ikke følge brugeren.");
    } finally {
      setIsFollowingUser(false);
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
      <div style={{ color: "#d9534f", fontSize: "14px", textAlign: "center" }}>
        En fejl opstod {fetchError.message}
      </div>
    );

  const renderSearchUsersContent = () => {
    if (search === "") {
      return null;
    } else {
      return filteredSearchUsers.map((searchUser) => (
        <div key={searchUser.id} className="search-user-item-card">
          <div className="search-user-item-card-info">
            <h3>
              {searchUser.username} ({searchUser.firstName}{" "}
              {searchUser.middleName
                ? searchUser?.middleName.substring(0, 1) + "."
                : ""}{" "}
              {searchUser.lastName})
            </h3>
          </div>
          <div className="follow-user-item-card">
            <button
              className={"follow-user-item"}
              disabled={isFollowingUser}
              onClick={() => handleFollowUser(searchUser.id)}
            >
              <span>Følg</span>
            </button>
          </div>
        </div>
      ));
    }
  };

  return (
    <>
      <div className="home-screen-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Søg efter brugere..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isFollowingUser}
          />
        </div>
        <div className="search-user-container">
          {renderSearchUsersContent()}
        </div>
        <div>
          {info && <div className="info-message">{info}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </>
  );
}

export default HomeScreen;
