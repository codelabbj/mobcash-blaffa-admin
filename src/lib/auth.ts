import {LoginResponse} from "@/lib/types";

export function setAuthTokens(tokens: { access: string; refresh: string }) {
    // Safety check for browser environment
    if (typeof window === 'undefined') {
        return
    }

    try {
        // Set cookies for server-side access
        const isProduction = process.env.NODE_ENV === 'production'
        const cookieOptions = isProduction
            ? 'path=/; max-age=604800; secure; samesite=strict' // 7 days
            : 'path=/; max-age=604800; samesite=strict' // 7 days, no secure in dev

        document.cookie = `access_token=${tokens.access}; ${cookieOptions}`
        document.cookie = `refresh_token=${tokens.refresh}; path=/; max-age=2592000; ${isProduction ? 'secure; ' : ''}samesite=strict` // 30 days

        // Also store in localStorage for client-side access
        localStorage.setItem("access_token", tokens.access)
        localStorage.setItem("refresh_token", tokens.refresh)
    } catch (error) {
        console.error("Error setting auth tokens:", error)
    }
}

export function getAuthTokens() {
    // Safety check for browser environment
    if (typeof window === 'undefined') {
        return { access: null, refresh: null }
    }

    try {
        return {
            access: localStorage.getItem("access_token"),
            refresh: localStorage.getItem("refresh_token"),
        }
    } catch (error) {
        console.error("Error accessing localStorage:", error)
        return { access: null, refresh: null }
    }
}

export function clearAuthTokens() {
    // Safety check for browser environment
    if (typeof window === 'undefined') {
        return
    }

    try {
        // Clear cookies
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

        // Clear localStorage
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user_data")
    } catch (error) {
        console.error("Error clearing tokens:", error)
    }
}

export function setUserData(data: LoginResponse["user"]) {
    if (typeof window === 'undefined') {
        return
    }

    try {
        localStorage.setItem("user_data", JSON.stringify(data))
    } catch (error) {
        console.error("Error setting user data:", error)
    }
}

export function getUserData(): LoginResponse["user"] | null {
    if (typeof window === 'undefined') {
        return null
    }

    try {
        const data = localStorage.getItem("user_data")
        return data ? JSON.parse(data) : null
    } catch (error) {
        console.error("Error getting user data:", error)
        return null
    }
}

export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
        return false
    }

    try {
        return !!getAuthTokens().access
    } catch (error) {
        console.error("Error checking authentication:", error)
        return false
    }
}
