import { cn } from "@/lib/utils"

type StatusType = "pending" | "approved" | "processing" | "failed" | "cancelled" | "refunded" | "rejected" | "active" | "inactive"|"completed"
const statusLabel = [
    {value:"pending",label:"En attente"},
    {value:"approved",label:"Approuver"},
    {value:"processing",label:"En cours"},
    {value:"failed",label:"Echec"},
    {value:"cancelled",label:"Annuler"},
    {value: "refunded",label:"Rembourser"},
    {value:"rejected",label:"Rejeter"},
    {value:"active",label:"Actif"},
    {value:"inactive",label:"Inactif"},
    {value:"completed",label:"Terminer"},
]
const statusStyles: Record<StatusType, { bg: string; text: string; dot: string }> = {
    pending: {
        bg: "bg-yellow-50 dark:bg-yellow-950",
        text: "text-yellow-700 dark:text-yellow-300",
        dot: "bg-yellow-500",
    },
    approved: {
        bg: "bg-green-50 dark:bg-green-950",
        text: "text-green-700 dark:text-green-300",
        dot: "bg-green-500",
    },
    cancelled: {
        bg: "bg-red-50 dark:bg-red-950",
        text: "text-red-700 dark:text-red-300",
        dot: "bg-red-500",
    },
    rejected: {
        bg: "bg-red-50 dark:bg-red-950",
        text: "text-red-700 dark:text-red-300",
        dot: "bg-red-500",
    },
    refunded: {
        bg: "bg-blue-50 dark:bg-blue-950",
        text: "text-blue-700 dark:text-blue-300",
        dot: "bg-blue-500",
    },
    failed: {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-600 dark:text-gray-400",
        dot: "bg-gray-500",
    },
    processing: {
        bg: "bg-purple-50 dark:bg-purple-950",
        text: "text-purple-700 dark:text-purple-300",
        dot: "bg-purple-500",
    },
    active :{
        bg: "bg-green-50 dark:bg-green-950",
        text: "text-green-700 dark:text-green-300",
        dot: "bg-green-500",
    },
    inactive :{
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-600 dark:text-gray-400",
        dot: "bg-gray-500",
    },
    completed :{
        bg: "bg-green-50 dark:bg-green-950",
        text: "text-green-700 dark:text-green-300",
        dot: "bg-green-500",
    }
}

interface StatusBadgeProps {
    status: StatusType
    label?: string
    showDot?: boolean
    className?: string
}

export function StatusBadge({ status, label, showDot = true, className }: StatusBadgeProps) {
    const styles = statusStyles[status] || statusStyles.pending // Fallback to pending styles if status is not found
    return (
        <span
            className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                styles.bg,
                styles.text,
                className,
            )}
        >
      {showDot && <span className={cn("w-2 h-2 rounded-full", styles.dot)} />}
            {statusLabel.find((s)=> s.value === status)?.label || status}
    </span>
    )
}
