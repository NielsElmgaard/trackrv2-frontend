import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils";

function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (followingId) => {
      if (!followingId) return [];
      const response = await axiosInstance.delete(
        `/v1/userfollows/${followingId}`,
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["followers"],
      });
    },
  });
}
export default useUnfollowUser;
