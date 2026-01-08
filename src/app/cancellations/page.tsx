import { CancellationsContent } from "@/components/pages/cancellations-content"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function CancellationsPage() {
    return (
        <DashboardLayout title="Cancellation Requests">
            <CancellationsContent />
        </DashboardLayout>
    )
}