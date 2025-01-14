import { RESET_PASSWORD } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation } from "@tanstack/react-query";

type ResetPasswordPayload = {
  email: string;
};

export default function useSendPasswordResetCode() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => {
      return instance.post(RESET_PASSWORD, payload);
    },
  });
}
