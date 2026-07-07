import { useQuery } from "@tanstack/react-query";
import { axiosInstance, getTokenFromMemory } from "../utils";

function useFetchFollowersForUser() {
  return useQuery({
    queryKey: ["followers"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/userfollows/followers`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutter
    enabled: !!getTokenFromMemory(),
  });
}
export default useFetchFollowersForUser;
