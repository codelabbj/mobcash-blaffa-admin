"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useUpdateProfile } from "@/hooks/use-auth"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, User, Shield, Edit2 } from "lucide-react"
import {useAuth} from "@/providers/auth-provider";
import {DashboardContent} from "@/components/layout/dashboard-content";

// Zod schema for profile update
const profileUpdateSchema = z.object({
    first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    phone_number: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
})

type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>

export default function ProfileContent() {
    const { user, loading } = useAuth()
    const { mutate: updateProfile, isPending } = useUpdateProfile()
    const [isEditing, setIsEditing] = useState(false)

    const form = useForm<ProfileUpdateFormValues>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone_number: "",
        },
    })

    // Update form values when user data loads
    useEffect(() => {
        if (user) {
            form.reset({
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
            })
        }
    }, [user, form])

    const onSubmit = async (values: ProfileUpdateFormValues) => {
        updateProfile(values, {
            onSuccess: () => {
                setIsEditing(false)
            },
        })
    }

    if (loading) {
        return (
            <DashboardContent>
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-4 w-60" />
                    </div>
                    <Card className="overflow-hidden">
                        <CardContent className="pt-8 space-y-8">
                            <div className="flex flex-col items-center space-y-4">
                                <Skeleton className="w-24 h-24 rounded-full" />
                                <div className="text-center space-y-2 w-full">
                                    <Skeleton className="h-6 w-40 mx-auto" />
                                    <Skeleton className="h-4 w-48 mx-auto" />
                                    <Skeleton className="h-8 w-32 mx-auto mt-4" />
                                </div>
                            </div>
                            <div className="h-px bg-border" />
                            <div className="space-y-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="w-5 h-5 flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-5 w-40" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DashboardContent>
        )
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Impossible de charger le profil utilisateur</p>
            </div>
        )
    }

    // Get user initials
    const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()

    return (
        <DashboardContent>
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">Mon Profil</h1>
                    <p className="text-muted-foreground">Gérez vos informations personnelles et paramètres de compte</p>
                </div>

                {/* Profile Card */}
                <Card className="overflow-hidden">
                    {!isEditing ? (
                        <>
                            {/* Display Mode */}
                            <CardContent className="pt-8 space-y-8">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center space-y-4">
                                    <Avatar className="w-24 h-24">
                                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center space-y-2">
                                        <h2 className="text-2xl font-bold text-foreground">
                                            {user.first_name} {user.last_name}
                                        </h2>
                                        <p className="text-muted-foreground">{user.email}</p>
                                        <div className="flex gap-2 justify-center flex-wrap pt-2">
                                            <Badge variant={user.is_active ? "default" : "secondary"}>
                                                {user.is_active ? "Actif" : "Inactif"}
                                            </Badge>
                                            {user.email_verified && (
                                                <Badge variant="outline">
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    Vérifié
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-border" />

                                {/* Profile Details */}
                                <div className="space-y-6">
                                    {/* Email */}
                                    <div className="flex items-start gap-4">
                                        <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                                            <p className="text-base text-foreground break-all">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-4">
                                        <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Numéro de Téléphone</p>
                                            <p className="text-base text-foreground">{user.phone_number}</p>
                                        </div>
                                    </div>

                                    {/* User Type */}
                                    <div className="flex items-start gap-4">
                                        <User className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Type d&apos;Utilisateur</p>
                                            <p className="text-base text-foreground">
                                                {user.user_type === "admin" ? "Administrateur" : user.user_type}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Created At */}
                                    <div className="flex items-start gap-4">
                                        <User className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Membre depuis</p>
                                            <p className="text-base text-foreground">
                                                {new Date(user.created_at).toLocaleDateString("fr-FR", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-border" />

                                {/* Edit Button */}
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full"
                                    size="lg"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Modifier le Profil
                                </Button>
                            </CardContent>
                        </>
                    ) : (
                        <>
                            {/* Edit Mode - Form */}
                            <CardContent className="pt-8">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        {/* Avatar Section */}
                                        <div className="flex flex-col items-center pb-6">
                                            <Avatar className="w-24 h-24">
                                                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>

                                        {/* First Name */}
                                        <FormField
                                            control={form.control}
                                            name="first_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Prénom</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Entrez votre prénom"
                                                            {...field}
                                                            disabled={isPending}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Last Name */}
                                        <FormField
                                            control={form.control}
                                            name="last_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nom</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Entrez votre nom"
                                                            {...field}
                                                            disabled={isPending}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Phone Number */}
                                        <FormField
                                            control={form.control}
                                            name="phone_number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Numéro de Téléphone</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Entrez votre numéro de téléphone"
                                                            type="tel"
                                                            {...field}
                                                            disabled={isPending}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Form Actions */}
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="submit"
                                                disabled={isPending}
                                                className="flex-1"
                                                size="lg"
                                            >
                                                {isPending ? "Mise à jour en cours..." : "Enregistrer les Modifications"}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsEditing(false)
                                                    form.reset()
                                                }}
                                                disabled={isPending}
                                                className="flex-1"
                                                size="lg"
                                            >
                                                Annuler
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </>
                    )}
                </Card>
            </div>
        </DashboardContent>
    )
}