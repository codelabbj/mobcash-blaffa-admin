import { Card } from "@/components/ui/card"
import { Building2, Landmark, ShoppingBag, Smartphone, Users } from "lucide-react"

const useCases = [
    {
        icon: Building2,
        title: "Bookmakers",
        description: "Gérez efficacement les transactions de paris en ligne et en points de vente avec un suivi complet.",
    },
    {
        icon: Smartphone,
        title: "Opérateurs Mobile Money",
        description: "Centralisez le pilotage de votre réseau d'agents et supervisez l'ensemble des flux financiers.",
    },
    {
        icon: Users,
        title: "Gestionnaires de Réseaux d'Agents",
        description: "Suivez les performances de chaque agent et optimisez la distribution de la liquidité.",
    },
    {
        icon: Landmark,
        title: "Prestataires de Services Financiers",
        description: "Offrez des services financiers mobiles avec une infrastructure de gestion robuste et sécurisée.",
    },
    {
        icon: ShoppingBag,
        title: "Opérateurs Multi-Sites",
        description: "Gérez plusieurs points de caisse simultanément avec une visibilité centralisée en temps réel.",
    },
]

export function UseCasesSection() {
    return (
        <section id="use-cases" className="py-24 px-4 bg-stone-100">
            <div className="container mx-auto max-w-12xl">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-balance">Conçu Pour Tous Types d'Entreprises</h2>
                    <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Que vous soyez une startup ou une entreprise établie, MobCash évolue avec vos besoins.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {useCases.map((useCase, index) => (
                        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                                <useCase.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{useCase.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
