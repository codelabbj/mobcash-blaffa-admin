import {HeaderSection} from "@/components/pages/landing/header-section";
import {HeroSection} from "@/components/pages/landing/hero-section";
import {FeaturesSection} from "@/components/pages/landing/features-section";
import {BenefitsSection} from "@/components/pages/landing/benefit-section";
import {HowItWorksSection} from "@/components/pages/landing/how-it-works-section";
import {UseCasesSection} from "@/components/pages/landing/use-cases-section";
import {FaqSection} from "@/components/pages/landing/faq-section";
import {CtaSection} from "@/components/pages/landing/cta-section";
import {FooterSection} from "@/components/pages/landing/footer-section";

export default function Home(){
    return (
        <>
            <HeaderSection />
            <main>
                <HeroSection />
                <FeaturesSection />
                <BenefitsSection />
                <HowItWorksSection />
                <UseCasesSection />
                <FaqSection />
                <CtaSection />
            </main>
            <FooterSection />
        </>
    )
}