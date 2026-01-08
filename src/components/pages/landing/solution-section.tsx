import { ArrowRight, BarChart3, RefreshCcw, Zap } from "lucide-react"

export function SolutionSection() {
    return (
        <section className="py-24 px-4 bg-stone-100">
            <div className="container mx-auto max-w-12xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Une Plateforme, Un Contrôle Total</h2>
                    <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
                        MobCash centralise vos opérations mobile money dans une plateforme intelligente qui travaille avec la même
                        intensité que vous.
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <RefreshCcw className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Connectez</h3>
                        <p className="text-muted-foreground text-sm">Intégrez toutes vos plateformes mobile money</p>
                    </div>

                    <div className="flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                            <Zap className="h-8 w-8 text-accent" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Automatisez</h3>
                        <p className="text-muted-foreground text-sm">Réconciliation et rapports automatisés par IA</p>
                    </div>

                    <div className="flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                            <BarChart3 className="h-8 w-8 text-accent" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Développez</h3>
                        <p className="text-muted-foreground text-sm">Prenez des décisions éclairées instantanément</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
