import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils";

function useDeleteTracker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trackerId) => {
      if (!trackerId) return [];
      const response = await axiosInstance.delete(`/v1/trackers/${trackerId}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["trackers"],
      });
    },
  });
}
export default useDeleteTracker;
