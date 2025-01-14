import { WITHDRAWAL } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useRequestWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => {
      return instance.post(WITHDRAWAL, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-withdrawals"],
      });
      queryClient.invalidateQueries({
        queryKey: ["investments"],
      });
    },
  });
}
