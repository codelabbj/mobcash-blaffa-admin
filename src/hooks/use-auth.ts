"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import api from "@/lib/api";
import {LoginResponse, User} from "@/lib/types";
import {toast} from "sonner";
import {useAuth} from "@/providers/auth-provider";

interface LoginPayload {
    email: string
    password: string
}

interface RegisterPayload {
    email: string
    phone_number: string
    password: string
    password_confirm: string
    first_name: string
    last_name: string
}

interface ProfileUpdatePayload {
    first_name: string
    last_name: string
    phone_number: string
}

export function useLogin() {
    const router = useRouter()
    const {login}= useAuth()
    return useMutation({
        mutationFn: async (data: LoginPayload) => {
            const res = await api.post<LoginResponse>("v1/auth/login/", data)
            return res.data
        },
        onSuccess: (data) => {
            login(data.tokens.access,data.tokens.refresh,data.user)
            toast.success("Connexion réussie!")
            // Use window.location for full page reload to ensure cookies are available for middleware
            setTimeout(() => {
                router.push("/dashboard")
            }, 100)
        },
        onError: (error) => {
            toast.error("Email ou mot de passe incorrecte")
            console.error("Login error:", error)
        },
    })
}

export function useRegister(){
    const router = useRouter()
    const {login}= useAuth()
    return useMutation({
        mutationFn: async (data: RegisterPayload) => {
            const res = await api.post<LoginResponse>("v1/auth/register/", data)
            return res.data
        },
        onSuccess: (data) => {
            login(data.tokens.access,data.tokens.refresh,data.user)
            toast.success("Connexion réussie!")
            // Use window.location for full page reload to ensure cookies are available for middleware
            setTimeout(() => {
                router.push("/dashboard")
            }, 100)
        },
        onError: (error) => {
            toast.error("Echec de la création de compte")
            console.error("Login error:", error)
        },
    })
}

export function useLogout() {
    const {logout}= useAuth()

    return useMutation({
        mutationFn: async () => {
            // Call logout endpoint if available
            await api.post("/auth/logout")
        },
        onSuccess: () => {
            toast.success("Déconnexion réussie")
            logout()
        },
        onError: () => {
            // Even if API call fails, clear tokens locally
            toast.success("Déconnexion réussie")
            logout()
        },
    })
}

export function useUpdateProfile() {
    const {updateUser}= useAuth()
    return useMutation({
        mutationFn: async (data : ProfileUpdatePayload) => {
            const res = await api.patch<User>("/v1/auth/profile/",data)
            return res.data
        },
        onSuccess: (data) => {
            updateUser(data)
            toast.success("Profile mis à jour avec succès")
        },
        onError: (error) => {
            toast.error("Echec de la mis à jour du profile, veuillez réessayer")
            console.error("Error updating user profile:", error)
        }
    })
}


