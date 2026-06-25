import useFetchTrackers from "../../hooks/useFetchTrackers.js";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { axiosInstance } from "../../utils.js";

function TrackersScreen({ onLogout, selectedTracker }) {
  const [search, setSearch] = useState("");
  const [goToPage, setGoToPage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTracker, setCurrentTracker] = useState(null);
  const {
    isPending,
    data: trackerDetails,
    error,
  } = useFetchTrackers({ name: search });
  const queryClient = useQueryClient();
  const trackersList = Array.isArray(trackerDetails) ? trackerDetails : [];
  const trackersPerPage = 5;

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
      <div style={{ padding: "20px", textAlign: "center" }}>Indlæser...</div>
    );

  if (error)
    return (
      <div style={{ color: "#d9534f", fontSize: "14px", textAlign: "center" }}>
        En fejl opstod {error.message}
      </div>
    );

  return (
    <>
      <div className="trackers-screen-container">
        <div className="logout-button">
          <button onClick={onLogout}>Log ud</button>
        </div>
        <h1>Trackers</h1>
        <input
          type="text"
          placeholder="Søg efter tracker..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="tracker-overview-container">
          <div className="tracker-name">
            {currentItems.map((tracker) => (
              <div key={tracker.id} className="tracker-name">
                <h3>{tracker.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default TrackersScreen;
