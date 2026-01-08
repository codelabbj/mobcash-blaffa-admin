import { Card } from "@/components/ui/card"
import { AlertCircle, Clock, FileX, TrendingDown } from "lucide-react"

const problems = [
    {
        icon: FileX,
        title: "Réconciliation Manuelle Chronophage",
        description:
            "Des heures perdues à rapprocher les transactions sur plusieurs plateformes, au détriment du développement de votre activité.",
    },
    {
        icon: AlertCircle,
        title: "Aucune Visibilité en Temps Réel",
        description:
            "Vous pilotez à l'aveugle avec des rapports différés et des données dispersées, impossible d'anticiper les problèmes avant qu'ils ne s'aggravent.",
    },
    {
        icon: TrendingDown,
        title: "Pertes de Revenus",
        description:
            "L'argent vous échappe à cause de transactions non réconciliées et d'erreurs humaines qui grèvent silencieusement vos profits.",
    },
    {
        icon: Clock,
        title: "Goulots d'Étranglement Opérationnels",
        description:
            "Votre équipe se noie dans les tableurs et processus manuels au lieu de se concentrer sur les initiatives stratégiques de croissance.",
    },
]

export function ProblemSection() {
    return (
        <section className="py-24 px-4 bg-background">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                        Gérer le Mobile Money Ne Devrait Pas Être Si Compliqué
                    </h2>
                    <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Vous vous reconnaissez ? Vous n'êtes pas seul. Ces défis coûtent des millions aux entreprises chaque année.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {problems.map((problem, index) => (
                        <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
                                    <problem.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
