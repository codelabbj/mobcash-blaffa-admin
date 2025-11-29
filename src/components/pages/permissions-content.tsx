"use client"

import { useState, useEffect } from "react"
import { Lock, Trash2 } from "lucide-react"
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
import { usePermission, useUpdatePermission, useDeletePermission } from "@/hooks/use-permission"
import { Permission } from "@/lib/types"
import { toast } from "sonner"
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
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const permissionStatusOptions = [
    { value: "all", label: "Tous" },
    { value: "deposit", label: "Dépôt autorisé" },
    { value: "withdraw", label: "Retrait autorisé" },
]

const editPermissionSchema = z.object({
    can_deposit: z.boolean().default(true),
    can_withdraw: z.boolean().default(true),
    daily_deposit_limit: z.number().min(0).optional(),
    daily_withdrawal_limit: z.number().min(0).optional(),
})

type EditPermissionInput = z.infer<typeof editPermissionSchema>

export function PermissionsContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
    const [showEditForm, setShowEditForm] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const itemsPerPage = 10

    // API hooks
    const { data: permissionsData, error, isLoading } = usePermission()
    const updatePermissionMutation = useUpdatePermission()
    const deletePermissionMutation = useDeletePermission()

    // Form for editing permission
    const editForm = useForm<EditPermissionInput>({
        resolver: zodResolver(editPermissionSchema),
        defaultValues: {
            can_deposit: selectedPermission?.can_deposit ?? true,
            can_withdraw: selectedPermission?.can_withdraw ?? true,
            daily_deposit_limit: selectedPermission?.daily_deposit_limit ? Number(selectedPermission.daily_deposit_limit) : undefined,
            daily_withdrawal_limit: selectedPermission?.daily_withdrawal_limit ? Number(selectedPermission.daily_withdrawal_limit) : undefined,
        },
    })

    // Handle API errors
    useEffect(() => {
        if (error) {
            toast.error("Échec du chargement des permissions, veuillez réessayer")
            console.error("Error loading permissions:", error)
        }
    }, [error])

    // Filter data
    const filteredData = permissionsData?.results.filter((item) => {
        const matchesSearch =
            item.platform_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.platform_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.user.toLowerCase().includes(searchQuery.toLowerCase())

        let matchesStatus = true
        if (selectedStatus && selectedStatus !== "all") {
            if (selectedStatus === "deposit") {
                matchesStatus = item.can_deposit
            } else if (selectedStatus === "withdraw") {
                matchesStatus = item.can_withdraw
            }
        }

        return matchesSearch && matchesStatus
    }) || []

    const totalPages = Math.ceil((permissionsData?.count || 0) / (permissionsData?.page_size || itemsPerPage))
    const startIndex = (currentPage - 1) * (permissionsData?.page_size || itemsPerPage)
    const endIndex = startIndex + (permissionsData?.page_size || itemsPerPage)
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

    const handleSelectPermission = (permission: Permission) => {
        setSelectedPermission(permission)
        setShowEditForm(false)
        setPanelOpen(true)
    }

    const handleDeletePermission = () => {
        if (!selectedPermission) return
        setShowDeleteDialog(true)
    }

    const confirmDeletePermission = async () => {
        if (!selectedPermission) return

        setShowDeleteDialog(false)
        setIsProcessing(true)
        try {
            deletePermissionMutation.mutate(selectedPermission.id, {
                onSuccess: () => {
                    toast.success("Permission supprimée avec succès")
                    setPanelOpen(false)
                    setSelectedPermission(null)
                },
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleEditPermission = async (data: EditPermissionInput) => {
        if (!selectedPermission) return
        setIsProcessing(true)
        try {
            updatePermissionMutation.mutate({
                id: selectedPermission.id,
                data: {
                    can_deposit: data.can_deposit,
                    can_withdraw: data.can_withdraw,
                    daily_deposit_limit: data.daily_deposit_limit,
                    daily_withdrawal_limit: data.daily_withdrawal_limit,
                }
            }, {
                onSuccess: () => {
                    setSelectedPermission({
                        ...selectedPermission,
                        can_deposit: data.can_deposit,
                        can_withdraw: data.can_withdraw,
                        daily_deposit_limit: data.daily_deposit_limit?.toString() || selectedPermission.daily_deposit_limit,
                        daily_withdrawal_limit: data.daily_withdrawal_limit?.toString() || selectedPermission.daily_withdrawal_limit,
                    })
                    setShowEditForm(false)
                    editForm.reset()
                }
            })
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <DashboardContent>
            <div className="flex gap-6 min-h-[500px]">
                <div className={cn("transition-all duration-300", panelOpen ? "flex-1 lg:max-w-[calc(100%-320px)]" : "flex-1")} style={{minWidth: 0}}>
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold">Permissions</p>
                            <p className="text-sm text-muted-foreground">
                                Gérer les permissions des utilisateurs
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
                                    options: permissionStatusOptions,
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
                        {filteredData.length} permission{filteredData.length !== 1 ? "s" : ""}
                    </p>

                    {/* Cards List */}
                    <div className="space-y-3 mb-6">
                        {isLoading ? (
                            [1, 2, 3, 4].map((i) => (
                                <RequestCardSkeleton key={i} />
                            ))
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map((permission) => (
                                <RequestCard
                                    key={permission.id}
                                    icon={<Lock className="w-6 h-6" />}
                                    title={permission.platform_name}
                                    subtitle={`Utilisateur: ${permission.user}`}
                                    badge={
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 px-2.5 py-1 bg-muted rounded-md">
                                                <span className="text-xs text-muted-foreground font-medium">Dépôt</span>
                                                <StatusBadge status={permission.can_deposit ? "active" : "inactive"} />
                                            </div>
                                            <div className="flex items-center gap-2 px-2.5 py-1 bg-muted rounded-md">
                                                <span className="text-xs text-muted-foreground font-medium">Retrait</span>
                                                <StatusBadge status={permission.can_withdraw ? "active" : "inactive"} />
                                            </div>
                                        </div>
                                    }
                                    details={[
                                        { label: "Code plateforme", value: permission.platform_code },
                                        { label: "Créée le", value: formatDate(permission.created_at) },
                                    ]}
                                    onClick={() => handleSelectPermission(permission)}
                                    isSelected={selectedPermission?.id === permission.id}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                                <p className="text-muted-foreground">Aucune permission trouvée</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {paginatedData.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-muted-foreground mb-2 w-full">
                                Affichage de {startIndex + 1} à {Math.min(endIndex, permissionsData?.results.length || 0)} sur{" "}
                                {permissionsData?.results.length} résultat{permissionsData?.results.length || 0 > 1 ? "s" : ""}
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
                        setSelectedPermission(null)
                        setShowEditForm(false)
                    }}
                    title={showEditForm ? "Modifier la permission" : "Détails de la permission"}
                    embedded={true}
                    footer={
                        showEditForm ? (
                            <div className="flex gap-3">
                                <Button type="submit" form="edit-permission-form" className="flex-1" disabled={isProcessing}>
                                    Enregistrer
                                </Button>
                                <Button onClick={() => setShowEditForm(false)} variant="outline" className="flex-1" disabled={isProcessing}>
                                    Annuler
                                </Button>
                            </div>
                        ) : (
                            selectedPermission && (
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setShowEditForm(true)}
                                        className="flex-1"
                                        disabled={isProcessing}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        onClick={handleDeletePermission}
                                        variant="destructive"
                                        className="flex-1"
                                        disabled={isProcessing}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Supprimer
                                    </Button>
                                </div>
                            )
                        )
                    }
                >
                    {selectedPermission && (
                        <div className="space-y-6">
                            {/* Permission Profile */}
                            <div className="text-center pb-6 border-b border-border">
                                <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                                    <Lock className="w-8 h-8" />
                                </div>
                                <h2 className="text-lg font-bold text-foreground">{selectedPermission.platform_name}</h2>
                                <p className="text-sm text-muted-foreground">{selectedPermission.platform_code}</p>
                            </div>

                            {/* Permission Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Informations générales</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Utilisateur</span>
                                        <span className="text-sm font-medium text-foreground">{selectedPermission.user}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Code plateforme</span>
                                        <span className="text-sm font-medium text-foreground">{selectedPermission.platform_code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Créée le</span>
                                        <span className="text-sm font-medium text-foreground">{formatDate(selectedPermission.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Mise à jour</span>
                                        <span className="text-sm font-medium text-foreground">{formatDate(selectedPermission.updated_at)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Permission Details */}
                            {!showEditForm && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Détails des permissions</h3>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-muted rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-foreground">Dépôt autorisé</span>
                                                <StatusBadge status={selectedPermission.can_deposit ? "active" : "inactive"} />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Limite: {formatCurrency(Number(selectedPermission.daily_deposit_limit))}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-muted rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-foreground">Retrait autorisé</span>
                                                <StatusBadge status={selectedPermission.can_withdraw ? "active" : "inactive"} />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Limite: {formatCurrency(Number(selectedPermission.daily_withdrawal_limit))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Edit Permission Form */}
                            {showEditForm && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Modifier la permission</h3>
                                    <Form {...editForm}>
                                        <form
                                            id="edit-permission-form"
                                            onSubmit={editForm.handleSubmit(handleEditPermission)}
                                            className="space-y-4"
                                        >
                                            <FormField
                                                control={editForm.control}
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
                                                control={editForm.control}
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
                                                control={editForm.control}
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
                                                control={editForm.control}
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer la permission</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette permission ? Cette action ne peut pas être annulée.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isProcessing}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeletePermission}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Suppression..." : "Supprimer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardContent>
    )
}