"use client"

import { useMutation } from "@tanstack/react-query"
import { setAuthTokens, setUserData, clearAuthTokens, } from "@/lib/auth"
import { useRouter } from "next/navigation"
import api from "@/lib/api";
import {LoginResponse} from "@/lib/types";
import {toast} from "sonner";

interface LoginPayload {
    email: string
    password: string
}

export function useLogin() {
    const router = useRouter()

    return useMutation({
        mutationFn: async (data: LoginPayload) => {
            const res = await api.post<LoginResponse>("/auth/login/", data)
            return res.data
        },
        onSuccess: (data) => {
            setAuthTokens({ access: data.tokens.access, refresh: data.tokens.refresh })
            setUserData(data.user)
            toast.success("Connexion réussie!")
            // Use window.location for full page reload to ensure cookies are available for middleware
            setTimeout(() => {
                router.push("/")
            }, 100)
        },
        onError: (error) => {
            toast.error("Email ou mot de passe incorrecte")
            console.error("Login error:", error)
        },
    })
}

export function useLogout() {
    const router = useRouter()

    return useMutation({
        mutationFn: async () => {
            // Call logout endpoint if available
            await api.post("/auth/logout")
        },
        onSuccess: () => {
            clearAuthTokens()
            toast.success("Déconnexion réussie")
            router.push("/login")
        },
        onError: () => {
            // Even if API call fails, clear tokens locally
            clearAuthTokens()
            router.push("/login")
        },
    })
}
