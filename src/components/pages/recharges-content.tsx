"use client"

import {useEffect, useState} from "react"
import { ArrowUpRight } from "lucide-react"
import { cn, formatDate, formatCurrency } from "@/lib/utils"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { FilterSection } from "@/components/ui/filter-section"
import { RequestCard } from "@/components/ui/request-card"
import { SidePanel } from "@/components/ui/side-panel"
import { StatusBadge } from "@/components/ui/status-badge"
import { ActionButtons } from "@/components/ui/action-buttons"
import { NotesDialog } from "@/components/ui/notes-dialog"
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import {useApproveRecharge, useRecharge, useRejectRecharge} from "@/hooks/use-recharge";
import {Recharge} from "@/lib/types";
import {toast} from "sonner";
import RequestCardSkeleton from "@/components/ui/request-card-skeleton";
import Link from "next/link";

interface RechargeRequest {
    id: string
    userName: string
    userPhone: string
    amount: number
    platform: string
    paymentMethod: string
    status: "pending" | "approved" | "rejected"
    createdAt: string
    userEmail?: string
    transactionId?: string
    notes?: string
}

const statusOptions = [
    {value: "all", label: "Tous"},
    { value: "pending", label: "En attente" },
    { value: "approved", label: "Approuver" },
    { value: "rejected", label: "Rejeter" },
]

const paymentMethodOptions = [
    {value: "all", label: "Toutes"},
    { value: "mobile_money", label: "Mobile Money" },
    { value: "bank_transfer", label: "Transfert Bancaire" },
    { value: "wallet", label: "Portefeuille" },
]

export function RechargesContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [selectedPlatform, setSelectedPlatform] = useState("")
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<Recharge | null>(null)
    const [notesDialogOpen, setNotesDialogOpen] = useState(false)
    const [dialogAction, setDialogAction] = useState<"approve" | "reject">("approve")

    const itemsPerPage = 6
    const [isProcessing, setIsProcessing] = useState(false)

    const {data:recharges,error, isLoading} = useRecharge()
    const approveRecharge = useApproveRecharge()
    const rejectRecharge = useRejectRecharge()

    // Filter data
    const filteredData = recharges?.results.filter((item) => {
        const matchesSearch =
            item.user_email.toLowerCase().includes(searchQuery.toLowerCase()) || item.payment_reference.includes(searchQuery)
        const matchesStatus = !selectedStatus || selectedStatus ==="all" || item.status.toLowerCase() === selectedStatus
        const matchesPlatform = !selectedPaymentMethod || selectedPaymentMethod ==="all" || item.payment_method.toLowerCase() === selectedPaymentMethod

        return matchesSearch && matchesStatus && matchesPlatform
    }) || []

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = filteredData.slice(startIndex, endIndex)

    const getPageNumber = () =>{
        const pages = []
        const maxVisiblePage = 5

        if (totalPages <= maxVisiblePage){
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        }else {
            if (currentPage >=3){
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push("ellipsis")
                pages.push(totalPages)
            } else if ( currentPage >= totalPages-2){
                pages.push(1)
                pages.push("ellipsis")
                for (let i = currentPage-1; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push("ellipsis")
                for (let i = currentPage-1; i <= currentPage+1; i++) {
                    pages.push(i)
                }
                pages.push("ellipsis")
            }
        }

        return pages
    }

    const handleClearFilters = () => {
        setSearchQuery("")
        setSelectedStatus("")
        setSelectedPaymentMethod("")
        setSelectedPlatform("")
        setCurrentPage(1)
    }

    const handleSelectRequest = (request: Recharge) => {
        setSelectedRequest(request)
        setPanelOpen(true)
    }

    const handleAccept = () => {
        setDialogAction("approve")
        setNotesDialogOpen(true)
    }

    const handleReject = () => {
        setDialogAction("reject")
        setNotesDialogOpen(true)
    }

    const handleNotesSubmit = async (notes: string) => {
        if (!selectedRequest) return
        setIsProcessing(true)

        try {
            if (dialogAction === "approve") {
                approveRecharge.mutate({
                    recharge_id: selectedRequest.id,
                    admin_notes: notes || undefined,
                })
            } else {
                rejectRecharge.mutate({
                    recharge_id: selectedRequest.id,
                    admin_notes: notes,
                })
            }
            setNotesDialogOpen(false)
            setPanelOpen(false)
        } finally {
            setIsProcessing(false)
        }
    }

    useEffect(() => {
        if (error){
            toast.error("Echec du chargement des recharges, veuillez réessayer")
            console.log("An error occurred during recharges loading :",error)
        }
    })

    return (
        <DashboardContent>

            {/* Grid Cards */}
            <div className="flex gap-6 min-h-[500px]">

                {/* List Section */}
                <div className={cn("transition-all duration-300", panelOpen ? "flex-1 lg:max-w-[calc(100%-320px)]" : "flex-1")} style={{minWidth: 0}}>
                    {/* Header */}
                    <div className="mb-6 space-y-2">
                        <p className="text-2xl font-bold">Demandes de recharge</p>
                        <p className="text-sm text-muted-foreground">Gérer vos demandes de recharge d&#39;application de paris</p>
                    </div>

                    {/* Filters */}
                    <div className={cn("mb-6 transition-all duration-300", panelOpen && "lg:max-w-[calc(100%-320px)]")}>
                        <FilterSection
                            searchValue={searchQuery}
                            onSearchChange={setSearchQuery}
                            filters={[
                                {
                                    placeholder:"Status",
                                    label: "Statut",
                                    value: selectedStatus,
                                    options: statusOptions,
                                    onChange: (value) => {
                                        setSelectedStatus(value)
                                        setCurrentPage(1)
                                    },
                                },
                                {
                                    placeholder: "Methode de paiement",
                                    label: "Methode de paiement",
                                    value: selectedPlatform,
                                    options: paymentMethodOptions,
                                    onChange: (value) => {
                                        setSelectedPlatform(value)
                                        setCurrentPage(1)
                                    },
                                },
                            ]}
                            onClearAll={handleClearFilters}
                        />
                    </div>

                    <p className="text-muted-foreground mb-2">
                        {filteredData.length} demande{filteredData.length !== 1 ? "s" : ""} de recharge
                    </p>

                    {/* Cards List */}
                    <div className="space-y-3 mb-6">
                        {
                            isLoading? [1,2,3,4].map((recharge) => (
                                <RequestCardSkeleton key={recharge}/>
                                ))
                                :paginatedData.length > 0 ? (
                                paginatedData.map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        icon={<ArrowUpRight className="w-6 h-6" />}
                                        title={request.payment_reference}
                                        subtitle={request.user_email}
                                        badge={<StatusBadge status={request.status.toLowerCase() as "pending" | "approved" | "processing" | "failed" | "cancelled" | "refunded"} />}
                                        amount={formatCurrency(Number(request.amount))}
                                        details={[
                                            { label: "Méthode", value: request.payment_method.replace("_"," ") },
                                            { label: "Date", value: formatDate(request.created_at) },
                                        ]}
                                        onClick={() => handleSelectRequest(request)}
                                        isSelected={selectedRequest?.id === request.id}
                                    />
                                ))
                            ) : (
                                <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                                    <p className="text-muted-foreground">Aucune demande de recharge trouvée</p>
                                </div>
                            )
                        }
                        {}
                    </div>

                    {/* Pagination */}
                    {paginatedData.length > 0 && (
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-muted-foreground mb-2 w-full">
                                Affichage de {startIndex + 1} à {Math.min(endIndex, recharges?.results.length || 0)} sur{" "}
                                {recharges?.results.length} résultat{recharges?.results.length || 0 > 1 ? "s" : ""}
                            </p>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" onClick={(e)=>{
                                            e.preventDefault()
                                            if (currentPage-1 > 0) setCurrentPage(currentPage-1)
                                        }}
                                                            className={currentPage===1 ? "pointer-event-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                    {
                                        getPageNumber().map((page,index) =>
                                            page === "ellipsis" ? (
                                                <PaginationItem key={`ellipsis-${index}`}>
                                                    <PaginationEllipsis/>
                                                </PaginationItem>
                                            ) : (
                                                <PaginationItem key={page}>
                                                    <PaginationLink href="#" onClick={(e)=>{
                                                        e.preventDefault()
                                                        setCurrentPage(page as number)}}
                                                                    isActive={currentPage==page}
                                                                    className="cursor-pointer"
                                                    >{page}</PaginationLink>
                                                </PaginationItem>
                                            )
                                        )
                                    }
                                    <PaginationItem>
                                        <PaginationNext href="#" onClick={(e)=>{
                                            e.preventDefault()
                                            if (totalPages >= currentPage+1) setCurrentPage(currentPage+1)
                                        }}
                                                        className={currentPage=== totalPages ?"pointer-event-none opacity-50" : "cursor-pointer"}/>
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>

                {/* Panel Section - Embedded on desktop, hidden on mobile */}
                <SidePanel
                    isOpen={panelOpen}
                    onClose={() => setPanelOpen(false)}
                    title="Détails de la Recharge"
                    embedded={true}
                    footer={
                        selectedRequest?.status.toLowerCase() === "pending" && (
                            <ActionButtons
                                onAccept={handleAccept}
                                onReject={handleReject}
                                acceptLabel="Approuver"
                                rejectLabel="Rejeter"
                                isLoading={isProcessing}
                            />
                        )
                    }
                >
                    {selectedRequest && (
                        <div className="space-y-6">
                            {/* User Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Informations Utilisateur</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Email</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.user_email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Détails de la Transaction</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Montant</span>
                                        <span className="text-sm font-bold text-foreground">
                                            {formatCurrency(Number(selectedRequest.amount))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Méthode de Paiement</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.payment_method.replace("_", " ")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Date</span>
                                        <span className="text-sm font-medium text-foreground">{formatDate(selectedRequest.created_at)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Request Details */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Détails de la Demande</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Statut</span>
                                        <StatusBadge status={selectedRequest.status.toLowerCase() as "pending" | "approved" | "processing" | "failed" | "cancelled" | "refunded"} />
                                    </div>

                                    {
                                        selectedRequest.payment_proof_url!==null && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Preuve de paiement</span>
                                                <Link href={selectedRequest.payment_proof_url} target="_blank" className="text-sm font-medium underline">Voir</Link>
                                            </div>
                                        )
                                    }

                                </div>
                            </div>

                            {/* Admin Notes */}
                            {selectedRequest.notes && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Notes</h3>
                                    <p className="text-sm text-foreground bg-muted p-3 rounded-lg">{selectedRequest.notes}</p>
                                </div>
                            )}

                            {selectedRequest.admin_notes && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Notes Administrateur</h3>
                                    <p className="text-sm text-foreground bg-muted p-3 rounded-lg">{selectedRequest.admin_notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </SidePanel>

                {/* Notes Dialog */}
                <NotesDialog
                    isOpen={notesDialogOpen}
                    onClose={() => setNotesDialogOpen(false)}
                    onSubmit={handleNotesSubmit}
                    title={
                        dialogAction === "approve"
                            ? "Approuver la recharge"
                            : "Rejeter la recharge"
                    }
                    description={
                        dialogAction === "approve"
                            ? "Vous êtes sur le point d'approuver cette demande de recharge."
                            : "Vous êtes sur le point de rejeter cette demande de recharge."
                    }
                    action={dialogAction}
                    isLoading={isProcessing}
                />
            </div>
        </DashboardContent>
    )
}
