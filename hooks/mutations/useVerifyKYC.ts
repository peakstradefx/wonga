import { KYC } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useVerifyKYC() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { kycId: string; status: string }) => {
      return instance.put(KYC, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-details"],
      });
    },
  });
}
