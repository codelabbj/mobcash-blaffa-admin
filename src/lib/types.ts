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
    has_credentials:      boolean;
    health_status:        string;
    last_used_at:         Date | null;
    consecutive_failures: number;
    total_transactions:   number;
    created_at:           Date;
    updated_at:           Date;
    balance:         number;
}