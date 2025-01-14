import { USERS } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useQuery } from "@tanstack/react-query";

export default function useGetUsers() {
  return useQuery({
    queryKey: ["list-users"],
    queryFn: () => {
      return instance.get(USERS);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: Infinity,
  });
}
