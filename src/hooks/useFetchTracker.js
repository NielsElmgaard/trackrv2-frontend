import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance, getTokenFromMemory } from "../utils.js";

function useFetchTracker({ trackerId } = {}) {
  return useQuery({
    queryKey: ["trackers", trackerId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/v1/trackers/${trackerId}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutter
    enabled: !!trackerId && !!getTokenFromMemory(),
  });
}
export default useFetchTracker;
