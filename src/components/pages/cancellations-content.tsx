"use client"

import {useEffect, useState} from "react"
import {XCircle} from "lucide-react"
import {cn, formatDate, formatCurrency} from "@/lib/utils"
import {DashboardContent} from "@/components/layout/dashboard-content"
import {FilterSection} from "@/components/ui/filter-section"
import {RequestCard} from "@/components/ui/request-card"
import {SidePanel} from "@/components/ui/side-panel"
import {StatusBadge} from "@/components/ui/status-badge"
import {ActionButtons} from "@/components/ui/action-buttons"
import {NotesDialog} from "@/components/ui/notes-dialog"
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import {useApproveCancellation, useCancellation, useRejectCancellation} from "@/hooks/use-cancellation";
import {useTransaction} from "@/hooks/use-transaction";
import {Cancellation, Transaction} from "@/lib/types";
import {toast} from "sonner";
import RequestCardSkeleton from "@/components/ui/request-card-skeleton";

const statusOptions = [
    {value: "all", label: "Tous"},
    {value: "pending", label: "En attente"},
    {value: "approved", label: "Approuver"},
    {value: "rejected", label: "Rejeter"},
]

export function CancellationsContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<Cancellation | null>(null)
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [notesDialogOpen, setNotesDialogOpen] = useState(false)
    const [dialogAction, setDialogAction] = useState<"approve" | "reject">("approve")

    const itemsPerPage = 6
    const [isProcessing, setIsProcessing] = useState(false)
    const [isLoadingTransaction, setIsLoadingTransaction] = useState(false)

    // Debounce search query
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
            setCurrentPage(1)
        }, 500) // 500ms delay

        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const {data: cancellations, error, isLoading} = useCancellation({page:currentPage,status:selectedStatus,search:debouncedSearchQuery})
    const approveCancellation = useApproveCancellation()
    const rejectCancellation = useRejectCancellation()
    const loadTransaction = useTransaction()

    const totalPages = Math.ceil((cancellations?.count || 0) / (cancellations?.page_size || itemsPerPage))
    const startIndex = (currentPage - 1) * (cancellations?.page_size || itemsPerPage)
    const endIndex = startIndex + (cancellations?.page_size || itemsPerPage)
    const paginatedData = cancellations?.results || []

    const getPageNumber = () => {
        const pages = []
        const maxVisiblePage = 5

        if (totalPages <= maxVisiblePage) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push("ellipsis")
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push("ellipsis")
                for (let i = currentPage - 1; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push("ellipsis")
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push("ellipsis")
                pages.push(totalPages)
            }
        }

        return pages
    }

    const handleClearFilters = () => {
        setSearchQuery("")
        setSelectedStatus("")
        setCurrentPage(1)
    }

    const handleSelectRequest = async (request: Cancellation) => {
        setSelectedRequest(request)
        setIsLoadingTransaction(true)
        setPanelOpen(true)
        try {
            // Load transaction details using the transaction hook
            loadTransaction.mutate(request.transaction_id, {
                onSuccess: (data) => {
                    setSelectedTransaction(data)
                },
            })
        } finally {
            setIsLoadingTransaction(false)
        }
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
                approveCancellation.mutate({
                    cancellation_id: selectedRequest.id,
                    admin_notes: notes || undefined,
                })
            } else {
                rejectCancellation.mutate({
                    cancellation_id: selectedRequest.id,
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
        if (error) {
            toast.error("Echec du chargement des demandes d'annulation, veuillez réessayer")
            console.log("An error occurred during cancellations loading:", error)
        }
    }, [error])

    return (
        <DashboardContent>

            {/* Grid Cards */}
            <div className="flex gap-6 min-h-[500px]">

                {/* List Section */}
                <div className={cn("transition-all duration-300", panelOpen ? "flex-1 lg:max-w-[calc(100%-320px)]" : "flex-1")} style={{minWidth: 0}}>
                    {/* Header */}
                    <div className="mb-6 space-y-2">
                        <p className="text-2xl font-bold">Demandes d&#39;annulation</p>
                        <p className="text-sm text-muted-foreground">Gérer vos demandes d&#39;annulation de transactions</p>
                    </div>

                    {/* Filters */}
                    <div className={cn("mb-6 transition-all duration-300", panelOpen && "lg:max-w-[calc(100%-320px)]")}>
                        <FilterSection
                            searchValue={searchQuery}
                            onSearchChange={setSearchQuery}
                            filters={[
                                {
                                    placeholder: "Statut",
                                    label: "Statut",
                                    value: selectedStatus,
                                    options: statusOptions,
                                    onChange: (value) => {
                                        setSelectedStatus(value)
                                        setCurrentPage(1)
                                    },
                                },
                            ]}
                            onClearAll={handleClearFilters}
                        />
                    </div>

                    <p className="text-muted-foreground mb-2">
                        {cancellations?.results.length} demande{cancellations?.results.length !== 1 ? "s" : ""} d&#39;annulation
                    </p>

                    {/* Cards List */}
                    <div className="space-y-3 mb-6">
                        {
                            isLoading ? [1, 2, 3, 4].map((item) => (
                                <RequestCardSkeleton key={item}/>
                            ))
                                : paginatedData.length > 0 ? (
                                paginatedData.map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        icon={<XCircle className="w-6 h-6 text-destructive" />}
                                        title={request.id}
                                        subtitle={request.transaction_id}
                                        badge={<StatusBadge status={request.status.toLowerCase() as "pending" | "approved" | "processing" | "failed" | "cancelled" | "refunded"} />}
                                        amount={request.id}
                                        details={[
                                            { label: "Raison", value: request.reason },
                                            { label: "Date", value: formatDate(request.requested_at) },
                                        ]}
                                        onClick={() => handleSelectRequest(request)}
                                        isSelected={selectedRequest?.id === request.id}
                                    />
                                ))
                            ) : (
                                <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                                    <p className="text-muted-foreground">Aucune demande d&#39;annulation trouvée</p>
                                </div>
                            )
                        }
                    </div>

                    {/* Pagination */}
                    {paginatedData.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-muted-foreground mb-2 w-full">
                                Affichage de {startIndex + 1} à {Math.min(endIndex, cancellations?.results.length || 0)} sur{" "}
                                {cancellations?.results.length} résultat{cancellations?.results.length || 0 > 1 ? "s" : ""}
                            </p>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage - 1 > 0) setCurrentPage(currentPage - 1)
                                        }}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                    {
                                        getPageNumber().map((page, index) =>
                                            page === "ellipsis" ? (
                                                <PaginationItem key={`ellipsis-${index}`}>
                                                    <PaginationEllipsis/>
                                                </PaginationItem>
                                            ) : (
                                                <PaginationItem key={page}>
                                                    <PaginationLink href="#" onClick={(e) => {
                                                        e.preventDefault()
                                                        setCurrentPage(page as number)
                                                    }}
                                                        isActive={currentPage == page}
                                                        className="cursor-pointer"
                                                    >{page}</PaginationLink>
                                                </PaginationItem>
                                            )
                                        )
                                    }
                                    <PaginationItem>
                                        <PaginationNext href="#" onClick={(e) => {
                                            e.preventDefault()
                                            if (totalPages >= currentPage + 1) setCurrentPage(currentPage + 1)
                                        }}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}/>
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
                    title="Détails de la demande"
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
                            {/* Cancellation Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Informations d&#39;Annulation</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Raison</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.reason}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Statut</span>
                                        <StatusBadge status={selectedRequest.status.toLowerCase() as "pending" | "approved" | "processing" | "failed" | "cancelled" | "refunded"} />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Date Demande</span>
                                        <span className="text-sm font-medium text-foreground">{formatDate(selectedRequest.requested_at)}</span>
                                    </div>
                                    {selectedRequest.processed_at && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Date Traitement</span>
                                            <span className="text-sm font-medium text-foreground">{selectedRequest.processed_at ? formatDate(new Date(selectedRequest.processed_at)): "N/A"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Transaction Details */}
                            {selectedTransaction && !isLoadingTransaction && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Détails de la Transaction</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">ID Transaction</span>
                                            <span className="text-sm font-medium text-foreground">{selectedTransaction.transaction_id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Montant</span>
                                            <span className="text-sm font-bold text-foreground">
                                                {formatCurrency(Number(selectedTransaction.amount))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Plateforme</span>
                                            <span className="text-sm font-medium text-foreground">{selectedTransaction.platform_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Type</span>
                                            <span className="text-sm font-medium text-foreground">{selectedTransaction.transaction_type_display}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Statut Transaction</span>
                                            <StatusBadge status={selectedTransaction.status.toLowerCase() as "pending" | "approved" | "processing" | "failed" | "cancelled" | "refunded"} />
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Date Création</span>
                                            <span className="text-sm font-medium text-foreground">{formatDate(selectedTransaction.created_at)}</span>
                                        </div>
                                        {selectedTransaction.completed_at && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Date Complétion</span>
                                                <span className="text-sm font-medium text-foreground">{formatDate(selectedTransaction.completed_at)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Annulable</span>
                                            <span className="text-sm font-medium text-foreground">{selectedTransaction.is_cancellable ? "Oui" : "Non"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isLoadingTransaction && (
                                <div className="border-t border-border pt-6">
                                    <p className="text-sm text-muted-foreground">Chargement des détails de la transaction...</p>
                                </div>
                            )}

                            {/* Admin Notes */}
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
                            ? "Approuver l'annulation"
                            : "Rejeter l'annulation"
                    }
                    description={
                        dialogAction === "approve"
                            ? "Vous êtes sur le point d'approuver cette demande d'annulation."
                            : "Vous êtes sur le point de rejeter cette demande d'annulation."
                    }
                    action={dialogAction}
                    isLoading={isProcessing}
                />
            </div>
        </DashboardContent>
    )
}
