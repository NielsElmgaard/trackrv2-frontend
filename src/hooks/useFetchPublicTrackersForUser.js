import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance, getTokenFromMemory } from "../utils.js";

function useFetchPublicTrackersForUser({ userId } = {}) {
  return useQuery({
    queryKey: ["trackers", userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/v1/trackers/public/${userId}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutter
    enabled: !!getTokenFromMemory() && !!userId,
  });
}
export default useFetchPublicTrackersForUser;
