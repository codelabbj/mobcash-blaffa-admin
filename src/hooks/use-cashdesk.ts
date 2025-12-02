import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CashDesk, PaginatedContent} from "@/lib/types";
import api from "@/lib/api";
import {toast} from "sonner";

interface CashDeskInput {
    platform_id: string;
    name:        string;
    cashdeskid:  string;
    login:       string;
    cashierpass: string;
    hash:        string;
}

interface CashDeskUpdateInput {
    name: string;
    is_active: boolean;
}

interface Filters {
    page? : number,
    search? : string,
    is_active? : string,
}

export function useCashDesk(data:Filters) {
    return useQuery({
        queryKey:["cashdesk",data.page,data.search,data.is_active],
        queryFn: async () => {
            const query : Record<string, number|string|boolean> = {}
            if (data.page) query.page = data.page;
            if (data.search && data.search !=="") query.search = data.search;
            if (data.is_active && data.is_active!=="all") query.is_active = data.is_active === "active";
            const res = await api.get<PaginatedContent<CashDesk>>("/v1/cashdesks/", {params:query})
            return res.data;
        }
    })
}

export function useCreateCashDesk() {
    const query = useQueryClient()

    return useMutation({
        mutationFn: async (data : CashDeskInput) => {
            const res = await api.post("/v1/cashdesks/",data)
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Cashdesk crée avec succès.");
            query.invalidateQueries({queryKey:["cashdesk"]})
        },
        onError:(error)=>{
            toast.error("Echec de la création de cashdesk, veuillez réessayer");
            console.error("Error creating cashdesk:",error);
        }
    })
}

export const useUpdateCashDesk = () => {
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (data :CashDeskUpdateInput ) => {
            const res = await api.patch("/v1/cashdesks/",data)
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Cashdesk mis à jour avec succès")
            query.invalidateQueries({queryKey:["cashdesk"]})
        },
        onError:(error)=>{
            toast.error("Echec de la mis à jour de cashdesk, veuillez réessayer");
            console.error("Error updating cashdesk:",error);
        }
    })
}

export const useUpdateCashDeskStatus = () =>{
    const query = useQueryClient()
    return useMutation({
        mutationFn: async ({cashdesk_id,active}:{cashdesk_id:string,active:boolean} ) => {
            if (active) {
                const res = await api.post(`/v1/cashdesks/${cashdesk_id}/activate/`)
                return res.data;
            }
            const res = await api.post(`/v1/cashdesks/${cashdesk_id}/deactivate/`)
            return res.data;
        },
        onSuccess:({cashdesk_id,active}:{cashdesk_id:string,active:boolean})=>{
            if (active) {
                toast.success("Cashdesk activer avec succès")
            }else{
                toast.success("Cashdesk désactiver avec succès")
            }
            query.invalidateQueries({queryKey:["cashdesk"]})
        },
        onError:(error)=>{
            toast.error("Une erreur est survenue, veuillez réessayer");
            console.error("Error updating cashdesk:",error);
        }
    })
}

export const useUpdateCashDeskCredentials = () =>{
    const query = useQueryClient()

    return useMutation({
        mutationFn: async ({id,data} :{id:string,data:Omit<CashDeskInput, "platform_id"|"name"|"cashdeskid">}) => {
            const res = await api.post(`/v1/cashdesks/${id}/update_credentials/`,data)
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Identifiants du cashdesk mis à jour avec succès")
            query.invalidateQueries({queryKey:["cashdesk"]})
        },
        onError:(error)=>{
            toast.error("Echec de la mise à jour des identifiants; veuillez réessayer");
            console.error("Error updating cashdesk:",error);
        }
    })
}

export const useDeleteCashDesk = () => {
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (cashdesk_id:string)=>{
            const res = await api.delete(`/v1/cashdesks/${cashdesk_id}/`)
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Cashdesk supprimée avec succès")
            query.invalidateQueries({queryKey:["cashdesk"]})
        },
        onError:(error)=>{
            toast.error("Echec de la suppression du cashdesk, veuillez réessayer");
            console.error("Error deleting cashdesk:",error);
        }
    })
}


