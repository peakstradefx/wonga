import { KYC } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

interface Response {
  message: string;
}

export default function useSubmitKYC() {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<Response>, AxiosError, FormData>({
    mutationFn: (payload: FormData) => {
      return instance.post(KYC, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-payments"],
      });
    },
  });
}
