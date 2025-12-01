import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/lib/api";
import {toast} from "sonner";
import {CommissionConfig, PaginatedContent} from "@/lib/types";

export function useCommissionConfig(){
    return useQuery({
        queryKey:["commission-config"],
        queryFn: async () => {
            const res = await api.get<PaginatedContent<CommissionConfig>>("/admin/commission-configs/")
            return res.data
        }
    })
}

export function useEditCommissionConfig(){
    const query = useQueryClient()

    return useMutation({
        mutationFn: async (id:string) => {
            const res = await api.patch(`/admin/commission-configs/${id}/`)
            return res.data
        },
        onSuccess:()=>{
            toast.success("Configuration de commission mis à jour avec succès")
            query.invalidateQueries({queryKey:["commission-config"]})
        },
        onError:(error)=>{
            toast.error("Echec de la mise à jour de la commission, veuillez réessayer")
            console.error("Error updating commission config:",error)
        }
    })
}