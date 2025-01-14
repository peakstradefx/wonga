import { INVESTMENT_INFORMATION } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useQuery } from "@tanstack/react-query";

export default function useGetInvestments() {
  return useQuery({
    queryKey: ["investments"],
    queryFn: () => {
      return instance.get(INVESTMENT_INFORMATION);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
