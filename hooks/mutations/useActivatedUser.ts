// useActivateUser.ts
import { ACTIVATE_USER } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ActivateUserProps = {
  userId: string;
  activate: boolean;
};

interface ActivateUserResponse {
  message: string;
  user: {
    _id: string;
    isActivatedByAdmin: boolean;
  };
}

export default function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation<ActivateUserResponse, Error, ActivateUserProps>({
    mutationFn: async (data) => {
      const response = await instance.put<ActivateUserResponse>(
        ACTIVATE_USER,
        data
      );
      if (!response.data) {
        throw new Error("No data received from server");
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-details", variables.userId],
      });
    },
  });
}
