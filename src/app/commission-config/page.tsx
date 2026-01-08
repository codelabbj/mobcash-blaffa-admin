import {DashboardLayout} from "@/components/layout/dashboard-layout";
import CommissionConfigContent from "@/components/pages/commission-config-content";

export default function CommissionConfigPage () {
    return (
        <DashboardLayout title="Commission config">
            <CommissionConfigContent/>
        </DashboardLayout>
    )
}