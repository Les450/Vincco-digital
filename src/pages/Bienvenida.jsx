import Navbar from '../components/Navbar'
import HeroSection from '../sections/HeroSection'
import BenefitsSection from '../sections/BenefitsSection'
import HowItWorks from '../sections/HowItWorks'
import DashboardPreview from '../sections/DashboardPreview'
import StatsSection from '../sections/StatsSection'
import TestimonialsSection from '../sections/TestimonialsSection'
import CTASection from '../sections/CTASection'
import FooterSection from '../sections/FooterSection'
import '../styles/home.css'

// Landing publica de marketing: se muestra en /bienvenida, fuera del
// shell de la app (sin barra inferior). Antes estos componentes
// (Navbar + secciones) no estaban conectados a ninguna ruta.
export default function Bienvenida() {
  return (
    <div style={{ background: '#ffffff' }}>
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <HowItWorks />
      <DashboardPreview />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}
