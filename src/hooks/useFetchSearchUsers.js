import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance, getTokenFromMemory } from "../utils.js";

function useFetchSearchUsers({
  username,
  firstName,
  middleName,
  lastName,
  nationality,
} = {}) {
  return useQuery({
    queryKey: ["users", username, firstName, middleName, lastName, nationality],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/v1/users/search-users?username=${username || ""}&firstName=${firstName || ""}&middleName=${middleName || ""}&lastName=${lastName || ""}&nationality=${nationality || ""}`,
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutter
    enabled: !!getTokenFromMemory(),
  });
}
export default useFetchSearchUsers;
