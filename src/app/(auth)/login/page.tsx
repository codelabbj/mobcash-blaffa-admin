"use client"

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useLogin} from "@/hooks/use-auth";

const formSchema =z.object({
    email:z.string({message:"Veuillez entrer votre email"}).email({message:"Veuillez fournir un email valide"}),
    password:z.string({message:"Veuillez votre mot de passe"}).min(4,{message:"Le mot de passe doit contenir au moins quatre (04) caractères"})
})

export default function LoginPage() {

    const [showPassword,setShowPassword] = useState(false);

    const login = useLogin()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            email: "",
            password: ""
        }
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        login.mutate(values)
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 h-screen bg-background">
            <div className="lg:col-span-3 flex flex-col items-center justify-center space-y-8 px-8">
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

                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2">
                        <p className="text-4xl font-bold text-foreground">Bienvenue!</p>
                        <p className="text-muted-foreground text-sm">Connectez-vous pour accéder à votre tableau de bord</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-foreground">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-all"
                                                placeholder="johndoe@mail.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold text-foreground">Mot de passe</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        className="px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-all pr-12"
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                                                        onClick={()=> setShowPassword(!showPassword)}
                                                    >
                                                        {
                                                            showPassword ? (
                                                                <EyeOff className="w-5 h-5"/>
                                                            ): (
                                                                <Eye className="w-5 h-5" />
                                                            )
                                                        }
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                disabled={login.isPending}
                                className="w-full py-3 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {login.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                        <span>Connexion en cours...</span>
                                    </div>
                                ) : (
                                    <span>Se connecter</span>
                                )}
                            </Button>
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
    )
}