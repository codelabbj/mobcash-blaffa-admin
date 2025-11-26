import axios from "axios"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

api.interceptors.request.use((config) => {
    // Don't add token to login/auth endpoints
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh')

    if (!isAuthEndpoint) {
        const token = localStorage.getItem("access_token")
        if (token) config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config

        // Handle token refresh for 401 errors
        if (error.response?.status === 401 && !original.url?.includes('/auth/login') && !original._retry ) {
            original._retry = true
            try {
                const refresh = localStorage.getItem("refresh_token")

                if (!refresh) {
                    throw new Error("No refresh token available")
                }

                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}auth/refresh`, { refresh })
                const newToken = res.data.access

                // Update both localStorage and cookies
                localStorage.setItem("access_token", newToken)
                const isProduction = process.env.NODE_ENV === 'production'
                const cookieOptions = isProduction
                    ? 'path=/; max-age=604800; secure; samesite=strict'
                    : 'path=/; max-age=604800; samesite=strict'
                document.cookie = `access_token=${newToken}; ${cookieOptions}`

                api.defaults.headers.Authorization = `Bearer ${newToken}`
                original.headers.Authorization = `Bearer ${newToken}`

                return api(original)
            } catch (refreshError) {
                // Token refresh failed - clear tokens and redirect to login
                localStorage.clear()
                document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                window.location.href = "/login"
                return Promise.reject(refreshError)
            }

        }
        return Promise.reject(error)
    },
)

export default api
