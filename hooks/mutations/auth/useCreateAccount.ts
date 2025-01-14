import { CREATE_ACCOUNT } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation } from "@tanstack/react-query";

export default function useCreateAccount() {
  return useMutation({
    mutationFn: (payload: CreateAccountPayload) => {
      return instance.post(CREATE_ACCOUNT, payload);
    },
  });
}
