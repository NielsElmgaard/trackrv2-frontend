import useFetchTrackers from "../../hooks/useFetchTrackers.js";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { axiosInstance } from "../../utils.js";
import Tracker from "../tracker/Tracker.jsx";
import useNavigate from "../../components/navigation/useNavigate.jsx";
import { BsFillTrash3Fill } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import PopUp from "../../components/popup/PopUp.jsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import "./trackers-screen.css";
import useDeleteTracker from "../../hooks/useDeleteTracker.js";
import TrackerHistoryChart from "../tracker-history-chart/TrackerHistoryChart.jsx";

function TrackersScreen() {
  const [search, setSearch] = useState("");
  const [goToPage, setGoToPage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [currentTracker, setCurrentTracker] = useState(null);
  const { isPending, data: trackerDetails, fetchError } = useFetchTrackers();
  const deleteTracker = useDeleteTracker();
  const queryClient = useQueryClient();
  const trackersList = Array.isArray(trackerDetails) ? trackerDetails : [];
  const trackersPerPage = trackersList.length; // TODO: Change to fitting number
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isDeletingTracker, setIsDeletingTracker] = useState(false);
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

  async function handleDeleteTracker(trackerId) {
    setError("");
    setInfo("");
    setIsDeletingTracker(true);

    try {
      await deleteTracker.mutateAsync(trackerId);
      setInfo("Tracker slettet");
    } catch (err) {
      setError(err.response?.data?.detail || "Kunne ikke slette trackeren.");
    } finally {
      setIsDeletingTracker(false);
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

  return (
    <>
      <div className="trackers-screen-container">
        <h1>Trackere</h1>
        <div className="tracker-create-container">
          <button
            disabled={isDeletingTracker}
            onClick={() =>
              navigate("/Tracker", { state: { currentTracker: null } })
            }
          >
            <p>Tilføj tracker</p>
          </button>
        </div>
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
                <div className="delete-tracker-item-card">
                  <button
                    className={"tracker-name-item"}
                    disabled={isDeletingTracker}
                    onClick={() => handleDeleteTracker(tracker.id)}
                    aria-label="Slet Tracker"
                  >
                    <BsFillTrash3Fill />
                  </button>
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
                    className={"tracker-name-item"}
                    disabled={isDeletingTracker}
                    onClick={() =>
                      navigate("/Tracker", {
                        state: { currentTracker: tracker },
                      })
                    }
                  >
                    <h3>Track</h3>
                  </button>
                  <button
                    className={"tracker-history-item"}
                    disabled={isDeletingTracker}
                    onClick={() =>
                      navigate("/TrackerHistory", {
                        state: { currentTracker: tracker },
                      })
                    }
                  >
                    <h3>Historik</h3>
                  </button>
                  <button
                    className={"tracker-chart-item"}
                    disabled={isDeletingTracker}
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

export default TrackersScreen;
