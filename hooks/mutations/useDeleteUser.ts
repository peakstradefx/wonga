import { USER_DETAILS } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

interface DeleteUserProps {
  userId: string;
}

interface Response {
  message: string;
}

export default function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<Response>, AxiosError, DeleteUserProps>({
    mutationFn: ({userId}: DeleteUserProps) => {
      return instance.delete(USER_DETAILS(userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-users"],
      });
    },
  });
}
