import {useMutation, useQuery} from "@tanstack/react-query";
import {Transaction} from "@/lib/types";
import api from "@/lib/api";
import {toast} from "sonner";

export function useTransaction(){
    return useMutation({
        mutationFn: async (transaction_id:string) =>{
            const res = await api.post<Transaction>(`/v1/transactions/list/${transaction_id}/`)
            return res.data
        },
       onError: (error) => {
           toast.error("Erreur lors du chargement de la transaction")
           console.error(`Error loading transaction:`, error)
       }
    })
}