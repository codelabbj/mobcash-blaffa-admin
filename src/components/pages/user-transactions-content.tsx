"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { cn, formatDate, formatCurrency } from "@/lib/utils"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Button } from "@/components/ui/button"
import { SidePanel } from "@/components/ui/side-panel"
import { StatusBadge } from "@/components/ui/status-badge"
import { RequestCard } from "@/components/ui/request-card"
import { Skeleton } from "@/components/ui/skeleton"
import { FilterSection } from "@/components/ui/filter-section"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import { useUserTransactions } from "@/hooks/use-users"
import { AppUser, Transaction } from "@/lib/types"
import {toast} from "sonner";
import {usePlatform} from "@/hooks/use-platform";

interface UserTransactionsContentProps {
    user: AppUser
    onBack: () => void
}

const statusOptions = [
    { value: "all", label: "Tous" },
    { value: "COMPLETED", label: "Complété" },
    { value: "FAILED", label: "Échoué" },
    { value: "PENDING", label: "En attente" },
    { value: "PROCESSING", label: "En cours" },
    { value : "CANCELLED", label: "Annulé"},
    { value: "REFUNDED", label:"Remboursé"}
]

const transactionTypeOptions = [
    { value: "all", label: "Tous" },
    { value: "WITHDRAWAL", label: "Retrait" },
    { value: "DEPOSIT", label: "Dépôt" },
]

export function UserTransactionsContent({ user, onBack }: UserTransactionsContentProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("")
    const [selectedPlatform, setSelectedPlatform] = useState<string>("")
    const [selectedTransactionType, setSelectedTransactionType] = useState<string>("")
    const itemsPerPage = 10

    // Debounce search query
    useEffect(() => {
        const debouncer = setTimeout(
            () => {
                setDebouncedSearchQuery(searchQuery)
                setCurrentPage(1)
            }, 500
        )

        return () => clearTimeout(debouncer)
    }, [searchQuery])

    // Fetch paginated transactions from backend
    const { data: transactionsQuery, isPending: loadingTransactions, error : transactionsError } = useUserTransactions(
        user.id,
        {
            page: currentPage,
            search: debouncedSearchQuery,
            platform: selectedPlatform,
            status: selectedStatus,
            transaction_type: selectedTransactionType,
        }
    )
    const { data: platformsData, error : platformError } = usePlatform({})

    const totalPages = Math.ceil((transactionsQuery?.count || 0) / (transactionsQuery?.page_size || itemsPerPage))
    const startIndex = (currentPage - 1) * (transactionsQuery?.page_size || itemsPerPage)
    const endIndex = startIndex + (transactionsQuery?.page_size || itemsPerPage)
    const paginatedData = transactionsQuery?.results || []

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

    const handleSelectTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction)
        setPanelOpen(true)
    }

    const handleClearFilters = () => {
        setSearchQuery("")
        setSelectedStatus("")
        setSelectedPlatform("")
        setSelectedTransactionType("")
        setCurrentPage(1)
    }

    // Build platform filter options
    const platformFilterOptions = [
        { value: "all", label: "Tous" },
        ...(platformsData?.results?.map((p) => ({
            value: p.id,
            label: p.name,
        })) || []),
    ]

    useEffect(() => {
        if (transactionsError){
            toast.error("Erreur lors du chargement des transactions")
            console.error("Error loading transactions:",transactionsError)
        }
    }, [transactionsError]);

    useEffect(() => {
        if (platformError){
            toast.error("Erreur lors du chargement des platformes")
            console.error("Error loading platform:",platformError)
        }
    }, [platformError]);

    return (
        <DashboardContent>
            <div className="flex gap-6 min-h-[500px] overflow-hidden">
                <div className={cn("transition-all duration-300 overflow-y-auto", panelOpen ? "flex-1 lg:max-w-[calc(100%-320px)]" : "flex-1")} style={{ minWidth: 0 }}>
                    {/* Header */}
                    <div className="mb-6 flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onBack}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour
                        </Button>
                        <div>
                            <p className="text-2xl font-bold">Transactions de {user.first_name} {user.last_name}</p>
                            <p className="text-sm text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6">
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
                                {
                                    placeholder: "Plateforme",
                                    label: "Plateforme",
                                    value: selectedPlatform,
                                    options: platformFilterOptions,
                                    onChange: (value) => {
                                        setSelectedPlatform(value)
                                        setCurrentPage(1)
                                    },
                                },
                                {
                                    placeholder: "Type",
                                    label: "Type",
                                    value: selectedTransactionType,
                                    options: transactionTypeOptions,
                                    onChange: (value) => {
                                        setSelectedTransactionType(value)
                                        setCurrentPage(1)
                                    },
                                },
                            ]}
                            onClearAll={handleClearFilters}
                        />
                    </div>

                    <p className="text-muted-foreground mb-2">
                        {paginatedData.length} transaction{paginatedData.length !== 1 ? "s" : ""}
                    </p>

                    {/* Transactions List */}
                    <div className="space-y-3 mb-6">
                        {loadingTransactions ? (
                            [1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map((transaction) => (
                                <RequestCard
                                    key={transaction.id}
                                    title={transaction.transaction_id}
                                    subtitle={transaction.platform_name}
                                    amount={formatCurrency(Number(transaction.amount))}
                                    badge={<StatusBadge status={transaction.status === "COMPLETED" ? "completed" : transaction.status === "FAILED" ? "failed" : "pending"} />}
                                    details={[
                                        { label: "Type", value: transaction.transaction_type_display },
                                        { label: "Date", value: formatDate(transaction.created_at) }
                                    ]}
                                    onClick={() => handleSelectTransaction(transaction)}
                                    isSelected={selectedTransaction?.id === transaction.id}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                                <p className="text-muted-foreground">Aucune transaction trouvée</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {paginatedData.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-muted-foreground mb-2 w-full">
                                Affichage de {startIndex + 1} à {Math.min(endIndex, transactionsQuery?.count || 0)} sur{" "}
                                {transactionsQuery?.count} résultat{transactionsQuery?.count || 0 > 1 ? "s" : ""}
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
                                                    <PaginationEllipsis />
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
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>

                {/* Details Panel */}
                <SidePanel
                    isOpen={panelOpen}
                    onClose={() => {
                        setPanelOpen(false)
                        setSelectedTransaction(null)
                    }}
                    title="Détails de la transaction"
                    embedded={true}
                >
                    {selectedTransaction && (
                        <div className="space-y-6">
                            {/* Transaction Header */}
                            <div className="text-center pb-6 border-b border-border">
                                <h2 className="text-lg font-bold text-foreground mb-2">{selectedTransaction.transaction_id}</h2>
                                <div className="flex justify-center mb-2">
                                    <StatusBadge status={selectedTransaction.status === "COMPLETED" ? "completed" : selectedTransaction.status === "FAILED" ? "failed" : "pending"} />                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {formatCurrency(Number(selectedTransaction.amount))}
                                </p>
                            </div>

                            {/* Transaction Details */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Informations de la transaction</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Type</span>
                                        <span className="text-sm font-medium text-foreground">{selectedTransaction.transaction_type_display}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Plateforme</span>
                                        <span className="text-sm font-medium text-foreground">{selectedTransaction.platform_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Code plateforme</span>
                                        <span className="text-sm font-medium text-foreground">{selectedTransaction.platform_code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Statut</span>
                                        <span className="text-sm font-medium text-foreground">{selectedTransaction.status_display}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Montant</span>
                                        <span className="text-sm font-bold text-foreground">
                                            {formatCurrency(Number(selectedTransaction.amount))}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Dates</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Créée le</span>
                                        <span className="text-sm font-medium text-foreground">{formatDate(selectedTransaction.created_at)}</span>
                                    </div>
                                    {selectedTransaction.completed_at && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Complétée le</span>
                                            <span className="text-sm font-medium text-foreground">{formatDate(selectedTransaction.completed_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Informations supplémentaires</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">ID externe</span>
                                        <span className="text-sm font-medium text-foreground">{selectedTransaction.external_id}</span>
                                    </div>
                                    {selectedTransaction.mobcash_code && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Code MobCash</span>
                                            <span className="text-sm font-medium text-foreground">{selectedTransaction.mobcash_code}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Guichet</span>
                                        <span className="text-sm font-medium text-foreground">{selectedTransaction.cashdesk_name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Error Information */}
                            {selectedTransaction.error_message && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Erreur</h3>
                                    <div className="space-y-3">
                                        {selectedTransaction.error_code && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Code erreur</span>
                                                <span className="text-sm font-medium text-red-600">{selectedTransaction.error_code}</span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Message</p>
                                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                                {selectedTransaction.error_message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Transaction Logs */}
                            {selectedTransaction.logs && selectedTransaction.logs.length > 0 && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                                        Journaux ({selectedTransaction.logs.length})
                                    </h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {selectedTransaction.logs.map((log, index) => (
                                            <div key={index} className="p-2 bg-muted rounded text-xs">
                                                <p className="font-medium text-foreground mb-1">{log.message}</p>
                                                {log.status_from && (
                                                    <p className="text-muted-foreground mb-1">
                                                        <span className="text-muted-foreground">{log.status_from}</span>
                                                        <span className="mx-1">→</span>
                                                        <span className="text-foreground font-medium">{log.status_to}</span>
                                                    </p>
                                                )}
                                                {!log.status_from && (
                                                    <p className="text-muted-foreground mb-1">
                                                        <span className="text-foreground font-medium">{log.status_to}</span>
                                                    </p>
                                                )}
                                                <p className="text-muted-foreground text-xs mt-1">
                                                    {formatDate(log.created_at)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </SidePanel>
            </div>
        </DashboardContent>
    )
}