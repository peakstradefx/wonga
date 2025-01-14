import { RESET_PASSWORD } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation } from "@tanstack/react-query";

type ResetPasswordPayload = {
  newPassword: string;
};

export default function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => {
      return instance.put(RESET_PASSWORD, payload);
    },
  });
}
