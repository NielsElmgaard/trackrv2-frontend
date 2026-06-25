import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance, getTokenFromMemory } from "../utils.js";

function useFetchTrackers({ name, createdAt, lastUpdated } = {}) {
  return useQuery({
    queryKey: ["trackers", name, createdAt, lastUpdated],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/v1/trackers?name=${name || ""}&createdAt=${createdAt || ""}&lastUpdated=${lastUpdated || ""}`,
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutter
    enabled: !!getTokenFromMemory(),
  });
}
export default useFetchTrackers;
