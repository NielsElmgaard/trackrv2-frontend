import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils";

function useUpdateTracker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trackerId, name, description,isPublic, fields }) => {
      const response = await axiosInstance.put(`/v1/trackers/${trackerId}`, {
        name: name,
        description: description ?? null,
        isPublic: isPublic,
        fields: fields,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["trackers", variables.trackerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["trackers"],
      });
    },
  });
}
export default useUpdateTracker;
