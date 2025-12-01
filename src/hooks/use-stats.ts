import {useQuery} from "@tanstack/react-query";
import api from "@/lib/api";
import {CashDeskStats, Stats, TransactionStats, UserStats} from "@/lib/types";

export function useStats() {
    return useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const res = await api.get<Stats>("/admin/stats/dashboard/")
            return res.data
        }
    })
}

export function useTransactionStats(){
    return useQuery({
        queryKey: ["transaction-stats"],
        queryFn: async () => {
            const res = await api.get<TransactionStats>("/admin/stats/transactions/")
            return res.data
        }
    })
}

export function useCashDeskStats(){
    return useQuery({
        queryKey: ["cashdesk-stats"],
        queryFn: async () => {
            const res = await api.get<CashDeskStats>("/admin/stats/cashdesks/")
            return res.data
        }
    })
}

export function useUserStats(){
    return useQuery({
        queryKey: ["users-stats"],
        queryFn: async () => {
            const res = await api.get<UserStats>("/admin/stats/users/")
            return res.data
        }
    })
}