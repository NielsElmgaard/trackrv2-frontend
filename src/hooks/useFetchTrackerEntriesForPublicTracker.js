import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils";

function useFetchTrackerEntriesForPublicTracker(trackerId, userId) {
  return useQuery({
    queryKey: ["trackerEntries", trackerId, userId],
    queryFn: async () => {
      if (!trackerId || !userId) return [];
      const response = await axiosInstance.get(
        `/v1/trackerentries/public/${trackerId}/${userId}`,
      );
      return response.data;
    },
    enabled: !!trackerId && !!userId,
  });
}
export default useFetchTrackerEntriesForPublicTracker;
