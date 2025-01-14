import { WITHDRAWAL } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useQuery } from "@tanstack/react-query";

export default function useGetWithdrawals() {
  return useQuery({
    queryKey: ["list-withdrawals"],
    queryFn: () => {
      return instance.get(WITHDRAWAL);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: Infinity,
  });
}
