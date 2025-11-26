import { RechargesContent } from "@/components/pages/recharges-content"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function RechargesPage() {
    return (
        <DashboardLayout title="Recharges Requests">
            <RechargesContent />
        </DashboardLayout>
    )
}
