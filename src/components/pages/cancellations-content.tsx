"use client"

import { useState } from "react"
import { XCircle } from "lucide-react"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { FilterSection } from "@/components/ui/filter-section"
import { RequestCard } from "@/components/ui/request-card"
import { SidePanel } from "@/components/ui/side-panel"
import { StatusBadge } from "@/components/ui/status-badge"
import { ActionButtons } from "@/components/ui/action-buttons"
import { Pagination } from "@/components/ui/pagination"

interface CancellationRequest {
    id: string
    userName: string
    userPhone: string
    originalRequestId: string
    originalAmount: number
    originalPlatform: string
    cancellationReason: string
    status: "pending" | "approved" | "rejected"
    createdAt: string
    userEmail?: string
    processedBy?: string
    adminNotes?: string
}

// Mock data
const mockCancellations: CancellationRequest[] = [
    {
        id: "CL001",
        userName: "John Doe",
        userPhone: "+1 234 567 8900",
        originalRequestId: "RQ001",
        originalAmount: 500,
        originalPlatform: "Mobile Money",
        cancellationReason: "Wrong amount charged",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "john@example.com",
        adminNotes: "User claims transaction failed",
    },
    {
        id: "CL002",
        userName: "Alice Chen",
        userPhone: "+1 234 567 8906",
        originalRequestId: "RQ010",
        originalAmount: 1200,
        originalPlatform: "Bank Transfer",
        cancellationReason: "Duplicate charge",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "alice@example.com",
    },
    {
        id: "CL003",
        userName: "Robert Zhang",
        userPhone: "+1 234 567 8907",
        originalRequestId: "RQ008",
        originalAmount: 800,
        originalPlatform: "Wallet",
        cancellationReason: "User request",
        status: "approved",
        createdAt: "2025-11-24",
        userEmail: "robert@example.com",
        processedBy: "Admin1",
    },
    {
        id: "CL004",
        userName: "Maria Garcia",
        userPhone: "+1 234 567 8908",
        originalRequestId: "RQ009",
        originalAmount: 350,
        originalPlatform: "Mobile Money",
        cancellationReason: "Transaction pending",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "maria@example.com",
    },
    {
        id: "CL005",
        userName: "David Kim",
        userPhone: "+1 234 567 8909",
        originalRequestId: "RQ011",
        originalAmount: 600,
        originalPlatform: "Bank Transfer",
        cancellationReason: "Technical error",
        status: "rejected",
        createdAt: "2025-11-23",
        userEmail: "david@example.com",
        adminNotes: "Transaction already processed",
    },
    {
        id: "CL006",
        userName: "Lisa Anderson",
        userPhone: "+1 234 567 8910",
        originalRequestId: "RQ012",
        originalAmount: 450,
        originalPlatform: "Wallet",
        cancellationReason: "Service unavailable",
        status: "pending",
        createdAt: "2025-11-25",
        userEmail: "lisa@example.com",
    },
]

const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
]

const reasonOptions = [
    { value: "wrong-amount", label: "Wrong amount charged" },
    { value: "duplicate", label: "Duplicate charge" },
    { value: "user-request", label: "User request" },
    { value: "pending", label: "Transaction pending" },
    { value: "technical", label: "Technical error" },
    { value: "unavailable", label: "Service unavailable" },
]

export function CancellationsContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [selectedReason, setSelectedReason] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<CancellationRequest | null>(null)

    const itemsPerPage = 9
    const [isProcessing, setIsProcessing] = useState(false)

    // Filter data
    const filteredData = mockCancellations.filter((item) => {
        const matchesSearch =
            item.userName.toLowerCase().includes(searchQuery.toLowerCase()) || item.userPhone.includes(searchQuery)
        const matchesStatus = !selectedStatus || item.status === selectedStatus
        const matchesReason = !selectedReason || item.cancellationReason.toLowerCase().includes(selectedReason)

        return matchesSearch && matchesStatus && matchesReason
    })

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleClearFilters = () => {
        setSearchQuery("")
        setSelectedStatus("")
        setSelectedReason("")
        setCurrentPage(1)
    }

    const handleSelectRequest = (request: CancellationRequest) => {
        setSelectedRequest(request)
        setPanelOpen(true)
    }

    const handleAccept = async () => {
        setIsProcessing(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Approved cancellation:", selectedRequest?.id)
        setIsProcessing(false)
        setPanelOpen(false)
    }

    const handleReject = async () => {
        setIsProcessing(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Rejected cancellation:", selectedRequest?.id)
        setIsProcessing(false)
        setPanelOpen(false)
    }

    return (
        <DashboardContent>
            {/* Header */}
            <div className="mb-6">
                <p className="text-muted-foreground">
                    {filteredData.length} cancellation request{filteredData.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <FilterSection
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    filters={[
                        {
                            label: "Status",
                            value: selectedStatus,
                            options: statusOptions,
                            onChange: (value) => {
                                setSelectedStatus(value)
                                setCurrentPage(1)
                            },
                        },
                        {
                            label: "Reason",
                            value: selectedReason,
                            options: reasonOptions,
                            onChange: (value) => {
                                setSelectedReason(value)
                                setCurrentPage(1)
                            },
                        },
                    ]}
                    onClearAll={handleClearFilters}
                />
            </div>

            {/* Grid Cards */}
            <div className="flex gap-6 min-h-[500px]">
                {/* List Section */}
                <div className="flex-1 min-w-0">
                    {/* Cards List */}
                    <div className="space-y-3 mb-6">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((request) => (
                                <RequestCard
                                    key={request.id}
                                    icon={<XCircle className="w-6 h-6 text-destructive" />}
                                    title={request.userName}
                                    subtitle={request.userPhone}
                                    badge={<StatusBadge status={request.status} />}
                                    amount={`₦${request.originalAmount.toLocaleString()}`}
                                    details={[
                                        { label: "Original Request", value: request.originalRequestId },
                                        { label: "Platform", value: request.originalPlatform },
                                        { label: "Reason", value: request.cancellationReason },
                                        { label: "Date", value: request.createdAt },
                                    ]}
                                    onClick={() => handleSelectRequest(request)}
                                    isSelected={selectedRequest?.id === request.id}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                                <p className="text-muted-foreground">No cancellation requests found</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {paginatedData.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filteredData.length}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
                </div>

                {/* Panel Section - Embedded on desktop, hidden on mobile */}
                <SidePanel
                    isOpen={panelOpen}
                    onClose={() => setPanelOpen(false)}
                    title="Cancellation Details"
                    embedded={true}
                    footer={
                        selectedRequest?.status === "pending" && (
                            <ActionButtons
                                onAccept={handleAccept}
                                onReject={handleReject}
                                acceptLabel="Approve"
                                rejectLabel="Reject"
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
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">User Information</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Name</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.userName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Email</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.userEmail}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Phone</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.userPhone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Original Request Details */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Original Request Details</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Request ID</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.originalRequestId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Amount</span>
                                        <span className="text-sm font-bold text-foreground">
                      ₦{selectedRequest.originalAmount.toLocaleString()}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Platform</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.originalPlatform}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cancellation Details */}
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Cancellation Details</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Cancellation ID</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Reason</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.cancellationReason}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Date</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.createdAt}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Status</span>
                                        <StatusBadge status={selectedRequest.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Admin Notes */}
                            {selectedRequest.adminNotes && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Admin Notes</h3>
                                    <p className="text-sm text-foreground bg-muted p-3 rounded-lg">{selectedRequest.adminNotes}</p>
                                </div>
                            )}

                            {/* Processing Info */}
                            {selectedRequest.processedBy && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Processing Info</h3>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Processed By</span>
                                        <span className="text-sm font-medium text-foreground">{selectedRequest.processedBy}</span>
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
