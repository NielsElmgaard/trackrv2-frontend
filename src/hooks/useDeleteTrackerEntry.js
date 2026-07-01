import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils";

function useDeleteTrackerEntry(trackerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trackerEntryId) => {
      if (!trackerEntryId) return null;
      const response = await axiosInstance.delete(
        `/v1/trackerentries/${trackerEntryId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trackerEntries", trackerId],
      });
    },
  });
}

export default useDeleteTrackerEntry;
