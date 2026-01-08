import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {PlatformsContent} from "@/components/pages/platforms-content";

export default function PlatformPage() {
    return (
        <DashboardLayout title="Platforms">
            <PlatformsContent/>
        </DashboardLayout>
    )
}