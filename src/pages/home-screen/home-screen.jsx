import { useEffect, useState } from "react";
function HomeScreen() {
  const username = JSON.parse(localStorage.getItem("username"));
  const [search, setSearch] = useState("");



  return (
    <>
      <div className="home-screen-container">
        <div className="search-user-container">
            <form onSubmit={}>
                <label htmlFor="search-user"></label>
            </form>
        </div>
      </div>
    </>
  );
}

export default HomeScreen;
