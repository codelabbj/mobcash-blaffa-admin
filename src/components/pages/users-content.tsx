"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"
import { cn, formatDate, formatCurrency } from "@/lib/utils"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { FilterSection } from "@/components/ui/filter-section"
import { RequestCard } from "@/components/ui/request-card"
import { SidePanel } from "@/components/ui/side-panel"
import { StatusBadge } from "@/components/ui/status-badge"
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import {
    useUsers, useUserWallet, useUserTransactions, useUserPermissions, useActiveUser, useDeactivateUser,
} from "@/hooks/use-users"
import { useCommission, usePayCommission } from "@/hooks/use-commission"
import { AppUser } from "@/lib/types"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import RequestCardSkeleton from "@/components/ui/request-card-skeleton"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { usePlatform } from "@/hooks/use-platform"
import { useAddUserPermission } from "@/hooks/use-users"

const statusOptions = [
    { value: "all", label: "Tous" },
    { value: "true", label: "Actif" },
    { value: "false", label: "Inactif" },
]

const addPermissionSchema = z.object({
    platform: z.string().min(1, "La plateforme est requise"),
    can_deposit: z.boolean().default(true),
    can_withdraw: z.boolean().default(true),
    daily_deposit_limit: z.number().min(0).optional(),
    daily_withdrawal_limit: z.number().min(0).optional(),
})

type AddPermissionInput = z.infer<typeof addPermissionSchema>

export function UsersContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<AppUser | null>(null)
    const [showAddPermissionForm, setShowAddPermissionForm] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const itemsPerPage = 10

    // API hooks - Always call hooks at the top level (required by React Rules of Hooks)
    const { data: users, error, isLoading } = useUsers()
    const activeUserMutation = useActiveUser()
    const deactivateUserMutation = useDeactivateUser()
    const { data: platformsData, isLoading: loadingPlatforms, error: platformError } = usePlatform()
    const addPermissionMutation = useAddUserPermission()

    // Form for adding permission
    const permissionForm = useForm<AddPermissionInput>({
        resolver: zodResolver(addPermissionSchema),
        defaultValues: {
            platform: "",
            can_deposit: true,
            can_withdraw: true,
            daily_deposit_limit: undefined,
            daily_withdrawal_limit: undefined,
        },
    })

    // Wallet, Transactions, and Permissions hooks - will be triggered manually when user is selected
    const walletQuery = useUserWallet(selectedUser?.id || "")
    const transactionsQuery = useUserTransactions(selectedUser?.id || "")
    const permissionsQuery = useUserPermissions(selectedUser?.id || "")
    const commissionsQuery = useCommission({ user_id: selectedUser?.id, type: "PENDING" })
    const payCommissionMutation = usePayCommission()

    // Load user data when a user is selected
    useEffect(() => {
        if (selectedUser && panelOpen) {
            walletQuery.mutate()
            transactionsQuery.mutate()
            permissionsQuery.mutate()
        }
    }, [selectedUser?.id, panelOpen])

    // Reset form when user is selected
    useEffect(() => {
        if (selectedUser) {
            permissionForm.reset({
                platform: "",
                can_deposit: true,
                can_withdraw: true,
                daily_deposit_limit: undefined,
                daily_withdrawal_limit: undefined,
            })
        }
    }, [selectedUser?.id])

    // Handle platform load error
    useEffect(() => {
        if (platformError) {
            toast.error("Échec du chargement des plateformes, veuillez réessayer")
            console.error("Error loading platforms:", platformError)
        }
    }, [platformError])

    // Filter data
    const filteredData = users?.results.filter((item) => {
        const matchesSearch =
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.phone_number.includes(searchQuery)
        const matchesStatus = !selectedStatus || selectedStatus === "all" || String(item.is_active) === selectedStatus

        return matchesSearch && matchesStatus
    }) || []

    const totalPages = Math.ceil((users?.count || 0) / (users?.page_size || itemsPerPage))
    const startIndex = (currentPage - 1) * (users?.page_size || itemsPerPage)
    const endIndex = startIndex + (users?.page_size || itemsPerPage)
    const paginatedData = filteredData

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

    const handleSelectUser = (user: AppUser) => {
        setSelectedUser(user)
        setShowAddPermissionForm(false)
        setPanelOpen(true)
    }

    const handleToggleStatus = async () => {
        if (!selectedUser) return
        setIsProcessing(true)
        try {
            if (selectedUser.is_active) {
                deactivateUserMutation?.mutate(selectedUser.id,{
                    onSuccess: () => {
                        setSelectedUser({...selectedUser, is_active: !selectedUser.is_active})
                    }
                })
            } else {
                activeUserMutation?.mutate(selectedUser.id,{
                    onSuccess: () => {
                        setSelectedUser({...selectedUser, is_active: !selectedUser.is_active})
                    }
                })
            }
        } finally {
            setIsProcessing(false)
        }
    }

    const handleAddPermission = async (data: AddPermissionInput) => {
        if (!selectedUser) return
        setIsProcessing(true)
        try {
            addPermissionMutation.mutate({
                id: selectedUser.id,
                data: {
                    platform: data.platform,
                    can_deposit: data.can_deposit,
                    can_withdraw: data.can_withdraw,
                    daily_deposit_limit: data.daily_deposit_limit,
                    daily_withdrawal_limit: data.daily_withdrawal_limit,
                }
            })
            permissionForm.reset()
            setShowAddPermissionForm(false)
            permissionsQuery.mutate()
        } catch (error) {
            console.error("Error adding permission:", error)
            toast.error("Erreur lors de l'ajout de la permission")
        } finally {
            setIsProcessing(false)
        }
    }

    const handlePayCommission = async () => {
        if (!selectedUser) return
        setIsProcessing(true)
        try {
            payCommissionMutation.mutate({
                user_id: selectedUser.id,
                period_year: null,
                period_month: null,
                notes: ""
            })
        } finally {
            setIsProcessing(false)
        }
    }

    useEffect(() => {
        if (error) {
            toast.error("Échec du chargement des utilisateurs, veuillez réessayer")
            console.error("Error loading users:", error)
        }
    }, [error])


    return (
        <DashboardContent>
            <div className="flex gap-6 min-h-[500px]">
                <div className={cn("transition-all duration-300", panelOpen ? "flex-1 lg:max-w-[calc(100%-320px)]" : "flex-1")} style={{minWidth: 0}}>
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold">Utilisateurs</p>
                            <p className="text-sm text-muted-foreground">
                                Gérer les utilisateurs de votre plateforme
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
                            ]}
                            onClearAll={handleClearFilters}
                        />
                    </div>

                    <p className="text-muted-foreground mb-2">
                        {filteredData.length} utilisateur{filteredData.length !== 1 ? "s" : ""}
                    </p>

                    {/* Cards List */}
                    <div className="space-y-3 mb-6">
                        {isLoading ? (
                            [1, 2, 3, 4].map((i) => (
                                <RequestCardSkeleton key={i} />
                            ))
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map((user) => (
                                <RequestCard
                                    key={user.id}
                                    icon={<User className="w-6 h-6" />}
                                    title={`${user.first_name} ${user.last_name}`}
                                    subtitle={user.email}
                                    badge={<StatusBadge status={user.is_active ? "active" : "inactive"} />}
                                    details={[
                                        { label: "Type", value: user.user_type },
                                        { label: "Créé le", value: formatDate(user.created_at) },
                                    ]}
                                    onClick={() => handleSelectUser(user)}
                                    isSelected={selectedUser?.id === user.id}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                                <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {paginatedData.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-muted-foreground mb-2 w-full">
                                Affichage de {startIndex + 1} à {Math.min(endIndex, users?.results.length || 0)} sur{" "}
                                {users?.results.length} résultat{users?.results.length || 0 > 1 ? "s" : ""}
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

                {/* Panel Section - Embedded on desktop, hidden on mobile */}
                <SidePanel
                    isOpen={panelOpen}
                    onClose={() => {
                        setPanelOpen(false)
                        setSelectedUser(null)
                        setShowAddPermissionForm(false)
                    }}
                    title={showAddPermissionForm ? "Ajouter une permission" : "Détails de l'utilisateur"}
                    embedded={true}
                    footer={
                        showAddPermissionForm ? (
                            <div className="flex gap-3">
                                <Button type="submit" form="add-permission-form" className="flex-1" disabled={isProcessing}>
                                    Ajouter
                                </Button>
                                <Button onClick={() => setShowAddPermissionForm(false)} variant="outline" className="flex-1" disabled={isProcessing}>
                                    Annuler
                                </Button>
                            </div>
                        ) : (
                            selectedUser && (
                                <Button
                                    onClick={handleToggleStatus}
                                    disabled={isProcessing}
                                    variant={selectedUser.is_active ? "destructive" : "default"}
                                    className="w-full"
                                >
                                    {isProcessing
                                        ? "Traitement..."
                                        : selectedUser.is_active
                                            ? "Désactiver"
                                            : "Activer"}
                                </Button>
                            )
                        )
                    }
                >
                    {selectedUser && (
                        <div className="space-y-6">
                            {/* User Profile */}
                            <div className="text-center pb-6 border-b border-border">
                                <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                                    {(selectedUser.first_name[0] + selectedUser.last_name[0]).toUpperCase()}
                                </div>
                                <h2 className="text-lg font-bold text-foreground">{selectedUser.first_name} {selectedUser.last_name}</h2>
                                <p className="text-sm text-muted-foreground">{selectedUser.user_type}</p>
                            </div>

                            {/* Personal Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Informations personnelles</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Email</span>
                                        <span className="text-sm font-medium text-foreground">{selectedUser.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Téléphone</span>
                                        <span className="text-sm font-medium text-foreground">{selectedUser.phone_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Créé le</span>
                                        <span className="text-sm font-medium text-foreground">{formatDate(selectedUser.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Email vérifié</span>
                                        <span className="text-sm font-medium text-foreground">
                                            {selectedUser.email_verified ? "Oui" : "Non"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Wallet Information */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Portefeuille</h3>
                                {walletQuery?.isPending ? (
                                    <div className="space-y-3">
                                        <Skeleton className="h-5 w-full" />
                                        <Skeleton className="h-5 w-3/4" />
                                    </div>
                                ) : walletQuery?.data ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Solde</span>
                                            <span className="text-sm font-bold text-foreground">
                                                {formatCurrency(Number(walletQuery.data.balance))} {walletQuery.data.currency}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Dernière mise à jour</span>
                                            <span className="text-sm font-medium text-foreground">
                                                {formatDate(walletQuery.data.updated_at)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Aucun portefeuille trouvé</p>
                                )}
                            </div>

                            {/* Transactions */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                                    Transactions récentes ({transactionsQuery?.data?.results.length || 0})
                                </h3>
                                {transactionsQuery?.isPending ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <Skeleton key={i} className="h-5 w-full" />
                                        ))}
                                    </div>
                                ) : transactionsQuery?.data && transactionsQuery.data.results.length > 0 ? (
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {transactionsQuery.data.results.slice(0, 5).map((trans) => (
                                            <div key={trans.id} className="flex justify-between items-center p-2 bg-muted rounded">
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-foreground">{trans.transaction_id}</p>
                                                    <p className="text-xs text-muted-foreground">{trans.status_display}</p>
                                                </div>
                                                <span className="text-sm font-medium text-foreground">
                                                    {formatCurrency(Number(trans.amount))}
                                                </span>
                                            </div>
                                        ))}
                                        {transactionsQuery.data.results.length > 5 && (
                                            <p className="text-xs text-muted-foreground text-center pt-2">
                                                +{transactionsQuery.data.results.length - 5} de plus
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Aucune transaction trouvée</p>
                                )}
                            </div>

                            {/* Commissions */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                                    Commissions en attente ({commissionsQuery?.data?.results.length || 0})
                                </h3>
                                {commissionsQuery?.isLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2].map((i) => (
                                            <Skeleton key={i} className="h-5 w-full" />
                                        ))}
                                    </div>
                                ) : commissionsQuery?.data && commissionsQuery.data.results.length > 0 ? (
                                    <>
                                        <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                                            {commissionsQuery.data.results.slice(0, 5).map((commission) => (
                                                <div key={commission.id} className="flex justify-between items-center p-2 bg-muted rounded">
                                                    <div className="flex-1">
                                                        <p className="text-xs font-medium text-foreground">{commission.id}</p>
                                                        <p className="text-xs text-muted-foreground">{commission.status_display}</p>
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground">
                                                        {formatCurrency(Number(commission.commission_amount))}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        {commissionsQuery.data.results.length > 5 && (
                                            <p className="text-xs text-muted-foreground text-center mb-4">
                                                +{commissionsQuery.data.results.length - 5} de plus
                                            </p>
                                        )}
                                        <Button onClick={handlePayCommission} className="w-full" disabled={isProcessing || commissionsQuery.isPending}>
                                            {isProcessing ? "Paiement en cours..." : "Payer la commission"}
                                        </Button>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Aucune commission en attente</p>
                                )}
                            </div>

                            {/* Permissions */}
                            {!showAddPermissionForm && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                                        Permissions ({permissionsQuery?.data?.length || 0})
                                    </h3>
                                    {permissionsQuery?.isPending ? (
                                        <div className="space-y-3">
                                            {[1, 2].map((i) => (
                                                <Skeleton key={i} className="h-5 w-full" />
                                            ))}
                                        </div>
                                    ) : permissionsQuery?.data && permissionsQuery.data.length > 0 ? (
                                        <div className="space-y-3 max-h-48 overflow-y-auto">
                                            {permissionsQuery.data.map((perm) => (
                                                <div key={perm.id} className="p-3 bg-muted rounded-lg">
                                                    <p className="text-sm font-medium text-foreground mb-2">
                                                        {perm.platform_name} ({perm.platform_code})
                                                    </p>
                                                    <div className="space-y-1 text-xs text-muted-foreground">
                                                        <div className="flex justify-between">
                                                            <span>Dépôt autorisé :</span>
                                                            <span className="text-foreground">
                                                                {perm.can_deposit ? "Oui" : "Non"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Retrait autorisé :</span>
                                                            <span className="text-foreground">
                                                                {perm.can_withdraw ? "Oui" : "Non"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Limite dépôt/jour :</span>
                                                            <span className="text-foreground">
                                                                {formatCurrency(Number(perm.daily_deposit_limit))}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Limite retrait/jour :</span>
                                                            <span className="text-foreground">
                                                                {formatCurrency(Number(perm.daily_withdrawal_limit))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Aucune permission trouvée</p>
                                    )}
                                    <Button onClick={() => setShowAddPermissionForm(true)} className="w-full mt-4" disabled={isProcessing || loadingPlatforms}>
                                        Ajouter une permission
                                    </Button>
                                </div>
                            )}

                            {/* Add Permission Form */}
                            {showAddPermissionForm && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Ajouter une permission</h3>
                                    <Form {...permissionForm}>
                                        <form
                                            id="add-permission-form"
                                            onSubmit={permissionForm.handleSubmit(handleAddPermission)}
                                            className="space-y-4"
                                        >
                                            <FormField
                                                control={permissionForm.control}
                                                name="platform"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Plateforme</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger disabled={loadingPlatforms}>
                                                                    <SelectValue placeholder="Sélectionnez une plateforme" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {platformsData?.results.map((platform) => (
                                                                    <SelectItem key={platform.id} value={platform.id}>
                                                                        {platform.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={permissionForm.control}
                                                name="can_deposit"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-lg border border-input p-3">
                                                        <FormLabel className="text-xs font-medium">Autoriser le dépôt</FormLabel>
                                                        <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={permissionForm.control}
                                                name="can_withdraw"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-lg border border-input p-3">
                                                        <FormLabel className="text-xs font-medium">Autoriser le retrait</FormLabel>
                                                        <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={permissionForm.control}
                                                name="daily_deposit_limit"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Limite dépôt/jour (optionnel)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={permissionForm.control}
                                                name="daily_withdrawal_limit"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Limite retrait/jour (optionnel)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </form>
                                    </Form>
                                </div>
                            )}
                        </div>
                    )}
                </SidePanel>

                </div>
        </DashboardContent>
    )
}