import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {PaginatedContent, Permission} from "@/lib/types";
import api from "@/lib/api";
import {toast} from "sonner";

interface permissionUpdateInput {
    can_deposit:            boolean;
    can_withdraw:           boolean;
    daily_deposit_limit?:    number;
    daily_withdrawal_limit?: number;
}

export function usePermission(){
    return useQuery({
        queryKey:["permissions"],
        queryFn: async () => {
            const res = await api.get<PaginatedContent<Permission>>("/admin/users/permissions/")
            return res.data
        }
    })
}

export function useUpdatePermission(){
    const query = useQueryClient()
    return useMutation({
        mutationFn: async ({id,data}:{id:string,data:permissionUpdateInput}) => {
            const res = await api.patch(`/admin/users/permissions/${id}/`,{data:data})
            return res.data
        },
        onSuccess: ()=>{
            toast.success("Permission mis à jour avec succès")
            query.invalidateQueries({queryKey:["permissions"]})
        },
        onError: (error)=>{
            toast.error("Echec de la mis à jour de la permission")
            console.error("Error during permission update:",error)
        }
    })
}

export function useDeletePermission(){
    const query = useQueryClient()

    return useMutation({
        mutationFn: async (id:string) => {
            const res = await api.delete(`/admin/users/permissions/${id}/`)
            return res.data
        },
        onSuccess: ()=>{
            toast.success("Permission supprimée avec succès")
            query.invalidateQueries({queryKey:["permissions"]})
        },
        onError: (error)=>{
            toast.error("Echec de suppression de la permission")
            console.error("Error during permission deletion:",error)
        }
    })
}