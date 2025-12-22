import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {AdminTransactionContent} from "@/components/pages/admin-transaction-content";

export default function AdminTransactionPage() {
    return(
        <DashboardLayout title="Admin Transactions">
            <AdminTransactionContent/>
        </DashboardLayout>
    )
}