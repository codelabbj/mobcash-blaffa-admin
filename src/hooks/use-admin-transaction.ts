import {useQuery} from "@tanstack/react-query";
import api from "@/lib/api";
import {AdminTransactionStats, PaginatedContent, Transaction} from "@/lib/types";

interface Filters {
    page?:number,
    search?:string;
    platform?:string;
    status?:string;
    transaction_type?:string;
}

export function useAdminTransaction(filters:Filters){
    return useQuery({
        queryKey:["admin-transaction",filters.page,filters.search,filters.platform,filters.status,filters.transaction_type],
        queryFn: async () =>{
            const query : Record<string, number|string|boolean> = {}
            if(filters.page) query.page = filters.page;
            if (filters.search && filters.search!=="") query.search = filters.search;
            if (filters.platform && filters.platform!=="all") query.platform = filters.platform;
            if (filters.status && filters.status!=="all") query.status = filters.status;
            if (filters.transaction_type && filters.transaction_type!=="all") query.transaction_type = filters.transaction_type;

            const res = await api.get<PaginatedContent<Transaction>>('v1/transactions/admin-transactions/',{params:query})

            return res.data
        }
    })
}

export function useAdminTransactionStatistics(){
    return useQuery({
        queryKey:["admin-transaction"],
        queryFn: async () =>{
            const res = await api.get<AdminTransactionStats>("v1/transactions/admin-transactions/statistics/")
            return res.data
        }
    })
}
