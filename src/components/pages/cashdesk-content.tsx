"use client"

import { useEffect, useState } from "react"
import {Plus, Wallet, Check, ChevronsUpDown} from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidePanel } from "@/components/ui/side-panel"
import { RequestCard } from "@/components/ui/request-card"
import { StatusBadge } from "@/components/ui/status-badge"
import RequestCardSkeleton from "@/components/ui/request-card-skeleton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { CashDesk } from "@/lib/types"
import {
    useCashDesk,
    useCreateCashDesk,
    useUpdateCashDeskStatus,
    useUpdateCashDeskCredentials,
} from "@/hooks/use-cashdesk"
import {usePlatform} from "@/hooks/use-platform";
import {Skeleton} from "@/components/ui/skeleton";


const createCashDeskSchema = z.object({
    platform_id: z.string().min(1, "La plateforme est requise"),
    name: z.string().min(1, "Le nom est requis"),
    cashdeskid: z.string().min(1, "L'ID Caisse est requis"),
    login: z.string().min(1, "L'identifiant est requis"),
    cashierpass: z.string().min(1, "Le mot de passe est requis"),
    hash: z.string().min(1, "Le hash est requis"),
})

const updateCredentialsSchema = z.object({
    login: z.string().min(1, "L'identifiant est requis"),
    cashierpass: z.string().min(1, "Le mot de passe est requis"),
    hash: z.string().min(1, "Le hash est requis"),
})

type CreateCashDeskInput = z.infer<typeof createCashDeskSchema>
type UpdateCredentialsInput = z.infer<typeof updateCredentialsSchema>

/*
// COMMENTED OUT: PlatformCombobox - Temporarily disabled in favor of Select component
// This was causing click-through issues in the Dialog + Popover + Command combination
// TODO: Reimplement when Dialog/Popover event handling is resolved

interface PlatformComboboxProps {
    selectedPlatformId: string
    onPlatformSelect: (platformId: string) => void
    searchTerm: string
    onSearchChange: (term: string) => void
    isLoading: boolean
    platforms: any[] | undefined
    error?: Partial<Record<keyof CreateCashDeskInput, string>>
}

function PlatformCombobox({
    selectedPlatformId,
    onPlatformSelect,
    searchTerm,
    onSearchChange,
    isLoading,
    platforms,
    error,
}: PlatformComboboxProps) {
    // LOCAL state - component manages its own open/close
    const [open, setOpen] = useState(false)

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Plateforme</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-full justify-between",
                            !selectedPlatformId && "text-muted-foreground"
                        )}
                        aria-expanded={open}
                        type="button"
                    >
                        {selectedPlatformId
                            ? platforms?.find(
                                (platform) => platform.id === selectedPlatformId
                            )?.name
                            : "Rechercher plateforme..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[400px] p-0"
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Rechercher plateforme..."
                            value={searchTerm}
                            onValueChange={onSearchChange}
                            autoFocus
                        />
                        <CommandList>
                            <CommandEmpty>Aucune plateforme trouvée</CommandEmpty>
                            <CommandGroup>
                                {isLoading ? (
                                    <div className="py-6 px-2 text-center text-sm">
                                        Chargement...
                                    </div>
                                ) : (
                                    platforms?.map((platform) => (
                                        <CommandItem
                                            value={platform.id}
                                            key={platform.id}
                                            onSelect={() => {
                                                onPlatformSelect(platform.id)
                                                setOpen(false)
                                                onSearchChange("")
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedPlatformId === platform.id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {platform.name}
                                        </CommandItem>
                                    ))
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error?.platform_id && (
                <p className="text-sm text-destructive">{error.platform_id}</p>
            )}
        </div>
    )
}
*/

export function CashDeskContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
    const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedCashDesk, setSelectedCashDesk] = useState<CashDesk | null>(null)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [updateCredentialsDialogOpen, setUpdateCredentialsDialogOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const itemsPerPage = 6

    // Debounce search query for cashdesk
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const { data: cashDesks, isLoading, error } = useCashDesk({
        page: currentPage,
        search: debouncedSearchQuery,
        is_active: filterActive
    })
    const createCashDesk = useCreateCashDesk()
    const updateStatus = useUpdateCashDeskStatus()
    const updateCredentials = useUpdateCashDeskCredentials()
    const {data:platforms, isLoading:loadingPlatforms} = usePlatform({
        search: ""
    })

    // Create cashdesk form
    const createForm = useForm<CreateCashDeskInput>({
        resolver: zodResolver(createCashDeskSchema),
        defaultValues: {
            platform_id: "",
            name: "",
            cashdeskid: "",
            login: "",
            cashierpass: "",
            hash: "",
        },
    })

    // Credentials form
    const credentialsForm = useForm<UpdateCredentialsInput>({
        resolver: zodResolver(updateCredentialsSchema),
        defaultValues: {
            login: "",
            cashierpass: "",
            hash: "",
        },
    })

    const onCreateSubmit = (data: CreateCashDeskInput) => {
        createCashDesk.mutate(data, {
            onSuccess: () => {
                createForm.reset()
                setCreateDialogOpen(false)
            },
        })
    }

    // Filter cashdesks
    const filteredCashDesks = cashDesks?.results.filter((desk) => {
        const matchesSearch =
            desk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            desk.cashdeskid.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter =
            filterActive === "all" ||
            (filterActive === "active" && desk.is_active) ||
            (filterActive === "inactive" && !desk.is_active)
        return matchesSearch && matchesFilter
    }) || []

    const handleSelectCashDesk = (desk: CashDesk) => {
        setSelectedCashDesk(desk)
        setPanelOpen(true)
    }

    const handleToggleStatus = async () => {
        if (!selectedCashDesk) return
        setIsProcessing(true)
        try {
            updateStatus.mutate({
                cashdesk_id: selectedCashDesk.id,
                active: !selectedCashDesk.is_active,
            },{
                onSuccess: () => {
                    setSelectedCashDesk({...selectedCashDesk, is_active: !selectedCashDesk.is_active})
                }
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleUpdateCredentials = (data: UpdateCredentialsInput) => {
        if (!selectedCashDesk) return
        updateCredentials.mutate(
            {
                id: selectedCashDesk.id,
                data,
            },
            {
                onSuccess: () => {
                    credentialsForm.reset()
                    setUpdateCredentialsDialogOpen(false)
                },
            }
        )
    }

    useEffect(() => {
        if (error) {
            toast.error("Echec du chargement des caisses, veuillez réessayer")
            console.log("An error occurred during cashdesks loading:", error)
        }
    }, [error])

    return (
        <DashboardContent>
            <div className="flex gap-6 min-h-[500px]">
                {/* Main Content */}
                <div
                    className={cn(
                        "transition-all duration-300 flex-1",
                        panelOpen ? "lg:max-w-[calc(100%-320px)]" : ""
                    )}
                    style={{ minWidth: 0 }}
                >
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-2xl font-bold">Caisses</p>
                            <p className="text-sm text-muted-foreground">
                                Gérer vos caisses et leur statut
                            </p>
                        </div>
                        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nouvelle Caisse
                            </Button>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Créer une nouvelle caisse</DialogTitle>
                                    <DialogDescription>
                                        Ajouter une nouvelle caisse à votre plateforme
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...createForm}>
                                    <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                                        {/* Platform Selection */}
                                        <FormField
                                            control={createForm.control}
                                            name="platform_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Plateforme</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingPlatforms}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Sélectionner une plateforme" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {platforms?.results?.map((platform) => (
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

                                        {/* Nom */}
                                        <FormField
                                            control={createForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nom</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Entrez le nom de la caisse" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* ID Workspace */}
                                        <FormField
                                            control={createForm.control}
                                            name="cashdeskid"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ID Workspace</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Entrez l'ID de la caisse" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Identifiant */}
                                        <FormField
                                            control={createForm.control}
                                            name="login"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Identifiant</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Entrez l'identifiant" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Mot de passe */}
                                        <FormField
                                            control={createForm.control}
                                            name="cashierpass"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mot de passe</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Entrez le mot de passe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Hash */}
                                        <FormField
                                            control={createForm.control}
                                            name="hash"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Hash</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Entrez le hash" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" disabled={createCashDesk.isPending} className="w-full">
                                            {createCashDesk.isPending ? "Création en cours..." : "Créer Caisse"}
                                        </Button>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-6 space-y-4">
                        <Input
                            placeholder="Rechercher par nom ou ID Caisse..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-sm"
                        />
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={filterActive === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterActive("all")}
                            >
                                Tous
                            </Button>
                            <Button
                                variant={filterActive === "active" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterActive("active")}
                            >
                                Actif
                            </Button>
                            <Button
                                variant={filterActive === "inactive" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterActive("inactive")}
                            >
                                Inactif
                            </Button>
                        </div>
                    </div>

                    <p className="text-muted-foreground mb-4">
                        {filteredCashDesks.length} Caisse{filteredCashDesks.length !== 1 ? "s" : ""}
                    </p>

    {/* Grid/List View */}
                    {isLoading ? (
                        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                            {[1, 2, 3, 4].map((i) => (
                                <RequestCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredCashDesks.length > 0 ? (
                        <>
                            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 mb-6">
                                {filteredCashDesks.map((desk) => (
                                    <RequestCard
                                        key={desk.id}
                                        icon={<Wallet className="w-6 h-6" />}
                                        title={desk.name}
                                        subtitle={desk.cashdeskid}
                                        badge={
                                            <StatusBadge
                                                status={
                                                    desk.is_active ? "active" : "inactive"
                                                }
                                            />
                                        }
                                        details={[
                                            { label: "Plateforme", value: desk.platform.name },
                                            { label: "Statut", value: desk.health_status ==="healthy" ? "Sain" : "Maintenance requise" },
                                        ]}
                                        onClick={() => handleSelectCashDesk(desk)}
                                        isSelected={selectedCashDesk?.id === desk.id}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {cashDesks && cashDesks.results.length > 0 && (
                                <div className="flex items-center justify-between">
                                    <p className="text-muted-foreground text-sm">
                                        Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, cashDesks?.count || 0)} sur{" "}
                                        {cashDesks?.count || 0} résultat{cashDesks?.count !== 1 ? "s" : ""}
                                    </p>
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious href="#" onClick={(e) => {
                                                    e.preventDefault()
                                                    if (cashDesks?.previous) setCurrentPage(currentPage - 1)
                                                }}
                                                    className={!cashDesks?.previous ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                />
                                            </PaginationItem>
                                            <PaginationItem>
                                                <span className="px-3 py-2 text-sm">{currentPage}</span>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationNext href="#" onClick={(e) => {
                                                    e.preventDefault()
                                                    if (cashDesks?.next) setCurrentPage(currentPage + 1)
                                                }}
                                                    className={!cashDesks?.next ? "pointer-events-none opacity-50" : "cursor-pointer"}/>
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                            <p className="text-muted-foreground">Aucune caisse trouvée</p>
                        </div>
                    )}
                </div>

                {/* Side Panel */}
                <SidePanel
                    isOpen={panelOpen}
                    onClose={() => setPanelOpen(false)}
                    title="Détails Caisse"
                    embedded={true}
                >
                    {selectedCashDesk && (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                                    Informations
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Nom</span>
                                        <span className="text-sm font-medium text-foreground">
                                            {selectedCashDesk.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            ID Caisse
                                        </span>
                                        <span className="text-sm font-medium text-foreground">
                                            {selectedCashDesk.cashdeskid}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Plateforme</span>
                                        <span className="text-sm font-medium text-foreground">
                                            {selectedCashDesk.platform.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Information */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                                    Statut
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            Statut Actif
                                        </span>
                                        <StatusBadge
                                            status={
                                                selectedCashDesk.is_active ? "active" : "inactive"
                                            }
                                        />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            État de Santé
                                        </span>
                                        <span className="text-sm font-medium text-foreground">
                                            {selectedCashDesk.health_status === "healthy" ? "Sain":"Maintenance requise"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Balance Information */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                                    Informations de Solde
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Solde</span>
                                        <span className="text-sm font-medium text-foreground">
                                            {selectedCashDesk.balance}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Limite</span>
                                        <span className="text-sm font-medium text-foreground">
                                            {selectedCashDesk.limit}
                                        </span>
                                    </div>
                                    {selectedCashDesk.balance_last_updated && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Dernière mise à jour
                                            </span>
                                            <span className="text-sm font-medium text-foreground">
                                                {formatDate(selectedCashDesk.balance_last_updated)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Transaction Information */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                                    Informations sur les Transactions
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Total des Transactions
                                        </span>
                                        <span className="text-sm font-medium text-foreground">
                                            {selectedCashDesk.total_transactions}
                                        </span>
                                    </div>
                                    {selectedCashDesk.last_used_at && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Dernière Utilisation
                                            </span>
                                            <span className="text-sm font-medium text-foreground">
                                                {formatDate(selectedCashDesk.last_used_at)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="border-t border-border pt-6 space-y-2">
                                <Button
                                    variant={selectedCashDesk.is_active ? "destructive" : "default"}
                                    onClick={handleToggleStatus}
                                    disabled={isProcessing}
                                    className="w-full"
                                >
                                    {isProcessing
                                        ? "Traitement en cours..."
                                        : selectedCashDesk.is_active
                                          ? "Désactiver"
                                          : "Activer"}
                                </Button>
                                <Dialog open={updateCredentialsDialogOpen} onOpenChange={setUpdateCredentialsDialogOpen}>
                                    <Button
                                        variant="outline"
                                        onClick={() => setUpdateCredentialsDialogOpen(true)}
                                        className="w-full"
                                    >
                                        Mettre à jour les identifiants
                                    </Button>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Mettre à jour les identifiants</DialogTitle>
                                            <DialogDescription>
                                                Mettre à jour les identifiants de connexion pour ce cashdesk
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form {...credentialsForm}>
                                            <form
                                                onSubmit={credentialsForm.handleSubmit(handleUpdateCredentials)}
                                                className="space-y-4"
                                            >
                                                <FormField
                                                    control={credentialsForm.control}
                                                    name="login"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Identifiant</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Entrez l'identifiant" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={credentialsForm.control}
                                                    name="cashierpass"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Mot de passe</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="password"
                                                                    placeholder="Entrez le mot de passe"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={credentialsForm.control}
                                                    name="hash"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Hash</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Entrez le hash" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" disabled={isProcessing} className="w-full">
                                                    {isProcessing ? "Mise à jour..." : "Mettre à jour les identifiants"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    )}
                </SidePanel>
            </div>
        </DashboardContent>
    )
}