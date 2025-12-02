export interface User {
    id:             string;
    email:          string;
    first_name:     string;
    last_name:      string;
    phone_number:   string;
    user_type:      string;
    email_verified: boolean;
    is_active:      boolean;
    created_at:     Date;
}

export interface LoginResponse {
    user:User;
    tokens:{
        access:string;
        refresh:string;
    }
}

export interface PaginatedContent<T>{
    count:        number;
    next:         number|null;
    previous:     number|null;
    page_size:    number;
    current_page: number;
    total_pages:  number;
    results:      T[];
}

export interface Recharge {
    id:                string;
    user:              string;
    user_email:        string;
    amount:            string;
    status:            string;
    payment_method:    string;
    payment_reference: string;
    payment_proof_url: string|null;
    notes:             string|null;
    admin_notes:       string|null;
    requested_at:      Date;
    processed_at:      Date | null;
    processed_by:      Date | null;
    created_at:        Date;
}

export interface Cancellation {
    id:             string;
    transaction_id: string;
    reason:         string;
    status:         string;
    admin_notes:    string | null;
    requested_at:   Date;
    processed_at:   string | null;
}

export interface Transaction {
    id:                       string;
    transaction_id:           string;
    external_id:              string;
    platform_code:            string;
    platform_name:            string;
    transaction_type:         string;
    transaction_type_display: string;
    status:                   string;
    status_display:           string;
    amount:                   string;
    player_user_id:           string;
    mobcash_code:             string | null;
    is_cancellable:           boolean;
    cancellation_deadline:    Date;
    error_code:               string | null;
    error_message:            string | null;
    created_at:               Date;
    completed_at:             Date;
    logs:                     Log[];
    cashdesk_name:            string;
    request_data:             RequestData;
    mobcash_response:         MobcashResponse;
}

export interface Log {
    id:          string;
    status_from: null | string;
    status_to:   string;
    message:     string;
    metadata:    Metadata | null;
    created_at:  Date;
}

export interface Metadata {
    mobcash_response: MobcashResponse;
}

export interface MobcashResponse {
    summa:        number;
    message:      string;
    success:      boolean;
    messageId:    null|string;
    operationId:  number;
    raw_response: RawResponse;
}

export interface RawResponse {
    Summa:       number;
    Message:     string;
    Success:     boolean;
    OperationId: number;
}

export interface RequestData {
    amount:         string;
    cashdesk_id:    string;
    platform_uid:   string;
    player_user_id: string;
    verify_balance: boolean;
}

export interface Platform {
    id:         string;
    name:       string;
    code:       string;
    is_active:  boolean;
    created_at: Date;
}

export interface PlatformStats {
    platform_id:        string;
    platform_name:      string;
    platform_code:      string;
    total_cashdesks:    number;
    active_cashdesks:   number;
    inactive_cashdesks: number;
    total_transactions: number;
    total_deposits:     number;
    total_withdrawals:  number;
    total_amount:       string;
}

export interface CashDesk {
    id:                   string;
    platform:             Omit<Platform, "created_at"|"is_active">;
    name:                 string;
    cashdeskid:           string;
    is_active:            boolean;
    health_status:        string;
    last_used_at:         null|Date;
    total_transactions:   number;
    balance:              string;
    limit:                string;
    balance_last_updated: Date|null;
}

export interface AppUser {
    id:             string;
    email:          string;
    first_name:     string;
    last_name:      string;
    phone_number:   string;
    user_type:      string;
    email_verified: boolean;
    is_active:      boolean;
    created_at:     Date;
}

export interface Wallet {
    id:         string;
    user:       string;
    user_email: string;
    balance:    string;
    currency:   string;
    created_at: Date;
    updated_at: Date;
}

export interface  Permission {
    id:                     string;
    user:                   string;
    user_display_name:  string;
    platform:               string;
    platform_name:          string;
    platform_code:          string;
    can_deposit:            boolean;
    can_withdraw:           boolean;
    daily_deposit_limit:    string;
    daily_withdrawal_limit: string;
    created_at:             Date;
    updated_at:             Date;
}

export interface Commission {
    id:                      string;
    user_email:              string;
    transaction_id:          string;
    commission_type:         string;
    commission_type_display: string;
    transaction_amount:      string;
    commission_rate:         string;
    commission_amount:       string;
    status:                  string;
    status_display:          string;
    period_year:             number;
    period_month:            number;
    period:                  string;
    paid_at:                 Date|null;
    payment_reference:       string|null;
    notes:                   string;
    created_at:              Date;
    updated_at:              Date;
}

export interface CommissionConfig {
    id:                         string;
    user_email:                 string;
    deposit_commission_rate:    string;
    withdrawal_commission_rate: string;
    is_active:                  boolean;
    created_at:                 Date;
    updated_at:                 Date;
}

export interface Stats{
    overview:          Overview;
    transactions:      Transactions;
    recharge_requests: RechargeRequests;
    discrepancies:     Discrepancies;
}

export interface Discrepancies {
    unresolved: number;
    critical:   number;
}

export interface Overview {
    total_users:          number;
    active_users:         number;
    total_cashdesks:      number;
    active_cashdesks:     number;
    total_wallet_balance: number;
}

export interface RechargeRequests {
    pending:        number;
    approved_today: number;
}

export interface Transactions {
    total:        number;
    today:        number;
    last_30_days: number;
    by_status:    ByStatus;
    total_amount: number;
}

export interface ByStatus {
    completed: number;
    pending:   number;
    failed:    number;
    cancelled: number;
}

export interface TransactionStats {
    period:             Period;
    total_transactions: number;
    by_type:            ByType;
    by_status:          ByStatus;
    amounts:            Amounts;
    by_platform:        Platform[];
    success_rate:       SuccessRate;
}

export interface Amounts {
    total:             number;
    average:           number;
    deposits_total:    number;
    withdrawals_total: number;
}

export interface ByStatus {
    completed: number;
    pending:   number;
    failed:    number;
    cancelled: number;
}

export interface ByType {
    deposits:    number;
    withdrawals: number;
}

export interface Period {
    start_date: Date;
    end_date:   Date;
}

export interface SuccessRate {
    overall:     number;
    deposits:    number;
    withdrawals: number;
}

export interface CashDeskStats {
    total_cashdesks:       number;
    active_cashdesks:      number;
    inactive_cashdesks:    number;
    cashdesks_with_issues: number;
    cashdesks_detail:      CashdesksDetail[];
}

export interface CashdesksDetail {
    id:                     string;
    name:                   string;
    cashdeskid:             string;
    platform__name:         string;
    is_active:              boolean;
    consecutive_failures:   number;
    transactions_count:     number;
    completed_transactions: number;
    failed_transactions:    number;
    total_amount:           number|null;
}

export interface UserStats {
    total_users:               number;
    active_users:              number;
    verified_users:            number;
    top_users_by_transactions: TopUsersBy[];
    top_users_by_amount:       TopUsersBy[];
    wallet_distribution:       WalletDistribution;
}

export interface TopUsersBy {
    id:            string;
    email:         string;
    first_name:    string;
    last_name:     string;
    total_amount?: number;
    txn_count?:    number;
}

export interface WalletDistribution {
    total_balance:        number;
    average_balance:      number;
    wallets_with_balance: number;
}