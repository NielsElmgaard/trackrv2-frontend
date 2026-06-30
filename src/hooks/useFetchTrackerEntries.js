import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils";

function useFetchTrackerEntries(trackerId) {
  return useQuery({
    queryKey: ["trackerEntries", trackerId],
    queryFn: async () => {
      if (!trackerId) return [];
      const response = await axiosInstance.get(
        `/v1/trackerentries/${trackerId}`,
      );
      return response.data;
    },
    enabled: !!trackerId,
  });
}
export default useFetchTrackerEntries;
