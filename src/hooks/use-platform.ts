import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/lib/api";
import {PaginatedContent, Platform, PlatformStats} from "@/lib/types";
import {toast} from "sonner";

interface PlatformInput {
    name:         string;
    code:         string;
    api_base_url: string;
    description:  string;
}

interface PlatformUpdateInput {
    description: string,
    is_active: boolean
}

export function usePlatform(){
    return useQuery({
        queryKey:["platform"],
        queryFn: async () =>{
            const res = await api.get<PaginatedContent<Platform>>("/v1/platforms/")
            return res.data
        }
    })
}

export function useCreatePlatform(){
    const query = useQueryClient()

    return useMutation({
        mutationFn: async (data:PlatformInput) =>{
            const res = await api.post("/v1/platforms/", data);
            return res.data
        },
        onSuccess:() =>{
            toast.success("Plateforme crée avec succès");
            query.invalidateQueries({queryKey:["platform"]});
        },
        onError: (error) =>{
            toast.error("Echec de la creation de plateforme,veuillez réessayer")
            console.error("Error during platform creation:",error)
        }
    })
}

export function useUpdatePlatform(){
    const query = useQueryClient()

    return useMutation({
        mutationFn: async ({id,data}:{id:string,data : PlatformUpdateInput}) =>{
            const res = await  api.patch(`/v1/platforms/${id}/`, data)
        },
        onSuccess:() =>{
            toast.success("Plateforme mis à jour avec succès")
            query.invalidateQueries({queryKey:["platform"]});
        },
        onError: (error)=>{
            toast.error("Echec de la mise à jour de plateforme, veuillez réessayer")
            console.error("Error during platform update:",error)
        }
    })
}

export function usePlatformStats(){
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (platform_id:string) =>{
            const res = await api.get<PlatformStats>(`/v1/platforms/${platform_id}/stats/`)
            return res.data
        },
        onError: (error)=>{
            toast.error("Echec du chargement des statistiques, veuillez réessayer")
            console.error("Error during platform stats load:",error)
        }
    })
}