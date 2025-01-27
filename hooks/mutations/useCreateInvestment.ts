import { INVESTMENT } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => {
      return instance.post(INVESTMENT, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["investments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-details"],
      });
    },
  });
}
