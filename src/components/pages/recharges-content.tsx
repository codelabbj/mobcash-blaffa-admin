"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { FilterSection } from "@/components/ui/filter-section"
import { RequestCard } from "@/components/ui/request-card"
import { SidePanel } from "@/components/ui/side-panel"
import { StatusBadge } from "@/components/ui/status-badge"
import { ActionButtons } from "@/components/ui/action-buttons"
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"

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

// Mock data
const mockRecharges: RechargeRequest[] = [
    {
        id: "RQ001",
        userName: "John Doe",
        userPhone: "+1 234 567 8900",
        amount: 500,
        platform: "Mobile Money",
        paymentMethod: "Credit Card",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "john@example.com",
        transactionId: "TXN-2025-11-001",
        notes: "User requested quick processing",
    },
    {
        id: "RQ002",
        userName: "Jane Smith",
        userPhone: "+1 234 567 8901",
        amount: 1000,
        platform: "Bank Transfer",
        paymentMethod: "Bank Account",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "jane@example.com",
        transactionId: "TXN-2025-11-002",
    },
    {
        id: "RQ003",
        userName: "Mike Johnson",
        userPhone: "+1 234 567 8902",
        amount: 250,
        platform: "Wallet",
        paymentMethod: "Debit Card",
        status: "approved",
        createdAt: "2025-11-24",
        userEmail: "mike@example.com",
        transactionId: "TXN-2025-11-003",
    },
    {
        id: "RQ004",
        userName: "Sarah Wilson",
        userPhone: "+1 234 567 8903",
        amount: 750,
        platform: "Mobile Money",
        paymentMethod: "Credit Card",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "sarah@example.com",
        transactionId: "TXN-2025-11-004",
    },
    {
        id: "RQ005",
        userName: "Tom Brown",
        userPhone: "+1 234 567 8904",
        amount: 300,
        platform: "Bank Transfer",
        paymentMethod: "Bank Account",
        status: "rejected",
        createdAt: "2025-11-23",
        userEmail: "tom@example.com",
        transactionId: "TXN-2025-11-005",
    },
    {
        id: "RQ006",
        userName: "Emma Davis",
        userPhone: "+1 234 567 8905",
        amount: 600,
        platform: "Wallet",
        paymentMethod: "Debit Card",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "emma@example.com",
        transactionId: "TXN-2025-11-006",
    },
    {
        id: "RQ031",
        userName: "John Doe",
        userPhone: "+1 234 567 8900",
        amount: 500,
        platform: "Mobile Money",
        paymentMethod: "Credit Card",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "john@example.com",
        transactionId: "TXN-2025-11-001",
        notes: "User requested quick processing",
    },
    {
        id: "RQ041",
        userName: "John Doe",
        userPhone: "+1 234 567 8900",
        amount: 500,
        platform: "Mobile Money",
        paymentMethod: "Credit Card",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "john@example.com",
        transactionId: "TXN-2025-11-001",
        notes: "User requested quick processing",
    },
    {
        id: "RQ051",
        userName: "John Doe",
        userPhone: "+1 234 567 8900",
        amount: 500,
        platform: "Mobile Money",
        paymentMethod: "Credit Card",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "john@example.com",
        transactionId: "TXN-2025-11-001",
        notes: "User requested quick processing",
    },
    {
        id: "RQ061",
        userName: "John Doe",
        userPhone: "+1 234 567 8900",
        amount: 500,
        platform: "Mobile Money",
        paymentMethod: "Credit Card",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "john@example.com",
        transactionId: "TXN-2025-11-001",
        notes: "User requested quick processing",
    },
    {
        id: "RQ071",
        userName: "John Doe",
        userPhone: "+1 234 567 8900",
        amount: 500,
        platform: "Mobile Money",
        paymentMethod: "Credit Card",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "john@example.com",
        transactionId: "TXN-2025-11-001",
        notes: "User requested quick processing",
    },
]

const statusOptions = [
    {value: "all", label: "Tous"},
    { value: "pending", label: "En attente" },
    { value: "approved", label: "Approuver" },
    { value: "rejected", label: "Rejeter" },
]

const platformOptions = [
    {value: "all", label: "Toutes"},
    { value: "mobile-money", label: "Mobile Money" },
    { value: "bank-transfer", label: "Transfert Bancaire" },
    { value: "wallet", label: "Portefeuille" },
]

export function RechargesContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [selectedPlatform, setSelectedPlatform] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<RechargeRequest | null>(null)

    const itemsPerPage = 6
    const [isProcessing, setIsProcessing] = useState(false)

    // Filter data
    const filteredData = mockRecharges.filter((item) => {
        const matchesSearch =
            item.userName.toLowerCase().includes(searchQuery.toLowerCase()) || item.userPhone.includes(searchQuery)
        const matchesStatus = !selectedStatus || selectedStatus ==="all" || item.status === selectedStatus
        const matchesPlatform = !selectedPlatform || selectedPlatform ==="all" || item.platform.toLowerCase() === selectedPlatform.replace("-", " ")

        return matchesSearch && matchesStatus && matchesPlatform
    })

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
        setSelectedPlatform("")
        setCurrentPage(1)
    }

    const handleSelectRequest = (request: RechargeRequest) => {
        setSelectedRequest(request)
        setPanelOpen(true)
    }

    const handleAccept = async () => {
        setIsProcessing(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Approved request:", selectedRequest?.id)
        setIsProcessing(false)
        setPanelOpen(false)
    }

    const handleReject = async () => {
        setIsProcessing(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Rejected request:", selectedRequest?.id)
        setIsProcessing(false)
        setPanelOpen(false)
    }

    return (
        <DashboardContent>

            {/* Grid Cards */}
            <div className="flex gap-6 min-h-[500px]">

                {/* List Section */}
                <div className={cn("transition-all duration-300", panelOpen ? "flex-1 lg:max-w-[calc(100%-320px)]" : "flex-1")} style={{minWidth: 0}}>
                    {/* Header */}
                    <div className="mb-6 space-y-2">
                        <p className="text-2xl font-bold">Demandes de recharge</p>
                        <p className="text-sm text-muted-foreground">Gérer vos demandes de recharge d'application de paris</p>
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
                                    placeholder: "Plateforme",
                                    label: "Plateforme",
                                    value: selectedPlatform,
                                    options: platformOptions,
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
                        {paginatedData.length > 0 ? (
                            paginatedData.map((request) => (
                                <RequestCard
                                    key={request.id}
                                    icon={<ArrowUpRight className="w-6 h-6" />}
                                    title={request.userName}
                                    subtitle={request.userPhone}
                                    badge={<StatusBadge status={request.status} />}
                                    amount={`${request.amount.toLocaleString()} FCFA`}
                                    details={[
                                        { label: "Plateforme", value: request.platform },
                                        { label: "Méthode", value: request.paymentMethod },
                                        { label: "Date", value: request.createdAt },
                                        { label: "ID", value: request.id },
                                    ]}
                                    onClick={() => handleSelectRequest(request)}
                                    isSelected={selectedRequest?.id === request.id}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                                <p className="text-muted-foreground">Aucune demande de recharge trouvée</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {paginatedData.length > 0 && (
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-muted-foreground mb-2 w-full">
                                Affichage de {startIndex + 1} à {Math.min(endIndex, mockRecharges.length)} sur{" "}
                                {mockRecharges.length} résultat{mockRecharges.length > 1 ? "s" : ""}
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
                        selectedRequest?.status === "pending" && (
                            <ActionButtons
                                onAccept={handleAccept}
                                onReject={handleReject}
                                acceptLabel="Approuver"
                                rejectLabel="Rejeter"
                                isLoading={isProcessing}
                                layout="vertical"
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
                                        <span className="text-sm text-muted-foreground">Nom</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.userName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Email</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.userEmail}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Téléphone</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.userPhone}</span>
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
                      ₦{selectedRequest.amount.toLocaleString()}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Plateforme</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.platform}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Méthode de Paiement</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Date</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.createdAt}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Request Details */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Détails de la Demande</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">ID Demande</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">ID Transaction</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.transactionId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Statut</span>
                                        <StatusBadge status={selectedRequest.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Admin Notes */}
                            {selectedRequest.notes && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Notes</h3>
                                    <p className="text-sm text-foreground bg-muted p-3 rounded-lg">{selectedRequest.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </SidePanel>
            </div>
        </DashboardContent>
    )
}
