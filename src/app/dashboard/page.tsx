"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, TrendingUp, Users, Wallet, Settings, AlertTriangle } from "lucide-react"
import { useStats, useTransactionStats, useCashDeskStats, useUserStats } from "@/hooks/use-stats"
import { formatCurrency } from "@/lib/utils"
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Chart colors using primary and custom color
const chartConfig = {
    completed: {
        label: "Complétée",
        color: "var(--primary)",
    },
    pending: {
        label: "En Attente",
        color: "var(--chart-1)",
    },
    failed: {
        label: "Échouée",
        color: "var(--chart-1)",
    },
    cancelled: {
        label: "Annulée",
        color: "var(--chart-2)",
    },
    deposits: {
        label: "Dépôts",
        color: "var(--primary)",
    },
    withdrawals: {
        label: "Retraits",
        color: "var(--chart-1)",
    },
    active: {
        label: "Active",
        color: "var(--primary)",
    },
    inactive: {
        label: "Inactive",
        color: "var(--chart-1)",
    },
    issues: {
        label: "Problèmes",
        color: "var(--chart-1)",
    },
}

export default function Dashboard() {
    const { data: stats, isLoading: statsLoading } = useStats()
    const { data: txnStats, isLoading: txnLoading } = useTransactionStats()
    const { data: cashDeskStats, isLoading: cashDeskLoading } = useCashDeskStats()
    const { data: userStats, isLoading: userLoading } = useUserStats()

    const isLoading = statsLoading || txnLoading || cashDeskLoading || userLoading

    // Prepare transaction status data for pie chart
    const transactionStatusData = stats?.transactions.by_status ? [
        { name: "Complétée", value: stats.transactions.by_status.completed },
        { name: "En Attente", value: stats.transactions.by_status.pending },
        { name: "Échouée", value: stats.transactions.by_status.failed },
        { name: "Annulée", value: stats.transactions.by_status.cancelled },
    ].filter(item => item.value > 0) : []

    // Prepare transaction type data for bar chart
    const transactionTypeData = txnStats?.by_type ? [
        { name: "Dépôts", value: txnStats.by_type.deposits },
        { name: "Retraits", value: txnStats.by_type.withdrawals },
    ] : []

    // Prepare cashdesk status data
    const cashDeskStatusData = cashDeskStats ? [
        { name: "Active", value: cashDeskStats.active_cashdesks },
        { name: "Inactive", value: cashDeskStats.inactive_cashdesks },
        { name: "Problèmes", value: cashDeskStats.cashdesks_with_issues },
    ].filter(item => item.value > 0) : []

    return (
        <DashboardLayout>
            <DashboardContent>
                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
                        <p className="text-muted-foreground">Bienvenue dans votre tableau de bord d&apos;administration. Voici un aperçu de votre système.</p>
                    </div>

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Utilisateurs Totaux */}
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Utilisateurs Totaux</p>
                                    {statsLoading ? (
                                        <Skeleton className="h-8 w-20 mt-2" />
                                    ) : (
                                        <p className="text-2xl font-bold text-foreground">{stats?.overview.total_users || 0}</p>
                                    )}
                                </div>
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>

                        {/* Active Users */}
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Utilisateurs Actifs</p>
                                    {statsLoading ? (
                                        <Skeleton className="h-8 w-20 mt-2" />
                                    ) : (
                                        <p className="text-2xl font-bold text-foreground">{stats?.overview.active_users || 0}</p>
                                    )}
                                </div>
                                <TrendingUp className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        {/* Total Wallet Balance */}
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Solde Total</p>
                                    {statsLoading ? (
                                        <Skeleton className="h-8 w-24 mt-2" />
                                    ) : (
                                        <p className="text-2xl font-bold text-foreground">{formatCurrency(stats?.overview.total_wallet_balance || 0)}</p>
                                    )}
                                </div>
                                <Wallet className="w-8 h-8 text-purple-500" />
                            </div>
                        </div>

                        {/* Total Cashdesks */}
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Caisses</p>
                                    {cashDeskLoading ? (
                                        <Skeleton className="h-8 w-20 mt-2" />
                                    ) : (
                                        <p className="text-2xl font-bold text-foreground">{cashDeskStats?.total_cashdesks || 0}</p>
                                    )}
                                </div>
                                <Settings className="w-8 h-8 text-orange-500" />
                            </div>
                        </div>

                        {/* Discrepancies */}
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Écarts</p>
                                    {statsLoading ? (
                                        <Skeleton className="h-8 w-20 mt-2" />
                                    ) : (
                                        <p className="text-2xl font-bold text-red-500">{stats?.discrepancies.critical || 0}</p>
                                    )}
                                </div>
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                        </div>
                    </div>

                    {/* Recharge Requests Alert */}
                    {stats?.recharge_requests.pending || 0 > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-amber-900 dark:text-amber-200">Demandes de Recharge Pending</h3>
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                    Vous avez {stats?.recharge_requests.pending || 0} demande de recharge{(stats?.recharge_requests.pending || 0) !== 1 ? "s" : ""} en attente de votre révision.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                        {/* Transaction Status Chart */}
                        {!isLoading && transactionStatusData.length > 0 && (
                            <div className="bg-card border border-border rounded-lg p-3 sm:p-6">
                                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-4">Distribution du statut des transactions</h2>
                                <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
                                    <PieChart>
                                        <Pie
                                            data={transactionStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            dataKey="value"
                                        >
                                            {transactionStatusData.map((item, index) => {
                                                const statusMap: Record<string, string> = {
                                                    "Complétée": "completed",
                                                    "En Attente": "pending",
                                                    "Échouée": "failed",
                                                    "Annulée": "cancelled",
                                                }
                                                return (
                                                    <Cell key={`cell-${index}`} fill={`var(--color-${statusMap[item.name] || "completed"})`} />
                                                )
                                            })}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ChartContainer>
                            </div>
                        )}

                        {/* Transaction Type Chart */}
                        {!isLoading && transactionTypeData.length > 0 && (
                            <div className="bg-card border border-border rounded-lg p-3 sm:p-6">
                                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-4">Dépôts vs Retraits</h2>
                                <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
                                    <BarChart data={transactionTypeData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="value" fill="var(--color-deposits)" radius={8} />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                        )}

                        {/* Cashdesk Status Chart */}
                        {!isLoading && cashDeskStatusData.length > 0 && (
                            <div className="bg-card border border-border rounded-lg p-3 sm:p-6">
                                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-4">Statut de la Caisse</h2>
                                <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
                                    <PieChart>
                                        <Pie
                                            data={cashDeskStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            dataKey="value"
                                        >
                                            {cashDeskStatusData.map((item, index) => {
                                                const statusMap: Record<string, string> = {
                                                    "Active": "active",
                                                    "Inactive": "inactive",
                                                    "Problèmes": "issues",
                                                }
                                                return (
                                                    <Cell key={`cell-${index}`} fill={`var(--color-${statusMap[item.name] || "active"})`} />
                                                )
                                            })}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ChartContainer>
                            </div>
                        )}

                        {/* Transaction Amounts Card */}
                        {!isLoading && txnStats && (
                            <div className="bg-card border border-border rounded-lg p-3 sm:p-6">
                                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-4">Montants des Transactions</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Déposé</span>
                                        <span className="font-semibold text-foreground">{formatCurrency(txnStats.amounts.deposits_total || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Retiré</span>
                                        <span className="font-semibold text-foreground">{formatCurrency(txnStats.amounts.withdrawals_total || 0)}</span>
                                    </div>
                                    <div className="border-t border-border pt-3 flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Volume Total</span>
                                        <span className="font-semibold text-foreground text-lg">{formatCurrency(txnStats.amounts.total || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Transaction Moyenne</span>
                                        <span className="font-semibold text-foreground">{formatCurrency(txnStats.amounts.average || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Transaction Stats Section */}
                    {!isLoading && txnStats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-card border border-border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">Taux de Succès (Global)</p>
                                <div className="text-3xl font-bold text-foreground">{txnStats.success_rate.overall.toFixed(1)}%</div>
                                <p className="text-xs text-muted-foreground mt-2">Nombre de Transactions: {txnStats.total_transactions}</p>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">Taux de Succès des Dépôts</p>
                                <div className="text-3xl font-bold text-green-500">{txnStats.success_rate.deposits.toFixed(1)}%</div>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">Taux de Succès des Retraits</p>
                                <div className="text-3xl font-bold text-blue-500">{txnStats.success_rate.withdrawals.toFixed(1)}%</div>
                            </div>
                        </div>
                    )}

                    {/* Top Users Section */}
                    {!isLoading && userStats && (userStats.top_users_by_transactions.length > 0 || userStats.top_users_by_amount.length > 0) && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Users by Transactions */}
                            {userStats.top_users_by_transactions.length > 0 && (
                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-foreground mb-4">Meilleurs Utilisateurs par Transactions</h2>
                                    <div className="space-y-3">
                                        {userStats.top_users_by_transactions.slice(0, 5).map((user, index) => (
                                            <div key={user.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{user.email}</p>
                                                        <p className="text-xs text-muted-foreground">{user.first_name} {user.last_name}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-semibold text-foreground">{user.txn_count} txns</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Top Users by Amount */}
                            {userStats.top_users_by_amount.length > 0 && (
                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-foreground mb-4">Meilleurs Utilisateurs par Montant</h2>
                                    <div className="space-y-3">
                                        {userStats.top_users_by_amount.slice(0, 5).map((user, index) => (
                                            <div key={user.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{user.email}</p>
                                                        <p className="text-xs text-muted-foreground">{user.first_name} {user.last_name}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-semibold text-foreground">{formatCurrency(user.total_amount || 0)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* User Stats Summary */}
                    {!isLoading && userStats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-card border border-border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">Utilisateurs Vérifiés</p>
                                <div className="text-3xl font-bold text-foreground">{userStats.verified_users}</div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {((userStats.verified_users / userStats.total_users) * 100).toFixed(1)}% de tous les utilisateurs
                                </p>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">Solde Total du Portefeuille</p>
                                <div className="text-3xl font-bold text-foreground">{formatCurrency(userStats.wallet_distribution.total_balance || 0)}</div>
                                <p className="text-xs text-muted-foreground mt-2">Moyenne: {formatCurrency(userStats.wallet_distribution.average_balance || 0)}</p>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">Portefeuilles Avec Solde</p>
                                <div className="text-3xl font-bold text-foreground">{userStats.wallet_distribution.wallets_with_balance}</div>
                            </div>
                        </div>
                    )}
                </div>
            </DashboardContent>
        </DashboardLayout>
    )
}
