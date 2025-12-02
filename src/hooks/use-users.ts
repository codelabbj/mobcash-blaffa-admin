import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/lib/api";
import {AppUser, PaginatedContent, Permission, Transaction} from "@/lib/types";
import {toast} from "sonner";
import {error} from "next/dist/build/output/log";

interface userUpdateInput {
    is_active: boolean;
    user_type: "CLIENT"|"ADMIN"
}

export interface userPermissionInput {
    platform:               string;
    can_deposit:            boolean;
    can_withdraw:           boolean;
    daily_deposit_limit?:    number;
    daily_withdrawal_limit?: number;
}

interface Filters {
    page?:number,
    search?:string,
    is_active?:string,
}

export function useUsers(data:Filters){
    return useQuery({
        queryKey:["users",data.page,data.search,data.is_active],
        queryFn: async ()=>{
            const query : Record<string, number|string|boolean> = {}
            if (data.page) query.page = data.page;
            if (data.search && data.search!=="") query.search = data.search;
            if (data.is_active && data.is_active!=="all") query.is_active = data.is_active==="true";
            const res = await api.get<PaginatedContent<AppUser>>("/admin/users/",{params:query})
            return res.data;
        }
    })
}

export function useUpdateUser({id,data}:{id:string,data:userUpdateInput}){
    const query = useQueryClient()
    return useMutation({
        mutationFn: async ()=>{
            const res = await api.patch(`/admin/users/${id}/`,data)
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Utilisateur mis à jour avec succès")
            query.invalidateQueries({queryKey:["users"]})
        },
        onError: ()=>{
            toast.error("Echec de la mise à jour, veuillez réessayer")
            console.error("Error updating users:",error)
        }
    })
}

export function useActiveUser(){
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (id: string)=>{
            const res = await api.patch(`/admin/users/${id}/activate/`)
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Utilisateur activé avec succès")
            query.invalidateQueries({queryKey:["users"]})
        },
        onError:()=>{
            toast.error("Echec de l'activation de l'utilisateur")
            console.error("Error activating user:",error)
        }
    })
}

export function useDeactivateUser(){
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (id: string)=>{
            const res = await api.patch(`/admin/users/${id}/deactivate/`)
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Utilisateur désactivé avec succès")
            query.invalidateQueries({queryKey:["users"]})
        },
        onError:()=>{
            toast.error("Echec de la désactivation de l'utilisateur")
            console.error("Error deactivating user:",error)
        }
    })
}

export function useUserWallet(id: string){
    return useMutation({
        mutationFn: async ()=>{
            const res = await api.get(`/admin/users/${id}/wallet`)
            return res.data;
        },
        onError:()=>{
            toast.error("Echec du chargement du portefeuille utilisateur")
            console.error("Error loading user wallet:",error)
        }
    })
}

export function useUserTransactions(id: string){
    return useMutation({
        mutationFn: async ()=>{
            const res = await api.get<PaginatedContent<Transaction>>(`/admin/users/${id}/transactions/`)
            return res.data;
        },
        onError:()=>{
            toast.error("Echec du chargement des transactions utilisateur")
            console.error("Error loading user transactions:",error)
        }
    })
}

export function useUserPermissions(id: string){

    return useMutation({
        mutationFn: async ()=>{
            const res = await api.get<Permission[]>(`/admin/users/${id}/permissions`)
            return res.data;
        },
        onError:()=>{
            toast.error("Echec du chargement des permissions utilisateur")
            console.error("Error loading user permissions:",error)
        }
    })
}

export function useAddUserPermission(){
    const query = useQueryClient()
    return useMutation({
        mutationFn: async ({id,data}:{id:string,data:userPermissionInput})=>{
            const res = await api.post(`/admin/users/${id}/add_permission/`,data)
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Permission ajouté à l'utilisateur avec succès")
            query.invalidateQueries({queryKey:["user-permissions"]})
        },
        onError:()=>{
            toast.error("Echec de l'ajout de la permission, veuillez réessayer")
            console.error("Error adding user permission:",error)
        }
    })
}