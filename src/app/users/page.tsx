import { UsersContent } from "@/components/pages/users-content"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function UsersPage() {
    return (
        <DashboardLayout title="Users Management">
            <UsersContent />
        </DashboardLayout>
    )
}
