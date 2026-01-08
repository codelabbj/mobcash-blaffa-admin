"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function HeaderSection() {
    const { user, hydrated } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <nav className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                        MB
                    </div>
                    <span className="text-xl font-bold">MobCash</span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                        Fonctionnalités
                    </a>
                    <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">
                        Avantages
                    </a>
                    <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                        Comment ça marche
                    </a>
                    <a href="#use-cases" className="text-sm font-medium hover:text-primary transition-colors">
                        Cas d'Usage
                    </a>
                    <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
                        FAQ
                    </a>
                </div>

                {/* Desktop Buttons */}
                {hydrated && (
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button
                                        variant="ghost"
                                        className="hover:bg-primary/10 hover:border hover:border-primary/30 hover:text-foreground cursor-pointer"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button className="cursor-pointer">Créer un Compte</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button className="hover:bg-primary/10 hover:border hover:border-primary/30 hover:text-foreground cursor-pointer" variant="ghost">Connexion</Button>
                                </Link>
                                <Link href="/login">
                                    <Button className="cursor-pointer" >Créer un Compte</Button>
                                </Link>
                            </>
                        )}
                    </div>
                )}

                {/* Mobile: Primary Button + Burger Menu */}
                {hydrated && (
                    <div className="flex md:hidden items-center gap-3">
                        {user ? (
                            <Link href="/dashboard">
                                <Button size="sm">Dashboard</Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button size="sm">Créer un Compte</Button>
                            </Link>
                        )}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 hover:bg-primary/10 rounded-md transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                )}
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/95 absolute top-16 left-0 right-0 z-50">
                    <div className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-4">
                        <a
                            href="#features"
                            className="text-sm font-medium hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Fonctionnalités
                        </a>
                        <a
                            href="#benefits"
                            className="text-sm font-medium hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Avantages
                        </a>
                        <a
                            href="#how-it-works"
                            className="text-sm font-medium hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Comment ça marche
                        </a>
                        <a
                            href="#use-cases"
                            className="text-sm font-medium hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Cas d'Usage
                        </a>
                        <a
                            href="#faq"
                            className="text-sm font-medium hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            FAQ
                        </a>

                        <div className="pt-4 border-t border-border flex flex-col gap-2">
                            {user ? (
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full">Créer un Compte</Button>
                                </Link>
                            ) : (
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full">Connexion</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}