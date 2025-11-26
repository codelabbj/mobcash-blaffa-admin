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