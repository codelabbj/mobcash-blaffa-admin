"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/use-auth";

const phoneRegex = /^\+[1-9]\d{7,14}$/;

const formSchema = z.object({
    first_name: z.string().min(1, { message: "Veuillez entrer votre prénom" }),
    last_name: z.string().min(1, { message: "Veuillez entrer votre nom" }),
    email: z.string().email({ message: "Veuillez fournir un email valide" }),

    phone_number: z
        .string()
        .min(1, { message: "Veuillez entrer votre numéro de téléphone" })
        .regex(phoneRegex, {
            message: "Le numéro doit inclure l'indicatif pays, commencer par + et ne contenir aucun espace"
        }),

    password: z
        .string()
        .min(4, { message: "Le mot de passe doit contenir au moins 4 caractères" }),

    password_confirm: z.string()
}).refine((data) => data.password === data.password_confirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirm"],
});


export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const register = useRegister();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            password: "",
            password_confirm: "",
        }
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        register.mutate(values);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 h-screen">
            <div className="lg:col-span-3 flex flex-col items-center justify-center space-y-8 px-8">
                <Link href="/">
                    <div className="flex items-center gap-2 ">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold text-base flex-shrink-0"
                            style={{
                                background:
                                    "radial-gradient(135% 135% at 50% 50%, oklch(0.5 0.2 25) 0%, oklch(0.05 0.01 280) 100%)",
                            }}
                        >
                            MB
                        </div>
                        <span className="text-sidebar-foreground font-bold text-xl transition-opacity duration-300">
                        MobCash
                    </span>
                    </div>
                </Link>


                <div className="w-full max-w-md space-y-6">
                    <h1 className="text-4xl font-bold">Créer un compte</h1>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prénom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John"
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="johdoe@mail.com"
                                                type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Téléphone</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+33612345678"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff /> : <Eye />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password_confirm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmer le mot de passe</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={register.isPending}
                                className="w-full py-3 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {register.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                        <span>Création en cours...</span>
                                    </div>
                                ) : (
                                    <span>Créer un compte</span>
                                )}
                            </Button>

                            <p className="text-center text-sm">
                                Déjà un compte ?{" "}
                                <Link href="/login" className="text-primary">
                                    Se connecter
                                </Link>
                            </p>

                        </form>
                    </Form>
                </div>
            </div>

            <div className="hidden lg:col-span-2 lg:flex lg:relative lg:overflow-hidden lg:items-center lg:justify-center" style={{backgroundColor: "#8a051a"}}>
                {/* Curved arc pattern with lighter shade */}
                <svg className="absolute w-full h-full" viewBox="0 0 1200 1500" preserveAspectRatio="none">
                    {[...Array(15)].map((_, i) => (
                        <g key={i}>
                            {[...Array(5)].map((_, j) => (
                                <path
                                    key={`${i}-${j}`}
                                    d={`M ${j * 240} ${i * 300} Q ${j * 240 + 500} ${i * 300 + 220} ${j * 240 + 240} ${i * 300 + 300} L ${j * 240 + 240} ${i * 300} Z`}
                                    fill="#d62537"
                                    opacity="0.65"
                                />
                            ))}
                        </g>
                    ))}
                </svg>

            </div>
        </div>
    );
}
