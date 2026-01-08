import { CheckCircle2 } from "lucide-react"

const steps = [
    {
        number: "01",
        title: "Créez Votre Compte",
        description: "En 30 secondes, créez votre compte et accédez immédiatement à la plateforme MobCash.",
    },
    {
        number: "02",
        title: "Configurez Vos Plateformes",
        description:
            "Ajoutez vos plateformes mobile money, vos caisses et configurez vos règles de gestion personnalisées.",
    },
    {
        number: "03",
        title: "Commencez à Gérer",
        description:
            "Prenez le contrôle total de vos opérations avec une supervision complète et des rapports en temps réel.",
    },
]

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 px-4 bg-background">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-balance">Démarrez en Trois Étapes Simples</h2>
                    <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Aucune expertise technique requise. La plupart des équipes sont opérationnelles en moins d'une heure.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full bg-accent/10 text-accent flex items-center justify-center text-3xl font-bold mb-6">
                                    {step.number}
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>

                            {index < steps.length - 1 && (
                                <div className="hidden ml-9 md:block absolute top-10 left-full w-4/5 h-0.5 bg-linear-to-r from-accent/50 to-transparent -translate-x-1/2" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
