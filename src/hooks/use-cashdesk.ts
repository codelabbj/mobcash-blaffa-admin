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

export function useCashDesk() {
    return useQuery({
        queryKey:["cashdesk"],
        queryFn: async () => {
            const res = await api.get<PaginatedContent<CashDesk>>("/v1/cashdesks/")
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
            toast.success("Caisse créer avec succès.");
            query.invalidateQueries({queryKey:["cashdesk"]})
        },
        onError:(error)=>{
            toast.error("Echec de la création de caisse, veuillez réessayer");
            console.error("Error creating cashdesk:",error);
        }
    })
}

const useUpdateCashDesk = () => {
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (data :CashDeskUpdateInput ) => {
            const res = await api.patch("/v1/cashdesks/",data)
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Caisse mis à jour avec succès")
            query.invalidateQueries({queryKey:["cashdesk"]})
        },
        onError:(error)=>{
            toast.error("Echec de la mis à jour de caisse, veuillez réessayer");
            console.error("Error updating cashdesk:",error);
        }
    })
}

const useUpdateCashDeskStatus = () =>{
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
                toast.success("Caisse activer avec succès")
            }else{
                toast.success("Caisse désactiver avec succès")
            }
            query.invalidateQueries({queryKey:["cashdesk"]})
        },
        onError:(error)=>{
            toast.error("Une erreur est survenue, veuillez réessayer");
            console.error("Error updating cashdesk:",error);
        }
    })
}

const useUpdateCashDeskCredentials = () =>{
    const query = useQueryClient()

    return useMutation({
        mutationFn: async ({id,data} :{id:string,data:Omit<CashDeskInput, "platform_id"|"name"|"cashdeskid">}) => {
            const res = await api.post(`/v1/cashdesks/${id}/update_credentials/`,data)
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Identifiants de la caisse mis à jour avec succès")
            query.invalidateQueries({queryKey:["cashdesk"]})
        },
        onError:(error)=>{
            toast.error("Echec de la mise à jour des identifiants; veuillez réessayer");
            console.error("Error updating cashdesk:",error);
        }
    })
}

const useDeleteCashDesk = () => {
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (cashdesk_id:string)=>{
            const res = await api.delete(`/v1/cashdesks/${cashdesk_id}/`)
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Caisse supprimée avec succès")
            query.invalidateQueries({queryKey:["cashdesk"]})
        },
        onError:(error)=>{
            toast.error("Echec de la suppression de la caisse, veuillez réessayer");
            console.error("Error deleting cashdesk:",error);
        }
    })
}

