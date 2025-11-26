"use client"

import { useState } from "react"
import { Eye, MoreHorizontal, Trash2, Edit2, Plus } from "lucide-react"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { FilterSection } from "@/components/ui/filter-section"
import { SidePanel } from "@/components/ui/side-panel"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Permission {
    id: string
    name: string
    slug: string
    description: string
    category: string
    createdAt: string
    updatedAt: string
    usersCount: number
}

// Mock data
const mockPermissions: Permission[] = [
    {
        id: "P001",
        name: "Manage Users",
        slug: "manage_users",
        description: "Allow users to create, edit, and delete user accounts",
        category: "User Management",
        createdAt: "2025-01-10",
        updatedAt: "2025-11-20",
        usersCount: 2,
    },
    {
        id: "P002",
        name: "Manage Permissions",
        slug: "manage_permissions",
        description: "Allow users to manage and assign permissions",
        category: "Permission Management",
        createdAt: "2025-01-10",
        updatedAt: "2025-11-20",
        usersCount: 1,
    },
    {
        id: "P003",
        name: "Approve Requests",
        slug: "approve_requests",
        description: "Allow users to approve or reject recharge and cancellation requests",
        category: "Request Management",
        createdAt: "2025-01-15",
        updatedAt: "2025-11-19",
        usersCount: 3,
    },
    {
        id: "P004",
        name: "View Reports",
        slug: "view_reports",
        description: "Allow users to view analytics and financial reports",
        category: "Reports",
        createdAt: "2025-02-01",
        updatedAt: "2025-11-18",
        usersCount: 4,
    },
    {
        id: "P005",
        name: "Manage Content",
        slug: "manage_content",
        description: "Allow users to manage platform content and messaging",
        category: "Content Management",
        createdAt: "2025-02-15",
        updatedAt: "2025-11-17",
        usersCount: 2,
    },
    {
        id: "P006",
        name: "View Audit Logs",
        slug: "view_audit_logs",
        description: "Allow users to access system audit logs and activity records",
        category: "Security",
        createdAt: "2025-03-01",
        updatedAt: "2025-11-16",
        usersCount: 1,
    },
]

const categoryOptions = [
    { value: "user-management", label: "User Management" },
    { value: "permission-management", label: "Permission Management" },
    { value: "request-management", label: "Request Management" },
    { value: "reports", label: "Reports" },
    { value: "content-management", label: "Content Management" },
    { value: "security", label: "Security" },
]

export function PermissionsContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [newPermission, setNewPermission] = useState({
        name: "",
        slug: "",
        description: "",
        category: "",
    })

    // Filter data
    const filteredData = mockPermissions.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = !selectedCategory || item.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    const handleClearFilters = () => {
        setSearchQuery("")
        setSelectedCategory("")
    }

    const handleViewPermission = (permission: Permission) => {
        setSelectedPermission(permission)
        setEditMode(false)
        setPanelOpen(true)
    }

    const handleEditPermission = () => {
        setEditMode(true)
    }

    const handleSavePermission = () => {
        console.log("Permission updated:", selectedPermission)
        setEditMode(false)
    }

    const handleDeletePermission = (permissionId: string) => {
        console.log("Delete permission:", permissionId)
    }

    const handleCreatePermission = () => {
        setNewPermission({
            name: "",
            slug: "",
            description: "",
            category: "",
        })
        setCreateModalOpen(true)
    }

    const handleSaveNewPermission = () => {
        console.log("New permission created:", newPermission)
        setCreateModalOpen(false)
    }

    return (
        <DashboardContent>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground">
                        {filteredData.length} permission{filteredData.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button onClick={handleCreatePermission} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Permission
                </Button>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <FilterSection
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    filters={[
                        {
                            label: "Category",
                            value: selectedCategory,
                            options: categoryOptions,
                            onChange: (value) => setSelectedCategory(value),
                        },
                    ]}
                    onClearAll={handleClearFilters}
                />
            </div>

            {/* Permissions Table */}
            <div className="mb-6">
                {filteredData.length > 0 ? (
                    <div className="border border-border rounded-lg overflow-hidden">
                        <table className="w-full">
                            {/* Header */}
                            <thead className="bg-muted border-b border-border">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Users</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Created</th>
                                <th className="w-12 px-6 py-3" />
                            </tr>
                            </thead>

                            {/* Body */}
                            <tbody>
                            {filteredData.map((permission, idx) => (
                                <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-3">
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => handleViewPermission(permission)}
                                                className="text-sm font-medium text-foreground hover:text-accent transition-colors text-left"
                                            >
                                                {permission.name}
                                            </button>
                                            <span className="text-xs text-muted-foreground font-mono">{permission.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-sm text-foreground">{permission.category}</span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-sm text-muted-foreground line-clamp-1">{permission.description}</span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-sm font-medium text-foreground">{permission.usersCount}</span>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-muted-foreground">{permission.createdAt}</td>
                                    <td className="px-6 py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewPermission(permission)}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        handleViewPermission(permission)
                                                        setEditMode(true)
                                                    }}
                                                >
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDeletePermission(permission.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                        <p className="text-muted-foreground">No permissions found</p>
                    </div>
                )}
            </div>

            {/* Details Side Panel */}
            <SidePanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                title={editMode ? "Edit Permission" : "Permission Details"}
                width="md"
                footer={
                    editMode && (
                        <div className="flex gap-3">
                            <Button onClick={handleSavePermission} className="flex-1">
                                Save Changes
                            </Button>
                            <Button onClick={() => setEditMode(false)} variant="outline" className="flex-1">
                                Cancel
                            </Button>
                        </div>
                    )
                }
            >
                {selectedPermission && (
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Basic Information</h3>
                            <div className="space-y-3">
                                {editMode ? (
                                    <>
                                        <div>
                                            <label className="text-xs text-muted-foreground font-medium">Permission Name</label>
                                            <input
                                                type="text"
                                                value={selectedPermission.name}
                                                className="w-full mt-1 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground font-medium">Slug</label>
                                            <input
                                                type="text"
                                                value={selectedPermission.slug}
                                                className="w-full mt-1 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground font-medium">Description</label>
                                            <textarea
                                                value={selectedPermission.description}
                                                rows={3}
                                                className="w-full mt-1 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground font-medium">Category</label>
                                            <select className="w-full mt-1 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                                                <option value={selectedPermission.category}>{selectedPermission.category}</option>
                                                {categoryOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.label}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-sm text-muted-foreground">Name</span>
                                                <p className="text-sm font-semibold text-foreground mt-1">{selectedPermission.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-sm text-muted-foreground">Slug</span>
                                                <p className="text-sm font-mono text-foreground mt-1 bg-muted p-2 rounded">
                                                    {selectedPermission.slug}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Description</span>
                                            <p className="text-sm text-foreground mt-1">{selectedPermission.description}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Category</span>
                                            <span className="text-sm font-medium text-foreground">{selectedPermission.category}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Assignment Information */}
                        {!editMode && (
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Assignment Information</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Assigned Users</span>
                                        <span className="text-sm font-bold text-foreground">{selectedPermission.usersCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Created</span>
                                        <span className="text-sm font-medium text-foreground">{selectedPermission.createdAt}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Last Updated</span>
                                        <span className="text-sm font-medium text-foreground">{selectedPermission.updatedAt}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!editMode && (
                            <Button onClick={handleEditPermission} className="w-full">
                                Edit Permission
                            </Button>
                        )}
                    </div>
                )}
            </SidePanel>

            {/* Create Permission Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create New Permission</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">Permission Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Manage Settings"
                                value={newPermission.name}
                                onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
                                className="w-full mt-2 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">Slug</label>
                            <input
                                type="text"
                                placeholder="e.g., manage_settings"
                                value={newPermission.slug}
                                onChange={(e) => setNewPermission({ ...newPermission, slug: e.target.value })}
                                className="w-full mt-2 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">Description</label>
                            <textarea
                                placeholder="Describe what this permission allows users to do"
                                value={newPermission.description}
                                onChange={(e) =>
                                    setNewPermission({
                                        ...newPermission,
                                        description: e.target.value,
                                    })
                                }
                                rows={3}
                                className="w-full mt-2 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">Category</label>
                            <select
                                value={newPermission.category}
                                onChange={(e) => setNewPermission({ ...newPermission, category: e.target.value })}
                                className="w-full mt-2 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">Select a category</option>
                                {categoryOptions.map((opt) => (
                                    <option key={opt.value} value={opt.label}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveNewPermission}>Create Permission</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardContent>
    )
}
