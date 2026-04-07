"use client"

import { useState, useEffect } from "react"
import { Copy, ChevronRight } from "lucide-react"
import { cn, formatDate, formatCurrency } from "@/lib/utils"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Card } from "@/components/ui/card"
import { SidePanel } from "@/components/ui/side-panel"
import { StatusBadge } from "@/components/ui/status-badge"
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
import { useAdminTransaction, useAdminTransactionStatistics } from "@/hooks/use-admin-transaction"
import { usePlatform } from "@/hooks/use-platform"
import { Transaction } from "@/lib/types"
import { toast } from "sonner"

const statusOptions = [
    { value: "all", label: "Tous" },
    { value: "COMPLETED", label: "Complété" },
    { value: "FAILED", label: "Échoué" },
]

const transactionTypeOptions = [
    { value: "all", label: "Tous" },
    { value: "WITHDRAWAL", label: "Retrait" },
    { value: "DEPOSIT", label: "Dépôt" },
]

export function AdminTransactionContent() {
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

    // Fetch statistics
    const { data: statsData, isPending: loadingStats, error: statsError } = useAdminTransactionStatistics()

    // Fetch paginated transactions from backend
    const { data: transactionsQuery, isPending: loadingTransactions, error: transactionsError } = useAdminTransaction(
        {
            page: currentPage,
            search: debouncedSearchQuery,
            platform: selectedPlatform,
            status: selectedStatus,
            transaction_type: selectedTransactionType,
        }
    )

    const { data: platformsData, error: platformError } = usePlatform({})

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

    const getTransactionUserName = (transaction: Transaction) =>
        transaction.user_display_name || "N/A"

    const getTransactionUserEmail = (transaction: Transaction) =>
        transaction.user_email || "N/A"

    const getTransactionUserId = (transaction: Transaction) =>
        transaction.user_id || transaction.user || "N/A"

    const getTransactionTypeBadgeClass = (transactionType: string) =>
        transactionType === "DEPOSIT"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-amber-50 text-amber-700 border-amber-200"

    const handleCopyUserId = async (transaction: Transaction) => {
        const userId = getTransactionUserId(transaction)
        if (userId === "N/A") {
            toast.error("Aucun ID utilisateur a copier")
            return
        }

        try {
            await navigator.clipboard.writeText(userId)
            toast.success("ID utilisateur copie")
        } catch (error) {
            toast.error("Impossible de copier l'ID utilisateur")
            console.error("Error copying user ID:", error)
        }
    }

    const handleCopyExternalId = async (transaction: Transaction) => {
        const externalId = transaction.external_id
        if (!externalId) {
            toast.error("Aucun ID externe a copier")
            return
        }

        try {
            await navigator.clipboard.writeText(externalId)
            toast.success("ID externe copie")
        } catch (error) {
            toast.error("Impossible de copier l'ID externe")
            console.error("Error copying external ID:", error)
        }
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
        if (transactionsError) {
            toast.error("Erreur lors du chargement des transactions")
            console.error("Error loading transactions:", transactionsError)
        }
    }, [transactionsError])

    useEffect(() => {
        if (statsError) {
            toast.error("Erreur lors du chargement des statistiques")
            console.error("Error loading statistics:", statsError)
        }
    }, [statsError])

    useEffect(() => {
        if (platformError) {
            toast.error("Erreur lors du chargement des plateformes")
            console.error("Error loading platforms:", platformError)
        }
    }, [platformError])

    return (
        <DashboardContent>
            <div className="flex gap-6 min-h-[500px]">
                <div className="flex-1 transition-all duration-300" style={{ minWidth: 0 }}>
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Transactions Administrateur</h1>
                        <p className="text-sm text-muted-foreground">
                            Consultez et gérez toutes les transactions du système
                        </p>
                    </div>

                    {/* Statistics Section */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4">Statistiques</h2>
                        {loadingStats ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-24 w-full" />
                                ))}
                            </div>
                        ) : statsData ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="p-4">
                                    <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                                    <p className="text-2xl font-bold">{statsData.overview?.total_transactions || 0}</p>
                                </Card>
                                <Card className="p-4">
                                    <p className="text-sm text-muted-foreground mb-1">Utilisateurs</p>
                                    <p className="text-2xl font-bold">{statsData.overview?.total_users || 0}</p>
                                </Card>
                                <Card className="p-4">
                                    <p className="text-sm text-muted-foreground mb-1">Montant Total</p>
                                    <p className="text-2xl font-bold">{formatCurrency(statsData.amounts?.total || 0)}</p>
                                </Card>
                                <Card className="p-4">
                                    <p className="text-sm text-muted-foreground mb-1">Taux de Succès</p>
                                    <p className="text-2xl font-bold">{(statsData.success_rate?.overall || 0).toFixed(1)}%</p>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-8 bg-card border border-border rounded-lg">
                                <p className="text-muted-foreground">Impossible de charger les statistiques</p>
                            </div>
                        )}
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
                                <div
                                    key={transaction.id}
                                    onClick={() => handleSelectTransaction(transaction)}
                                    className={cn(
                                        "p-4 border-2 rounded-lg bg-card cursor-pointer transition-all hover:shadow-md",
                                        selectedTransaction?.id === transaction.id
                                            ? "border-primary shadow-md"
                                            : "border-border",
                                    )}
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-foreground truncate">{transaction.transaction_id}</p>
                                            <p className="text-sm text-muted-foreground truncate">{transaction.platform_name}</p>
                                            <p className="text-sm text-muted-foreground truncate">{getTransactionUserEmail(transaction)}</p>
                                        </div>

                                        <div className="flex items-center gap-2 self-start sm:self-auto">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                                                    getTransactionTypeBadgeClass(transaction.transaction_type),
                                                )}
                                            >
                                                {transaction.transaction_type_display}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-start sm:items-end gap-2">
                                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                {formatDate(transaction.created_at)}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <p className="font-bold text-foreground whitespace-nowrap">
                                                    {formatCurrency(Number(transaction.amount))}
                                                </p>
                                                <StatusBadge status={transaction.status === "COMPLETED" ? "completed" : transaction.status === "FAILED" ? "failed" : "pending"} />
                                                <ChevronRight className="w-4 h-4 text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                    embedded={false}
                >
                    {selectedTransaction && (
                        <div className="space-y-6">
                            {/* Transaction Header */}
                            <div className="text-center pb-6 border-b border-border">
                                <h2 className="text-lg font-bold text-foreground mb-2">{selectedTransaction.transaction_id}</h2>
                                <div className="flex justify-center mb-2">
                                    <StatusBadge status={selectedTransaction.status === "COMPLETED" ? "completed" : selectedTransaction.status === "FAILED" ? "failed" : "pending"} />
                                </div>
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

                            {/* User Details */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Détails utilisateur</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Nom utilisateur</span>
                                        <span className="text-sm font-medium text-foreground">{getTransactionUserName(selectedTransaction)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Email</span>
                                        <span className="text-sm font-medium text-foreground">{getTransactionUserEmail(selectedTransaction)}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-sm text-muted-foreground">ID utilisateur</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-foreground">{getTransactionUserId(selectedTransaction)}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyUserId(selectedTransaction)}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                                aria-label="Copier l'ID utilisateur"
                                                title="Copier l'ID utilisateur"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                        </div>
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
                                        <div className="inline-flex items-center">
                                            <span className="text-sm font-medium text-foreground">{selectedTransaction.external_id}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyExternalId(selectedTransaction)}
                                                className="text-muted-foreground hover:text-foreground transition-colors ml-2"
                                                aria-label="Copier l'ID externe"
                                                title="Copier l'ID externe"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                        </div>
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