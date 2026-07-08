import { useQuery } from "@tanstack/react-query";
import { axiosInstance, getTokenFromMemory } from "../utils";

function useFetchFollowingForUser() {
  return useQuery({
    queryKey: ["followings"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/userfollows/following`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutter
    enabled: !!getTokenFromMemory(),
  });
}
export default useFetchFollowingForUser;
