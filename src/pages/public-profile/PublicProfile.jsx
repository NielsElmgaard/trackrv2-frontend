import useFetchPublicTrackersForUser from "../../hooks/useFetchPublicTrackersForUser.js";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../utils.js";
import useNavigate from "../../components/navigation/useNavigate.jsx";
import { AiOutlineInfoCircle } from "react-icons/ai";
import PopUp from "../../components/popup/PopUp.jsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useLocation } from "react-router-dom";

import "./PublicProfile.css";

function PublicProfile() {
  const location = useLocation();
  const currentSearchUser = location.state?.selectedUser || null;
  const [search, setSearch] = useState("");
  const [goToPage, setGoToPage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [currentTracker, setCurrentTracker] = useState(null);
  const {
    isPending,
    data: trackerDetails,
    fetchError,
  } = useFetchPublicTrackersForUser({ userId: currentSearchUser?.id });
  const queryClient = useQueryClient();
  const trackersList = Array.isArray(trackerDetails) ? trackerDetails : [];
  const trackersPerPage = trackersList.length; // TODO: Change to fitting number
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [trackerDescriptionId, setTrackerDescriptionId] = useState(null);

  const filteredTrackers = trackersList.filter((t) => {
    if (search === "") {
      return t;
    }
    return t.name.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(
    (filteredTrackers?.length || 0) / trackersPerPage,
  );
  const startIndex = (currentPage - 1) * trackersPerPage;
  const endIndex = startIndex + trackersPerPage;
  const currentItems = filteredTrackers?.slice(startIndex, endIndex) || [];

  // Prefetch of next page
  useEffect(() => {
    if (currentPage < totalPages && filteredTrackers?.length > 0) {
      const nextPageItems = filteredTrackers.slice(
        currentPage * trackersPerPage,
        (currentPage + 1) * trackersPerPage,
      );

      nextPageItems.forEach((p) => {
        queryClient.prefetchQuery({
          queryKey: ["trackers", p.id],
          queryFn: () =>
            axiosInstance.get(`/v1/trackers/${p.id}`).then((res) => res.data),
          staleTime: 1000 * 60 * 5,
        });
      });
    }
  }, [currentPage, filteredTrackers, queryClient]);

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

  return (
    <>
      <div className="trackers-screen-container">
        <h1>{currentSearchUser.username}'s Trackere</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Søg efter tracker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="tracker-overview-container">
          <div className="tracker-list-items">
            {currentItems.map((tracker) => (
              <div key={tracker.id} className="tracker-item-card">
                <div className="tracker-item-card-name">
                  <h3>{tracker.name}</h3>
                </div>
                {trackerDescriptionId !== tracker.id && (
                  <div className="description-tracker-item-card">
                    <button onClick={() => setTrackerDescriptionId(tracker.id)}>
                      <AiOutlineInfoCircle size={22} />
                    </button>
                  </div>
                )}
                <div>
                  <PopUp
                    trigger={trackerDescriptionId === tracker.id}
                    setTrigger={setTrackerDescriptionId}
                  >
                    <Card variant="outlined">
                      <CardContent>
                        <span>{tracker.description ?? ""}</span>
                      </CardContent>
                    </Card>
                  </PopUp>
                </div>
                <div className="tracker-list-button">
                  <button
                    className={"tracker-chart-item"}
                    onClick={() =>
                      navigate("/TrackerHistoryChart", {
                        state: { currentTracker: tracker },
                      })
                    }
                  >
                    <h3>Graf</h3>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default PublicProfile;
