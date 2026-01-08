export function FooterSection() {
    return (
        <footer className="pt-8 pb-0 px-4 bg-background border-t border-border">
            <div className="container mx-auto max-w-7xl pb-0">
                <div className="flex flex-col md:flex-row items-start gap-24 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                MB
                            </div>
                            <span className="text-xl font-bold">MobCash</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            La plateforme tout-en-un pour la gestion et l'analyse du mobile money.
                        </p>
                    </div>

                </div>

                <div className="pt-4 pb-4 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground mb-0">2026 MobCash. Tous droits réservés.</p>

                    <p className="text-sm text-muted-foreground mb-0">
                        Développé par{" "}
                        <a
                            href="https://codelab.bj"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                            Codelab
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
