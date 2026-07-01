import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils";

export default function useUpdateTrackerEntry(trackerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entryId, fieldValues }) => {
      return await axiosInstance.put(`/v1/trackerentries/${entryId}`, {
        Values: fieldValues.map(v => ({
          FieldDefinitionId: v.fieldDefinitionId || v.FieldDefinitionId,
          Value: v.value ?? ""
        }))
      });
    },
    onSuccess: () => {
      // Sørg for at genhente din historik automatisk ved succes
      queryClient.invalidateQueries({ queryKey: ["trackerEntries", trackerId] });
      queryClient.invalidateQueries({ queryKey: ["trackers", trackerId] });
    },
  });
}