import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {PaginatedContent, Recharge} from "@/lib/types";
import api from "@/lib/api";
import {toast} from "sonner";


interface RechargeApprovalInput {
    recharge_id: string;
    admin_notes?: string
}

interface RechargeCancellationInput {
    recharge_id: string;
    admin_notes: string
}
export function useRecharge(){
    return useQuery({
        queryKey:["recharge"],
        queryFn: async () => {
            const res = await api.get<PaginatedContent<Recharge>>("/admin/recharge-requests/")
            return res.data;
        },
    })
}

export function useApproveRecharge(){
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (data:RechargeApprovalInput) => {
            if(data.admin_notes){
                await api.post(`/admin/recharge-requests/${data.recharge_id}/approve/`,{admin_notes:data.admin_notes})
            }else{
                await api.post(`/admin/recharge-requests/${data.recharge_id}/approve/`)
            }

        },
        onSuccess : () =>{
            toast.success("Recharge approvée avec succès");
            query.invalidateQueries({queryKey:["recharge"]})
        },
        onError : (error) =>{
            toast.error("Une erreur est survenue, veuillez réessayer");
            console.log("Error on recharge approval:",error)
        }
    })
}

export function useRejectRecharge(){
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (data: RechargeCancellationInput) => {
            await api.post(`/admin/recharge-requests/${data.recharge_id}/reject/`,{admin_notes:data.admin_notes})
        },
        onSuccess : () =>{
            toast.success("Recharge rejetée avec succès")
            query.invalidateQueries({queryKey:["recharge"]})
        },
        onError : (error) =>{
            toast.error("Une erreur est survenue, veuillez réessayer");
            console.log("Error on recharge rejection:",error)        }
    })
}