"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {useAuth} from "@/providers/auth-provider";
import {useRouter} from "next/navigation";

export default function Home() {
    const {user } = useAuth()
    const router = useRouter()
    if (!user){
        router.push("/login")
    }

    return (
        <DashboardLayout>
            {/* Placeholder for dashboard content */}
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to Admin Dashboard</h1>
                    <p className="text-muted-foreground">Select an option from the sidebar to get started</p>
                </div>
            </div>
        </DashboardLayout>
    )
}
