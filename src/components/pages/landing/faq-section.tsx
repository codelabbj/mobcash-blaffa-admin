import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
    {
        question: "Quelle est la sécurité de la plateforme ?",
        answer:
            "La plateforme est conforme aux normes de sécurité les plus strictes. Nous ne stockons jamais vos identifiants sensibles et utilisons des connexions API sécurisées.",
    },
    {
        question: "Puis-je intégrer mes systèmes existants ?",
        answer:
            "Oui, MobCash s'intègre avec tous les principaux opérateurs mobile money en Afrique ainsi qu'avec les APIs bancaires et passerelles de paiement personnalisées. Notre équipe technique vous accompagne dans le processus d'intégration.",
    },
    {
        question: "Quel support proposez-vous ?",
        answer:
            "Nous offrons un support client 24h/24 et 7j/7 par email, chat en direct et téléphone. Les clients entreprise bénéficient de gestionnaires de compte dédiés et d'un support prioritaire. Nous proposons également une documentation complète et des tutoriels vidéo.",
    },
    {
        question: "Combien de temps prend la mise en place ?",
        answer:
            "La plupart des entreprises sont opérationnelles en moins d'une heure. La configuration initiale est simple et intuitive. Notre équipe d'onboarding est disponible pour vous accompagner à chaque étape si nécessaire.",
    },
]

export function FaqSection() {
    return (
        <section id="faq" className="py-24 px-4 bg-background">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-balance">Questions Fréquentes</h2>
                    <p className="text-base md:text-lg text-muted-foreground text-pretty">Tout ce que vous devez savoir sur MobCash.</p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-semibold">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
