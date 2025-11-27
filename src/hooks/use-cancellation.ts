import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/lib/api";
import {Cancellation, PaginatedContent} from "@/lib/types";
import {toast} from "sonner";

interface CancellationApprovalInput {
    cancellation_id: string;
    admin_notes?: string
}

interface CancellationRejectionInput {
    cancellation_id: string;
    admin_notes: string
}

export function useCancellation() {
    return useQuery({
        queryKey:["cancellation"],
        queryFn: async () => {
            const res = await api.get<PaginatedContent<Cancellation>>("/admin/cancellation-requests/")
            return res.data
        }
    })
}

export function useApproveCancellation() {
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (data:CancellationApprovalInput) => {
            if (data.admin_notes){
                await api.post(`/admin/cancellation-requests/${data.cancellation_id}/approve/`,{admin_notes:data.admin_notes})
            }else{
                await api.post(`/admin/cancellation-requests/${data.cancellation_id}/approve/`)
            }
        },
        onSuccess: () => {
            toast.success("Demande d'annulation approvée avec succès ")
            query.invalidateQueries({queryKey:["cancellation"]})
        },
        onError: (error) => {
            toast.error("Une erreur est survenue, veuillez réessayer");
            console.log("Error on cancellation approval:", error)
        }
    })
}

export function useRejectCancellation() {
    const query = useQueryClient()
    return useMutation({
        mutationFn: async (data: CancellationRejectionInput) => {
            await api.post(`/admin/cancellation-requests/${data.cancellation_id}/reject/`, {admin_notes: data.admin_notes})
        },
        onSuccess: () => {
            toast.success("Demande d'annulation rejetée avec succès")
            query.invalidateQueries({queryKey: ["cancellation"]})
        },
        onError: (error) => {
            toast.error("Une erreur est survenue, veuillez réessayer");
            console.log("Error on cancellation rejection:", error)
        }
    })
}
