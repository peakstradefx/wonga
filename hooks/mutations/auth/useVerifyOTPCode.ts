import { RESET_PASSWORD, VERIFY_OTP } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation } from "@tanstack/react-query";

type VerifyOTPCodePayload = {
  email: string;
  code: string;
};

export default function useVerifyOTPCode() {
  return useMutation({
    mutationFn: (payload: VerifyOTPCodePayload) => {
      return instance.post(VERIFY_OTP, payload);
    },
  });
}
