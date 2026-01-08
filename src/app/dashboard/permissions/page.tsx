import { PermissionsContent } from "@/components/pages/permissions-content"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function PermissionsPage() {
    return (
        <DashboardLayout title="Permissions Management">
            <PermissionsContent />
        </DashboardLayout>
    )
}