import { PAYMENT } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdatePaymentRequest = {
  paymentId: string;
  status: string;
}

export default function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePaymentRequest) => {
      return instance.put(PAYMENT, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-details"],
      });
    },
  });
}
