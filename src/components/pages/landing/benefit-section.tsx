import { Clock, Shield, TrendingUp } from "lucide-react"

const benefits = [
    {
        icon: Clock,
        value: "70%",
        label: "Plus Rapide pour le Traitement",
    },
    {
        icon: Shield,
        value: "100%",
        label: "Sécurisé avec Contrôle d'Accès",
    },
    {
        icon: TrendingUp,
        value: "Visibilité",
        label: "En Temps Réel sur Toutes les Opérations",
    },
]

export function BenefitsSection() {
    return (
        <section id="benefits" className="py-24 px-4 bg-primary text-primary-foreground">
            <div className="container mx-auto max-w-12xl">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-balance">
                        Transformez Vos Opérations en Quelques Jours
                    </h2>
                    <p className="text-base md:text-lg opacity-90 text-pretty max-w-2xl mx-auto">
                        Rejoignez des centaines d'entreprises qui ont déjà transformé leurs opérations mobile money.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-4">
                                <benefit.icon className="h-8 w-8" />
                            </div>
                            <div className="text-5xl md:text-6xl font-bold mb-2">{benefit.value}</div>
                            <p className="text-lg opacity-90">{benefit.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
