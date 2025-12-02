"use client"

import {useEffect, useState} from "react"
import {Boxes, Plus} from "lucide-react"
import {cn, formatDate} from "@/lib/utils"
import {DashboardContent} from "@/components/layout/dashboard-content"
import {FilterSection} from "@/components/ui/filter-section"
import {RequestCard} from "@/components/ui/request-card"
import {SidePanel} from "@/components/ui/side-panel"
import {StatusBadge} from "@/components/ui/status-badge"
import {Button} from "@/components/ui/button"
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {usePlatform, useCreatePlatform, useUpdatePlatform, usePlatformStats} from "@/hooks/use-platform"
import {Platform, PlatformStats} from "@/lib/types"
import {toast} from "sonner"
import RequestCardSkeleton from "@/components/ui/request-card-skeleton"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch";

const statusOptions = [
    {value: "all", label: "Tous"},
    {value: "true", label: "Actif"},
    {value: "false", label: "Inactif"},
]

interface PlatformFormData {
    name: string
    code: string
    api_base_url: string
    description: string
}

interface PlatformEditData {
    description: string
    is_active: boolean
}

export function PlatformsContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
    const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

    const itemsPerPage = 6
    const [isProcessing, setIsProcessing] = useState(false)
    const [isLoadingStats, setIsLoadingStats] = useState(false)

    // Form states
    const [formData, setFormData] = useState<PlatformFormData>({
        name: "",
        code: "",
        api_base_url: "",
        description: "",
    })

    const [editFormData, setEditFormData] = useState<PlatformEditData>({
        description: "",
        is_active: true,
    })

    useEffect(() => {
        const debouncer = setTimeout(
            ()=>{
                setDebouncedSearchQuery(searchQuery)
                setCurrentPage(1)
            },500
        )
        return ()=>clearTimeout(debouncer)
    }, [searchQuery]);

    const {data: platforms, error, isLoading} = usePlatform({page:currentPage,is_active:selectedStatus,search:debouncedSearchQuery})
    const createPlatform = useCreatePlatform()
    const updatePlatform = useUpdatePlatform()
    const loadStats = usePlatformStats()

    const totalPages = Math.ceil((platforms?.count || 0) / (platforms?.page_size || itemsPerPage))
    const startIndex = (currentPage - 1) * (platforms?.page_size || itemsPerPage)
    const endIndex = startIndex + (platforms?.page_size || itemsPerPage)
    const paginatedData = platforms?.results || []

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

    const resetForm = () => {
        setFormData({
            name: "",
            code: "",
            api_base_url: "",
            description: "",
        })
    }

    const handleSelectPlatform = async (platform: Platform) => {
        setSelectedPlatform(platform)
        setEditMode(false)
        setPlatformStats(null)
        setIsLoadingStats(true)
        setEditFormData({
            description: "",
            is_active: platform.is_active,
        })
        setPanelOpen(true)

        try {
            // Load platform stats
            loadStats.mutate(platform.id, {
                onSuccess: (data) => {
                    setPlatformStats(data)
                },
                onError: () => {
                    toast.error("Erreur lors du chargement des statistiques")
                }
            })
        } finally {
            setIsLoadingStats(false)
        }
    }

    const handleCreateClick = () => {
        resetForm()
        setCreateDialogOpen(true)
    }

    const handleCreateSubmit = async () => {
        if (!formData.name || !formData.code || !formData.api_base_url) {
            toast.error("Veuillez remplir tous les champs obligatoires")
            return
        }

        setIsProcessing(true)
        try {
            createPlatform.mutate(formData, {
                onSuccess: () => {
                    setCreateDialogOpen(false)
                    resetForm()
                },
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleEditSubmit = async () => {
        if (!selectedPlatform) return

        setIsProcessing(true)
        try {
            updatePlatform.mutate(
                {
                    id: selectedPlatform.id,
                    data: {
                        description: editFormData.description,
                        is_active: editFormData.is_active,
                    },
                },
                {
                    onSuccess: () => {
                        setEditMode(false)
                        setSelectedPlatform(null)
                        setPanelOpen(false)
                    },
                }
            )
        } finally {
            setIsProcessing(false)
        }
    }

    const handleEditCancel = () => {
        setEditMode(false)
        setEditFormData({
            description: "",
            is_active: selectedPlatform?.is_active ?? true,
        })
    }

    useEffect(() => {
        if (error) {
            toast.error("Echec du chargement des plateformes, veuillez réessayer")
            console.log("An error occurred during platforms loading:", error)
        }
    }, [error])

    return (
        <DashboardContent>

            {/* Grid Cards */}
            <div className="flex gap-6 min-h-[500px]">

                {/* List Section */}
                <div className={cn("transition-all duration-300", panelOpen ? "flex-1 lg:max-w-[calc(100%-320px)]" : "flex-1")} style={{minWidth: 0}}>
                    {/* Header */}
                    <div className="mb-6 space-y-2 flex justify-between items-start">
                        <div>
                            <p className="text-2xl font-bold">Plateformes</p>
                            <p className="text-sm text-muted-foreground">Gérer vos plateformes de jeux</p>
                        </div>
                        <Button onClick={handleCreateClick} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Créer une plateforme
                        </Button>
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
                        {platforms?.results.length} plateforme{platforms?.results.length !== 1 ? "s" : ""}
                    </p>

                    {/* Cards List */}
                    <div className="space-y-3 mb-6">
                        {
                            isLoading ? [1, 2, 3, 4].map((item) => (
                                <RequestCardSkeleton key={item}/>
                            ))
                                : paginatedData.length > 0 ? (
                                paginatedData.map((platform) => (
                                    <RequestCard
                                        key={platform.id}
                                        icon={<Boxes className="w-6 h-6" />}
                                        title={platform.name}
                                        subtitle={platform.code}
                                        badge={<StatusBadge status={platform.is_active ? "active" : "inactive"} />}
                                        details={[
                                            {label: "Créée le", value: formatDate(platform.created_at)},
                                        ]}
                                        onClick={() => handleSelectPlatform(platform)}
                                        isSelected={selectedPlatform?.id === platform.id}
                                    />
                                ))
                            ) : (
                                <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                                    <p className="text-muted-foreground">Aucune plateforme trouvée</p>
                                </div>
                            )
                        }
                    </div>

                    {/* Pagination */}
                    {paginatedData.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-muted-foreground mb-2 w-full">
                                Affichage de {startIndex + 1} à {Math.min(endIndex, platforms?.results.length || 0)} sur{" "}
                                {platforms?.results.length} résultat{platforms?.results.length || 0 > 1 ? "s" : ""}
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

                {/* Panel Section */}
                <SidePanel
                    isOpen={panelOpen}
                    onClose={() => {
                        setPanelOpen(false)
                        setSelectedPlatform(null)
                        setEditMode(false)
                    }}
                    title={editMode ? "Éditer la plateforme" : "Détails de la Plateforme"}
                    embedded={true}
                    footer={
                        !editMode && selectedPlatform && (
                            <Button onClick={() => setEditMode(true)} className="w-full">
                                Éditer
                            </Button>
                        ) || (editMode && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleEditCancel}
                                    className="flex-1"
                                    disabled={isProcessing}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleEditSubmit}
                                    className="flex-1"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Sauvegarde..." : "Sauvegarder"}
                                </Button>
                            </div>
                        ))
                    }
                >
                    {selectedPlatform && (
                        <div className="space-y-6">
                            {!editMode ? (
                                <>
                                    {/* Platform Information */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Informations de la Plateforme</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Nom</span>
                                                <span className="text-sm font-medium text-foreground">{selectedPlatform.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Code</span>
                                                <span className="text-sm font-medium text-foreground">{selectedPlatform.code}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Statut</span>
                                                <StatusBadge status={selectedPlatform.is_active ? "active" : "inactive"} />
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Créée le</span>
                                                <span className="text-sm font-medium text-foreground">{formatDate(selectedPlatform.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Platform Stats */}
                                    {isLoadingStats ? (
                                        <div className="border-t border-border pt-6">
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Statistiques</h3>
                                            <div className="space-y-3">
                                                <div className="h-4 bg-muted rounded animate-pulse" />
                                                <div className="h-4 bg-muted rounded animate-pulse" />
                                                <div className="h-4 bg-muted rounded animate-pulse" />
                                            </div>
                                        </div>
                                    ) : platformStats ? (
                                        <div className="border-t border-border pt-6">
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Statistiques</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Total Caisses</span>
                                                    <span className="text-sm font-medium text-foreground">{platformStats.total_cashdesks}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Caisses Actives</span>
                                                    <span className="text-sm font-medium text-foreground">{platformStats.active_cashdesks}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Caisses Inactives</span>
                                                    <span className="text-sm font-medium text-foreground">{platformStats.inactive_cashdesks}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Total Transactions</span>
                                                    <span className="text-sm font-medium text-foreground">{platformStats.total_transactions}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Total Dépôts</span>
                                                    <span className="text-sm font-medium text-foreground">{platformStats.total_deposits}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Total Retraits</span>
                                                    <span className="text-sm font-medium text-foreground">{platformStats.total_withdrawals}</span>
                                                </div>
                                                <div className="flex justify-between border-t border-border pt-2 mt-2">
                                                    <span className="text-sm font-semibold text-muted-foreground">Montant Total</span>
                                                    <span className="text-sm font-bold text-foreground">{platformStats.total_amount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </>
                            ) : (
                                <>
                                    {/* Edit Form */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Éditer la Plateforme</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="description" className="text-sm text-muted-foreground">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Description de la plateforme"
                                                    value={editFormData.description}
                                                    onChange={(e) =>
                                                        setEditFormData({
                                                            ...editFormData,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    className="mt-1 min-h-24"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    id="is_active"
                                                    checked={editFormData.is_active}
                                                    onCheckedChange={(e) =>
                                                        setEditFormData({
                                                            ...editFormData,
                                                            is_active: e,
                                                        })
                                                    }
                                                    className="cursor-pointer"
                                                />
                                                <Label htmlFor="is_active" className="text-sm cursor-pointer">
                                                    Plateforme active
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </SidePanel>
            </div>

            {/* Create Platform Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Créer une nouvelle plateforme</DialogTitle>
                        <DialogDescription>
                            Remplissez les informations pour créer une nouvelle plateforme de jeux
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-sm text-muted-foreground">
                                Nom <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Nom de la plateforme"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="code" className="text-sm text-muted-foreground">
                                Code <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="code"
                                placeholder="Code unique de la plateforme"
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="api_base_url" className="text-sm text-muted-foreground">
                                URL de base API <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="api_base_url"
                                placeholder="https://api.example.com"
                                value={formData.api_base_url}
                                onChange={(e) => setFormData({...formData, api_base_url: e.target.value})}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description" className="text-sm text-muted-foreground">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Description de la plateforme"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="mt-1 min-h-24"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={isProcessing}>
                            Annuler
                        </Button>
                        <Button onClick={handleCreateSubmit} disabled={isProcessing}>
                            {isProcessing ? "Création..." : "Créer"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardContent>
    )
}