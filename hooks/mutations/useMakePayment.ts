import { PAYMENT } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";

interface PaymentResponse {
  message: string;
}

export default function useMakePayment() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<PaymentResponse>, AxiosError, FormData>({
    mutationFn: async (payload: FormData) => {
      return instance.post<PaymentResponse>(PAYMENT, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-payments"] as const,
      });
    },
  });
}
