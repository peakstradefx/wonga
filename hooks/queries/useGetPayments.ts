import { PAYMENT } from "@/services/endpoint";
import { instance } from "@/services/instance";
import { useQuery } from "@tanstack/react-query";

export default function useGetPayments() {
  return useQuery({
    queryKey: ["list-payments"],
    queryFn: () => {
      return instance.get(PAYMENT);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: Infinity,
  });
}
