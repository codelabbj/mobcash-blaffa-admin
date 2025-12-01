import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/lib/api";
import {Commission, PaginatedContent} from "@/lib/types";
import {toast} from "sonner";

interface CommissionFilter {
    user_id?: string;
    status?: string;
    type?: string;
}

interface PayCommissionInput {
    user_id: string,
    period_year: null,
    period_month: null,
    notes: string
}

export function useCommission(filter:CommissionFilter){
    return useQuery({
        queryKey:["commission"],
        queryFn: async () =>{
            const res = await api.get<PaginatedContent<Commission>>("/admin/commissions/",{params:filter})
            return res.data;
        }
    })
}

export function usePendingCommission(){
    const query = useQueryClient()

    return useMutation({
        mutationFn: async () =>{
            const res = await api.get<PaginatedContent<Commission>>("/admin/commissions/pending/")
            return res.data;
        },
        onSuccess:() =>{
            query.invalidateQueries({queryKey: ["commission"]})
        },
        onError:(error)=>{
            toast.error("Une erreur est survenue lors du chargement des commissions")
            console.error("Error loading pending commissions:",error)
        }
    })
}

export function usePaidCommission(){
    const query = useQueryClient()

    return useMutation({
        mutationFn: async () =>{
            const res = await api.get<PaginatedContent<Commission>>("/admin/commission-payments/")
            return res.data;
        },
        onSuccess:() =>{
            query.invalidateQueries({queryKey: ["commission"]})
        },
        onError:(error)=>{
            toast.error("Une erreur est survenue lors du chargement des commissions")
            console.error("Error loading paid commissions:",error)
        }
    })
}

export function usePayCommission(){
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (data:PayCommissionInput) =>{
            const res = await api.post("/admin/commission-payments/pay/",data)
            return res.data;
        },
        onSuccess:() =>{
            toast.success("Commission payée avec succès")
            query.invalidateQueries({queryKey: ["commission"]})
        },
        onError:(error)=>{
            toast.error("Une erreur est survenue lors du paiement de la commission")
            console.error("Error paying commissions:",error)
        }
    })
}