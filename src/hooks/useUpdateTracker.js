import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils";

function useUpdateTracker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trackerId, name, description, fields }) => {
      const response = await axiosInstance.put(`/v1/trackers/${trackerId}`, {
        name: name,
        description: description,
        fields: fields,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["trackers", variables.trackerId],
      });
    },
  });
}
export default useUpdateTracker;
