"use client"

import { useState } from "react"
import { Eye, MoreHorizontal, Trash2, Edit2 } from "lucide-react"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { FilterSection } from "@/components/ui/filter-section"
import { SidePanel } from "@/components/ui/side-panel"
import { StatusBadge } from "@/components/ui/status-badge"
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface User {
    id: string
    name: string
    email: string
    phone: string
    role: "admin" | "moderator" | "user"
    status: "active" | "inactive"
    permissions: string[]
    joinDate: string
    lastLogin?: string
    department?: string
}

// Mock data
const mockUsers: User[] = [
    {
        id: "U001",
        name: "Admin User",
        email: "admin@mobcash.com",
        phone: "+1 234 567 8900",
        role: "admin",
        status: "active",
        permissions: ["manage_users", "manage_permissions", "approve_requests", "view_reports"],
        joinDate: "2025-01-15",
        lastLogin: "2025-11-25",
        department: "Management",
    },
    {
        id: "U002",
        name: "John Moderator",
        email: "john.mod@mobcash.com",
        phone: "+1 234 567 8901",
        role: "moderator",
        status: "active",
        permissions: ["approve_requests", "view_reports", "manage_content"],
        joinDate: "2025-02-10",
        lastLogin: "2025-11-25",
        department: "Operations",
    },
    {
        id: "U003",
        name: "Sarah Support",
        email: "sarah.support@mobcash.com",
        phone: "+1 234 567 8902",
        role: "moderator",
        status: "active",
        permissions: ["view_reports", "manage_content"],
        joinDate: "2025-03-05",
        lastLogin: "2025-11-24",
        department: "Support",
    },
    {
        id: "U004",
        name: "Mike Analytics",
        email: "mike@mobcash.com",
        phone: "+1 234 567 8903",
        role: "user",
        status: "active",
        permissions: ["view_reports"],
        joinDate: "2025-04-20",
        lastLogin: "2025-11-23",
        department: "Analytics",
    },
    {
        id: "U005",
        name: "Emily Former",
        email: "emily.former@mobcash.com",
        phone: "+1 234 567 8904",
        role: "user",
        status: "inactive",
        permissions: [],
        joinDate: "2025-01-01",
        lastLogin: "2025-10-15",
        department: "HR",
    },
    {
        id: "U006",
        name: "David Finance",
        email: "david.finance@mobcash.com",
        phone: "+1 234 567 8905",
        role: "moderator",
        status: "active",
        permissions: ["view_reports", "approve_requests"],
        joinDate: "2025-05-12",
        lastLogin: "2025-11-25",
        department: "Finance",
    },
]

const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "moderator", label: "Moderator" },
    { value: "user", label: "User" },
]

const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
]

export function UsersContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRole, setSelectedRole] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
    const [editMode, setEditMode] = useState(false)

    const itemsPerPage = 10

    // Filter data
    const filteredData = mockUsers.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.phone.includes(searchQuery)
        const matchesRole = !selectedRole || item.role === selectedRole
        const matchesStatus = !selectedStatus || item.status === selectedStatus

        return matchesSearch && matchesRole && matchesStatus
    })

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleClearFilters = () => {
        setSearchQuery("")
        setSelectedRole("")
        setSelectedStatus("")
        setCurrentPage(1)
    }

    const handleSelectRow = (rowIndex: number) => {
        const newSelected = new Set(selectedRows)
        if (newSelected.has(rowIndex)) {
            newSelected.delete(rowIndex)
        } else {
            newSelected.add(rowIndex)
        }
        setSelectedRows(newSelected)
    }

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedRows(new Set(paginatedData.map((_, idx) => idx)))
        } else {
            setSelectedRows(new Set())
        }
    }

    const handleViewUser = (user: User) => {
        setSelectedUser(user)
        setEditMode(false)
        setPanelOpen(true)
    }

    const handleEditUser = () => {
        setEditMode(true)
    }

    const handleSaveUser = () => {
        console.log("User updated:", selectedUser)
        setEditMode(false)
    }

    const handleDeleteUser = (userId: string) => {
        console.log("Delete user:", userId)
    }

    const columns = [
        { key: "name", label: "User", width: "200px" },
        { key: "email", label: "Email", width: "250px" },
        { key: "role", label: "Role", width: "120px" },
        { key: "status", label: "Status", width: "120px" },
        { key: "department", label: "Department", width: "150px" },
        { key: "joinDate", label: "Joined", width: "130px" },
    ]

    const rows = paginatedData.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: <span className="text-sm font-medium">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>,
        status: <StatusBadge status={user.status} />,
        department: user.department || "-",
        joinDate: user.joinDate,
    }))

    return (
        <DashboardContent>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground">
                        {filteredData.length} user{filteredData.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button>Add User</Button>
            </div>

            {/* Bulk Actions Bar */}
            {selectedRows.size > 0 && (
                <div className="mb-6 p-4 bg-muted border border-border rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {selectedRows.size} user{selectedRows.size !== 1 ? "s" : ""} selected
          </span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            Change Role
                        </Button>
                        <Button variant="destructive" size="sm">
                            Deactivate
                        </Button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="mb-6">
                <FilterSection
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    filters={[
                        {
                            label: "Role",
                            value: selectedRole,
                            options: roleOptions,
                            onChange: (value) => {
                                setSelectedRole(value)
                                setCurrentPage(1)
                            },
                        },
                        {
                            label: "Status",
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

            {/* Data Table */}
            <div className="mb-6">
                {paginatedData.length > 0 ? (
                    <div className="border border-border rounded-lg overflow-hidden">
                        <table className="w-full">
                            {/* Header */}
                            <thead className="bg-muted border-b border-border">
                            <tr>
                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="w-4 h-4 rounded"
                                    />
                                </th>
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-4 py-3 text-left text-sm font-semibold text-foreground"
                                        style={{ width: col.width }}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                                <th className="w-12 px-4 py-3" />
                            </tr>
                            </thead>

                            {/* Body */}
                            <tbody>
                            {rows.map((row, idx) => (
                                <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.has(idx)}
                                            onChange={() => handleSelectRow(idx)}
                                            className="w-4 h-4 rounded"
                                        />
                                    </td>
                                    <td
                                        className="px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:text-accent"
                                        onClick={() => handleViewUser(paginatedData[idx])}
                                    >
                                        {row.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-foreground">{row.email}</td>
                                    <td className="px-4 py-3 text-sm">{row.role}</td>
                                    <td className="px-4 py-3 text-sm">{row.status}</td>
                                    <td className="px-4 py-3 text-sm text-foreground">{row.department}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.joinDate}</td>
                                    <td className="px-4 py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewUser(paginatedData[idx])}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        handleViewUser(paginatedData[idx])
                                                        setEditMode(true)
                                                        setPanelOpen(true)
                                                    }}
                                                >
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDeleteUser(paginatedData[idx].id)}
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
                        <p className="text-muted-foreground">No users found</p>
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

            {/* Side Panel */}
            <SidePanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                title={editMode ? "Edit User" : "User Details"}
                width="md"
                footer={
                    editMode && (
                        <div className="flex gap-3">
                            <Button onClick={handleSaveUser} className="flex-1">
                                Save Changes
                            </Button>
                            <Button onClick={() => setEditMode(false)} variant="outline" className="flex-1">
                                Cancel
                            </Button>
                        </div>
                    )
                }
            >
                {selectedUser && (
                    <div className="space-y-6">
                        {/* User Profile */}
                        <div className="text-center pb-6 border-b border-border">
                            <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                                {selectedUser.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </div>
                            <h2 className="text-lg font-bold text-foreground">{selectedUser.name}</h2>
                            <p className="text-sm text-muted-foreground">{selectedUser.role.toUpperCase()}</p>
                        </div>

                        {/* Personal Information */}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Personal Information</h3>
                            <div className="space-y-3">
                                {editMode ? (
                                    <>
                                        <div>
                                            <label className="text-xs text-muted-foreground font-medium">Name</label>
                                            <input
                                                type="text"
                                                value={selectedUser.name}
                                                className="w-full mt-1 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground font-medium">Email</label>
                                            <input
                                                type="email"
                                                value={selectedUser.email}
                                                className="w-full mt-1 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground font-medium">Phone</label>
                                            <input
                                                type="tel"
                                                value={selectedUser.phone}
                                                className="w-full mt-1 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Email</span>
                                            <span className="text-sm font-medium text-foreground">{selectedUser.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Phone</span>
                                            <span className="text-sm font-medium text-foreground">{selectedUser.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Department</span>
                                            <span className="text-sm font-medium text-foreground">{selectedUser.department || "-"}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Role & Status */}
                        <div className="border-t border-border pt-6">
                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Role & Status</h3>
                            <div className="space-y-3">
                                {editMode ? (
                                    <>
                                        <div>
                                            <label className="text-xs text-muted-foreground font-medium">Role</label>
                                            <select className="w-full mt-1 px-3 py-2 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                                                <option value="admin">Admin</option>
                                                <option value="moderator">Moderator</option>
                                                <option value="user">User</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Role</span>
                                            <span className="text-sm font-medium text-foreground">
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Status</span>
                                            <StatusBadge status={selectedUser.status} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Permissions */}
                        {!editMode && (
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                                    Permissions ({selectedUser.permissions.length})
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUser.permissions.length > 0 ? (
                                        selectedUser.permissions.map((perm) => (
                                            <span key={perm} className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full">
                        {perm.replace(/_/g, " ")}
                      </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No permissions assigned</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Activity */}
                        {!editMode && (
                            <div className="border-t border-border pt-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Activity</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Joined</span>
                                        <span className="text-sm font-medium text-foreground">{selectedUser.joinDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Last Login</span>
                                        <span className="text-sm font-medium text-foreground">{selectedUser.lastLogin || "Never"}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!editMode && (
                            <Button onClick={handleEditUser} className="w-full">
                                Edit User
                            </Button>
                        )}
                    </div>
                )}
            </SidePanel>
        </DashboardContent>
    )
}
