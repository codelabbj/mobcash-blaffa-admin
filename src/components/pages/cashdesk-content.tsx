"use client"

import { useEffect, useState } from "react"
import {Plus, Wallet} from "lucide-react"
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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { CashDesk } from "@/lib/types"
import {
    useCashDesk,
    useCreateCashDesk,
    useUpdateCashDeskStatus,
    useUpdateCashDeskCredentials,
} from "@/hooks/use-cashdesk"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

export function CashDeskContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all")
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedCashDesk, setSelectedCashDesk] = useState<CashDesk | null>(null)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [updateCredentialsDialogOpen, setUpdateCredentialsDialogOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const { data: cashDesks, isLoading, error } = useCashDesk()
    const createCashDesk = useCreateCashDesk()
    const updateStatus = useUpdateCashDeskStatus()
    const updateCredentials = useUpdateCashDeskCredentials()
    const {data:platforms, isLoading:loadingPlatforms, error:platformError} = usePlatform()

    const form = useForm<CreateCashDeskInput>({
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

    const credentialsForm = useForm<UpdateCredentialsInput>({
        resolver: zodResolver(updateCredentialsSchema),
        defaultValues: {
            login: selectedCashDesk?.cashdeskid || "",
            cashierpass: "",
            hash: "",
        },
    })

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

    const handleCreateCashDesk = async (data: CreateCashDeskInput) => {
        setIsProcessing(true)
        try {
            createCashDesk.mutate(data, {
                onSuccess: () => {
                    form.reset()
                    setCreateDialogOpen(false)
                },
            })
        } finally {
            setIsProcessing(false)
        }
    }

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

    const handleUpdateCredentials = async (data: UpdateCredentialsInput) => {
        if (!selectedCashDesk) return
        setIsProcessing(true)
        try {
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
        } finally {
            setIsProcessing(false)
        }
    }

    useEffect(() => {
        if (error) {
            toast.error("Echec du chargement des caisses, veuillez réessayer")
            console.log("An error occurred during cashdesks loading:", error)
        }
    }, [error])
    
    useEffect(()=>{
        if (platformError){
            toast.error("Echec du chargement des caisses, veuillez réessayer")
            console.error("Error loading platforms:",error)
        }
    },[platformError])

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
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(handleCreateCashDesk)}
                                        className="space-y-4"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="platform_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Plateforme</FormLabel>
                                                    <FormControl>
                                                        <Select value={field.value} onValueChange={field.onChange}>
                                                            <SelectTrigger id="platform" className="w-full">
                                                                <SelectValue placeholder="Sélectionner une plateforme"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {
                                                                    loadingPlatforms ? (
                                                                        <SelectItem value="">
                                                                            <Skeleton className="w-full h-5"/>
                                                                        </SelectItem>): platforms ?
                                                                        platforms.results.map(pl=>(
                                                                            <SelectItem key={pl.id} value={pl.id}>
                                                                                {pl.name}
                                                                            </SelectItem>
                                                                        )):(
                                                                            <SelectItem value="">Aucune plateforme disponible</SelectItem>
                                                                        )
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nom</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Entrez le nom de la caisse"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="cashdeskid"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ID Caisse</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Entrez l'ID de la caisse"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
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
                                            control={form.control}
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
                                            control={form.control}
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
                                            {isProcessing ? "Création en cours..." : "Créer Caisse"}
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
                        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
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