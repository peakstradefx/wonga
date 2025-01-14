import { USER_DETAILS } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useQuery } from "@tanstack/react-query";

export default function useGetUserDetails(userId: string) {
  return useQuery({
    queryKey: ["user-details", userId],
    queryFn: () => {
      return instance.get(USER_DETAILS(userId));
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: Infinity,
  });
}
