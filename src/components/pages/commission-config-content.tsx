"use client"

import {useEffect, useState} from "react"
import {Settings} from "lucide-react"
import {cn, formatDate} from "@/lib/utils"
import {DashboardContent} from "@/components/layout/dashboard-content"
import {RequestCard} from "@/components/ui/request-card"
import {SidePanel} from "@/components/ui/side-panel"
import {Button} from "@/components/ui/button"
import RequestCardSkeleton from "@/components/ui/request-card-skeleton"
import {toast} from "sonner"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {useCommissionConfig, useEditCommissionConfig} from "@/hooks/use-commission-config"
import {CommissionConfig} from "@/lib/types"

const editCommissionConfigSchema = z.object({
    deposit_commission_rate: z.string().min(0, "Le taux de commission de dépôt est requis"),
    withdrawal_commission_rate: z.string().min(0, "Le taux de commission de retrait est requis"),
})

type EditCommissionConfigInput = z.infer<typeof editCommissionConfigSchema>

export default function CommissionConfigContent() {
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedConfig, setSelectedConfig] = useState<CommissionConfig | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 6

    // API hooks
    const { data: commissionsData, isLoading, error } = useCommissionConfig()
    const editConfigMutation = useEditCommissionConfig()

    // Form for editing commission config
    const configForm = useForm<EditCommissionConfigInput>({
        resolver: zodResolver(editCommissionConfigSchema),
        defaultValues: {
            deposit_commission_rate: "0",
            withdrawal_commission_rate: "0",
        },
    })

    // Update form values when a config is selected
    useEffect(() => {
        if (selectedConfig) {
            configForm.reset({
                deposit_commission_rate: selectedConfig.deposit_commission_rate,
                withdrawal_commission_rate: selectedConfig.withdrawal_commission_rate,
            })
        }
    }, [selectedConfig, configForm])

    // Handle error
    useEffect(() => {
        if (error) {
            toast.error("Échec du chargement des configurations de commission, veuillez réessayer")
            console.error("Error loading commission configs:", error)
        }
    }, [error])

    // Filter data
    const filteredData = commissionsData?.results.filter((item) => {
        return item.user_email.toLowerCase().includes(searchQuery.toLowerCase())
    }) || []

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = filteredData.slice(startIndex, endIndex)

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
        setCurrentPage(1)
    }

    const handleSelectConfig = (config: CommissionConfig) => {
        setSelectedConfig(config)
        setPanelOpen(true)
    }

    const handleEditConfig = (data: EditCommissionConfigInput) => {
        if (!selectedConfig) return
        setIsProcessing(true)
        try {
            editConfigMutation.mutate({
                id : selectedConfig.id,
                data:{
                    deposit_commission_rate:Number(data.deposit_commission_rate),
                    withdrawal_commission_rate:Number(data.withdrawal_commission_rate),
                }
            })
            configForm.reset()
            setPanelOpen(false)
        } catch (error) {
            console.error("Error editing commission config:", error)
            toast.error("Erreur lors de la mise à jour de la configuration de commission")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <DashboardContent>
            <div className="flex gap-6 min-h-[500px]">
                {/* List Section */}
                <div className={cn("transition-all duration-300", panelOpen ? "flex-1 lg:max-w-[calc(100%-320px)]" : "flex-1")} style={{ minWidth: 0 }}>
                    {/* Header */}
                    <div className="mb-6 space-y-2">
                        <p className="text-2xl font-bold">Configuration des Commissions</p>
                        <p className="text-sm text-muted-foreground">Gérer les taux de commission pour les utilisateurs</p>
                    </div>

                    <p className="text-muted-foreground mb-2">
                        {filteredData.length} configuration{filteredData.length !== 1 ? "s" : ""}
                    </p>

                    {/* Configs List */}
                    <div className="space-y-3 mb-6">
                        {isLoading ? (
                            [1, 2, 3, 4].map((i) => (
                                <RequestCardSkeleton key={i} />
                            ))
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map((config) => (
                                <RequestCard
                                    key={config.id}
                                    icon={<Settings className="w-6 h-6" />}
                                    title={config.user_email}
                                    subtitle={`ID: ${config.id}`}
                                    details={[
                                        { label: "Taux Dépôt", value: `${config.deposit_commission_rate}%` },
                                        { label: "Taux Retrait", value: `${config.withdrawal_commission_rate}%` },
                                        { label: "Créé le", value: formatDate(config.created_at) },
                                    ]}
                                    onClick={() => handleSelectConfig(config)}
                                    isSelected={selectedConfig?.id === config.id}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                                <p className="text-muted-foreground">Aucune configuration de commission trouvée</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {paginatedData.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-muted-foreground mb-2 w-full">
                                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredData.length)} sur {filteredData.length} résultat{filteredData.length > 1 ? "s" : ""}
                            </p>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage > 1) setCurrentPage(currentPage - 1)
                                            }}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                    {getPageNumber().map((page, index) =>
                                        page === "ellipsis" ? (
                                            <PaginationItem key={`ellipsis-${index}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        ) : (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setCurrentPage(page as number)
                                                    }}
                                                    isActive={currentPage === page}
                                                    className="cursor-pointer"
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    )}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                                            }}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
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
                        setSelectedConfig(null)
                    }}
                    title="Modifier Configuration de Commission"
                    embedded={true}
                    footer={
                        selectedConfig && (
                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    form="edit-commission-config-form"
                                    className="flex-1"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Mise à jour..." : "Mettre à jour"}
                                </Button>
                                <Button
                                    onClick={() => setPanelOpen(false)}
                                    variant="outline"
                                    className="flex-1"
                                    disabled={isProcessing}
                                >
                                    Annuler
                                </Button>
                            </div>
                        )
                    }
                >
                    {selectedConfig && (
                        <div className="space-y-6">
                            {/* User Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Informations Utilisateur</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Email</span>
                                        <span className="text-sm font-medium text-foreground">{selectedConfig.user_email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Créé le</span>
                                        <span className="text-sm font-medium text-foreground">{formatDate(selectedConfig.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Mis à jour le</span>
                                        <span className="text-sm font-medium text-foreground">{formatDate(selectedConfig.updated_at)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Commission Config Form */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Taux de Commission</h3>
                                <Form {...configForm}>
                                    <form
                                        id="edit-commission-config-form"
                                        onSubmit={configForm.handleSubmit(handleEditConfig)}
                                        className="space-y-4"
                                    >
                                        <FormField
                                            control={configForm.control}
                                            name="deposit_commission_rate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Taux de Commission Dépôt (%)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            step="0.01"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={configForm.control}
                                            name="withdrawal_commission_rate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Taux de Commission Retrait (%)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            step="0.01"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                                </Form>
                            </div>

                            {/* Current Configuration Display */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Configuration Actuelle</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Taux Dépôt</span>
                                        <span className="text-sm font-bold text-foreground">{selectedConfig.deposit_commission_rate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Taux Retrait</span>
                                        <span className="text-sm font-bold text-foreground">{selectedConfig.withdrawal_commission_rate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Statut</span>
                                        <span className="text-sm font-medium text-foreground">
                                            {selectedConfig.is_active ? "Actif" : "Inactif"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </SidePanel>
            </div>
        </DashboardContent>
    )
}