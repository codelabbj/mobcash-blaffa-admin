import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {CashDeskContent} from "@/components/pages/cashdesk-content";

export  default function CashDeskPage(){
    return(
        <DashboardLayout title="Cash Desk">
            <CashDeskContent/>
        </DashboardLayout>
    )
}