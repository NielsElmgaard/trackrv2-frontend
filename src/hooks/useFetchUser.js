import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance, getTokenFromMemory } from "../utils.js";

function useFetchUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/v1/users/user`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutter
    enabled: !!getTokenFromMemory(),
  });
}
export default useFetchUser;
