import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link";

export function CtaSection() {
    return (
        <section className="py-24 px-4 bg-linear-to-br from-primary via-primary to-accent text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-size-[4rem_4rem]" />

            <div className="container mx-auto max-w-4xl text-center relative z-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-balance">
                    Prêt à Prendre le Contrôle de Vos Opérations Mobile Money ?
                </h2>
                <p className="text-base md:text-lg mb-8 opacity-90 text-pretty">
                    Rejoignez-nous et améliorez votre gestion des transactions dès aujourd'hui.
                </p>
                <Link href="/sign-up">
                    <Button size="lg" variant="secondary" className="text-lg px-8 h-14 group cursor-pointer">
                        Commencer
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
            </div>
        </section>
    )
}
