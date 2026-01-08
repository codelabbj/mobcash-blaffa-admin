import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative flex items-center justify-center px-4 py-24 overflow-hidden bg-gradient-to-b from-gray-100 via-gray-50 to-stone-100">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4d4d8_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d8_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30 pointer-events-none" />
            <div className="container mx-auto max-w-12xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-hot/10 text-hot text-sm font-medium mb-6">
                            <span className="w-2 h-2 bg-hot rounded-full animate-pulse" />
                            <span>Confiance des entreprises à travers l'Afrique</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-6">
                            Gérez Vos Opérations Mobile
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto lg:mx-0">
                            Centralisez recharges, annulations et caisses. Réduisez les erreurs, gagnez en efficacité.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/sign-up">
                                <Button size="lg" className="text-lg px-8 h-14 group cursor-pointer">
                                    Créer un Compte
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>

                        </div>

                    </div>

                    <div className="flex-1 w-full max-w-4xl">
                        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border">
                            <Image
                                src="/images/dashboard-screen.png"
                                alt="Tableau de bord MobCash"
                                width={1200}
                                height={800}
                                className="w-full h-auto"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
