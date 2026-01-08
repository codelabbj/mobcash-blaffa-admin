import { Card } from "@/components/ui/card"
import { Activity, BarChart3, RefreshCw, Settings } from "lucide-react"

const features = [
    {
        icon: Activity,
        title: "Gestion des Transactions en Temps Réel",
        description:
            "Traitez instantanément les demandes de recharge et d'annulation avec un suivi en temps réel sur toutes les plateformes.",
    },
    {
        icon: Settings,
        title: "Support Multi-Plateformes",
        description: "Gérez plusieurs plateformes et points de service depuis un tableau de bord unique et centralisé.",
    },
    {
        icon: RefreshCw,
        title: "Opérations de Caisse",
        description:
            "Suivez et contrôlez efficacement toutes vos caisses avec une visibilité complète sur les performances.",
    },
    {
        icon: BarChart3,
        title: "Configuration des Commissions",
        description: "Structurez vos frais et modèles de revenus de manière flexible selon vos besoins métier.",
    },
]

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 px-4 bg-background">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-balance">
                        Tout Ce Dont Vous Avez Besoin, Rien de Superflu
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Des fonctionnalités puissantes conçues pour les réalités de la gestion mobile money en Afrique.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="p-8 hover:shadow-lg transition-shadow border-border/50">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
