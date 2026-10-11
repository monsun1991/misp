import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/store/useAuthStore';
import { 
  LogIn, 
  LayoutDashboard, 
  Download, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Calculator,
  MessageSquare
} from 'lucide-react';

interface HeroSlide {
  src: string;
  title: string;
  sub: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/assets/heroes/hero_slim_panel.jpg',
    title: 'Aluminium Slim Panel',
    sub: 'Recessed panel for offices, hotels and commercial interiors'
  },
  {
    src: '/assets/products/deeo_panel.jpg',
    title: 'Deeo Deep Downlight',
    sub: 'Deep anti-glare reflector, luxury rose gold and chrome finish'
  },
  {
    src: '/assets/heroes/hero_gate_light.jpg',
    title: '20W Modern Gate Lantern (IP65)',
    sub: 'Heavy die-cast weatherproof body for pillars and gates'
  },
  {
    src: '/assets/heroes/hero_floodlight.jpg',
    title: '200W DOB Industrial Flood Light (IP66)',
    sub: 'High lumen output for factories, yards and large outdoor areas'
  }
];

export const LandingPage: React.FC = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  // Hero switcher state
  const [activeSlide, setActiveSlide] = useState(0);

  // Calculator state
  const [numFixtures, setNumFixtures] = useState(50);
  const [hoursPerDay, setHoursPerDay] = useState(12);
  const [oldWattage, setOldWattage] = useState(50);
  const [ledWattage, setLedWattage] = useState(8);
  const [elecRate, setElecRate] = useState(9);

  // Quote form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    type: 'Distributor or dealer',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  // Live calculator calculation
  const unitsSaved = Math.max(0, (numFixtures * (oldWattage - ledWattage) / 1000) * hoursPerDay * 365);
  const moneySaved = unitsSaved * elecRate;
  const powerReduction = oldWattage > 0 ? Math.max(0, ((oldWattage - ledWattage) / oldWattage) * 100) : 0;
  const co2Avoided = unitsSaved * 0.82;

  const handleDatasheetClick = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      message: `I would like datasheets for: ${categoryName}. City and quantity: `
    }));
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim() || !formData.phone.trim()) {
      setFormStatus('Please fill in your name, company, and phone number.');
      return;
    }

    const text = `Enquiry from ${formData.name} (${formData.company})\nPhone: ${formData.phone}\nEmail: ${formData.email || '-'}\nType: ${formData.type}\nRequirements: ${formData.message}`;
    const waUrl = `https://wa.me/917827381925?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setFormStatus('Opening WhatsApp with your enquiry details...');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f13] text-[#16221b] dark:text-gray-100 font-sans selection:bg-lime-500 selection:text-black">
      
      {/* Top Global Notification Strip */}
      <div className="bg-[#16221b] dark:bg-[#070b0e] text-white/90 text-xs py-2 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-400 font-semibold text-[11px] border border-lime-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse"></span>
              OEM & Wholesale Manufacturing
            </span>
            <span className="hidden sm:inline text-gray-300">
              • Plot No-47, DSIIDC Bawana, Delhi • ISO 9001:2008 & IEC 60669-1 Compliant
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="tel:+917827381925" className="hover:text-lime-400 transition-colors flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-lime-400" />
              <span>+91 78273 81925</span>
            </a>
            <span className="text-gray-500 hidden md:inline">|</span>
            <a href="mailto:eiffellite@gmail.com" className="hover:text-lime-400 transition-colors hidden md:flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-lime-400" />
              <span>eiffellite@gmail.com</span>
            </a>
            <span className="text-gray-500 hidden sm:inline">|</span>
            {isAuthenticated ? (
              <Link to="/dashboard" className="text-lime-400 font-bold hover:underline flex items-center gap-1">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Go to Dashboard &rarr;</span>
              </Link>
            ) : (
              <Link to="/login" className="text-lime-400 font-bold hover:underline flex items-center gap-1">
                <LogIn className="w-3.5 h-3.5" />
                <span>MIPS Portal Login &rarr;</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b0f13]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-all">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="h-12 w-auto bg-black rounded-xl p-1.5 border border-white/10 flex items-center justify-center shadow-md">
              <img src="/assets/eiffel-logo.jpg" alt="Eiffel Lighting Logo" className="h-9 w-auto object-contain" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-1">
                <span>EIFFEL</span>
                <span className="text-lime-600 dark:text-lime-400 font-extrabold text-sm tracking-wider">LIGHTING</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                Your Trusted OEM Partner
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300">
            <a href="#products" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">Products</a>
            <a href="#applications" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">Applications</a>
            <a href="#oem" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">OEM Supply</a>
            <a href="#savings" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">ROI Calculator</a>
            <a href="#downloads" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">Downloads</a>
            <a href="#contact" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">Contact</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Dashboard</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-lime-500/20 text-gray-800 dark:text-lime-400 border border-gray-300 dark:border-lime-500/30 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>MIPS Login</span>
              </Link>
            )}

            <a 
              href="#contact" 
              className="px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs shadow-md shadow-lime-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Get a Quote</span>
            </a>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="py-14 sm:py-20 border-b border-gray-200 dark:border-white/5 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-600 dark:text-lime-400 text-xs font-semibold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Engineered In Bawana, Delhi • Official 2024 Catalogue</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 dark:text-white leading-[1.15]">
                LED lighting built in Delhi for dealers, brands and projects
              </h1>

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-5 max-w-2xl leading-relaxed">
                We manufacture panels, downlights, COB spots, flood lights and street lights, and supply them under your brand or ours with rigorous batch surge and burn-in testing.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 mt-8">
                <a 
                  href="#products" 
                  className="px-6 py-3.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-sm shadow-xl shadow-lime-500/20 transition-all flex items-center gap-2"
                >
                  <span>See Product Range</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a 
                  href="/assets/Eiffel-Lighting-Catalogue.pdf" 
                  download 
                  className="px-5 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-900 dark:text-white font-bold text-sm border border-gray-300 dark:border-white/10 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>Download Catalogue (PDF)</span>
                </a>

                <Link
                  to="/login"
                  className="px-5 py-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-bold text-sm border border-blue-300 dark:border-blue-800/40 transition-all flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Portal Login</span>
                </Link>
              </div>

              {/* Fast Facts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-200 dark:border-white/10 w-full text-sm">
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#131b23] border border-gray-200 dark:border-white/5">
                  <strong className="block text-gray-900 dark:text-white font-bold">Bawana, Delhi</strong>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Own manufacturing unit</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#131b23] border border-gray-200 dark:border-white/5">
                  <strong className="block text-gray-900 dark:text-white font-bold">OEM &amp; Private Label</strong>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Your logo, your packaging</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#131b23] border border-gray-200 dark:border-white/5">
                  <strong className="block text-gray-900 dark:text-white font-bold">Batch Tested</strong>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Surge &amp; voltage stress checks</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Showcase */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 bg-gray-50 dark:bg-[#131b23] shadow-xl">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center border border-white/10">
                  <img 
                    src={HERO_SLIDES[activeSlide].src} 
                    alt={HERO_SLIDES[activeSlide].title} 
                    className="w-full h-full object-cover transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-5">
                    <span className="px-2 py-0.5 rounded bg-lime-500 text-black text-[10px] font-black uppercase tracking-wider w-max mb-1">
                      Featured Luminaire
                    </span>
                    <strong className="text-white text-lg font-bold">
                      {HERO_SLIDES[activeSlide].title}
                    </strong>
                    <span className="text-xs text-gray-300 mt-0.5">
                      {HERO_SLIDES[activeSlide].sub}
                    </span>
                  </div>
                </div>

                {/* Thumbnails row */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`rounded-lg overflow-hidden border-2 h-14 bg-black transition-all ${
                        activeSlide === idx ? 'border-lime-500 scale-102' : 'border-gray-300 dark:border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Product Range Section */}
      <section id="products" className="py-16 sm:py-20 bg-gray-50 dark:bg-[#0e141a] border-b border-gray-200 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-widest">
              Engineering Catalogue 2024
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-1">
              Precision LED Product Range
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Seven comprehensive product lines. Request a datasheet for any model to receive photometric charts, cut-out templates, and lumen specs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            <article className="bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-lime-500/50 transition-colors">
              <div>
                <span className="text-xs font-semibold text-lime-600 dark:text-lime-400">Indoor Recessed</span>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1">Slim &amp; DOB Panels</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  Recessed round and square panels with optical PMMA light guides for luxury workspaces, residences and hospitals.
                </p>
              </div>
              <button 
                onClick={() => handleDatasheetClick('Slim & DOB Panels')}
                className="mt-6 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Request Datasheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>

            <article className="bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-lime-500/50 transition-colors">
              <div>
                <span className="text-xs font-semibold text-lime-600 dark:text-lime-400">Surface Mounted</span>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1">Surface Panels</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  Low-profile surface-mount fixtures engineered for concrete slabs and ceilings where cutting is not feasible.
                </p>
              </div>
              <button 
                onClick={() => handleDatasheetClick('Surface Panels')}
                className="mt-6 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Request Datasheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>

            <article className="bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-lime-500/50 transition-colors">
              <div>
                <span className="text-xs font-semibold text-lime-600 dark:text-lime-400">Architectural</span>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1">Architectural COB Lights</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  Narrow and medium beam spotlighting for high-end retail showrooms, boutique hotels and art galleries.
                </p>
              </div>
              <button 
                onClick={() => handleDatasheetClick('Architectural COB Lights')}
                className="mt-6 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Request Datasheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>

            <article className="bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-lime-500/50 transition-colors">
              <div>
                <span className="text-xs font-semibold text-lime-600 dark:text-lime-400">Anti-Glare</span>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1">Concealed &amp; Downlights</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  Deep-set optical chambers that hide direct LED glare, creating calm, premium atmospheric lighting.
                </p>
              </div>
              <button 
                onClick={() => handleDatasheetClick('Concealed & Downlights')}
                className="mt-6 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Request Datasheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>

            <article className="bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-lime-500/50 transition-colors">
              <div>
                <span className="text-xs font-semibold text-lime-600 dark:text-lime-400">Heavy Industrial</span>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1">Flood &amp; Street Lights</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  IP65 &amp; IP66 weatherproof die-cast luminaires with 4.0 kV surge immunity for plant yards and perimeter roads.
                </p>
              </div>
              <button 
                onClick={() => handleDatasheetClick('Flood & Street Lights')}
                className="mt-6 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Request Datasheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>

            <article className="bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-lime-500/50 transition-colors">
              <div>
                <span className="text-xs font-semibold text-lime-600 dark:text-lime-400">Commercial Standard</span>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1">LED Bulbs &amp; T-Lamps</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  High-efficiency retrofit lamps for wholesale distributor networks and mass commercial replacement projects.
                </p>
              </div>
              <button 
                onClick={() => handleDatasheetClick('LED Bulbs & T-Lamps')}
                className="mt-6 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Request Datasheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>

            <article className="bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-lime-500/50 transition-colors">
              <div>
                <span className="text-xs font-semibold text-lime-600 dark:text-lime-400">Decorative Cove</span>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1">Strip &amp; Rope Lights</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  Continuous flicker-free silicon and copper tracks for false ceilings, architectural coves, and signage.
                </p>
              </div>
              <button 
                onClick={() => handleDatasheetClick('Strip & Rope Lights')}
                className="mt-6 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Request Datasheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>

            {/* Catalogue Download Card */}
            <article className="bg-gradient-to-br from-lime-500/20 to-lime-600/10 border border-lime-500/30 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wider">
                  Full 31-Spread PDF
                </span>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1">Complete Catalogue</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                  Download the high-resolution original CorelDRAW engineering catalogue with full dimension charts and lumen specs.
                </p>
              </div>
              <a 
                href="/assets/Eiffel-Lighting-Catalogue.pdf" 
                download 
                className="mt-6 py-2.5 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF (72MB)</span>
              </a>
            </article>

          </div>
        </div>
      </section>

      {/* OEM Supply Section */}
      <section id="oem" className="py-16 sm:py-20 border-b border-gray-200 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-widest">
                Factory OEM Partner
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white mt-1">
                OEM &amp; Private Label Supply
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm leading-relaxed">
                If you sell lighting under your own brand, we manufacture directly to your technical specifications and package them your way in our Bawana facility.
              </p>
              <a 
                href="#contact" 
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs shadow-md transition-all"
              >
                <span>Discuss an OEM Order</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#131b23] border border-gray-200 dark:border-white/5 flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 dark:text-white font-bold text-sm block">Your Brand on the Product</strong>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Precision laser-marked logos, custom gift boxes, barcode labels, and master shipping cartons branded with your identity.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#131b23] border border-gray-200 dark:border-white/5 flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 dark:text-white font-bold text-sm block">Engineered for Indian Power Conditions</strong>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    100–300V AC wide voltage operation, 4.0 kV surge protection, and high heat-dissipation aluminium alloy housings.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#131b23] border border-gray-200 dark:border-white/5 flex items-start gap-4">
                <Building2 className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 dark:text-white font-bold text-sm block">Driver &amp; Reflector Customization</strong>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Isolated constant-current drivers, DOB modules, and reflector cups available in rose gold, champagne gold, chrome, and matte black.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ROI & Energy Saving Calculator Section */}
      <section id="savings" className="py-16 sm:py-20 bg-gray-50 dark:bg-[#0e141a] border-b border-gray-200 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-widest">
                Financial Savings
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white mt-1">
                How Much Will LED Save You?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm leading-relaxed">
                Enter your existing light fixtures and the LED luminaire wattage you plan to deploy. The calculator computes an instant yearly estimate of electricity units (kWh) and INR saved.
              </p>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1.5">Number of Fixtures</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={numFixtures} 
                    onChange={(e) => setNumFixtures(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1.5">Operating Hours / Day</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="24" 
                    value={hoursPerDay} 
                    onChange={(e) => setHoursPerDay(Math.min(24, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1.5">Old Fixture Wattage (W)</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={oldWattage} 
                    onChange={(e) => setOldWattage(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1.5">New LED Wattage (W)</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={ledWattage} 
                    onChange={(e) => setLedWattage(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1.5">Electricity Tariff Rate (₹ / unit)</label>
                  <input 
                    type="number" 
                    min="1" 
                    step="0.5" 
                    value={elecRate} 
                    onChange={(e) => setElecRate(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Outputs display */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                <div className="p-3.5 rounded-xl bg-lime-500/10 border border-lime-500/20 text-center">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-medium">Saved / Year</span>
                  <strong className="text-base sm:text-lg font-black text-lime-600 dark:text-lime-400 mt-1 block">
                    ₹ {Math.round(moneySaved).toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-medium">Units Saved</span>
                  <strong className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400 mt-1 block">
                    {Math.round(unitsSaved).toLocaleString('en-IN')} kWh
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-medium">Reduction</span>
                  <strong className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400 mt-1 block">
                    {Math.round(powerReduction)}%
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-medium">CO₂ Avoided</span>
                  <strong className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                    {Math.round(co2Avoided).toLocaleString('en-IN')} kg
                  </strong>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Downloads & Quality Standards Section */}
      <section id="downloads" className="py-16 sm:py-20 border-b border-gray-200 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-widest">
              Technical Documentation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white mt-1">
              Downloads &amp; Certificates
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Documents your purchase team, architects, and electrical contractors usually require.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#131b23] shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Product Catalogue</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  All models with dimensions, cutouts and photometric data.
                </p>
              </div>
              <a 
                href="/assets/Eiffel-Lighting-Catalogue.pdf" 
                download 
                className="mt-6 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Download PDF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#131b23] shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Model Datasheets</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  Model-wise specifications and CRI/PF test metrics.
                </p>
              </div>
              <a 
                href="#contact" 
                onClick={() => handleDatasheetClick('Complete Datasheets')}
                className="mt-6 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Request by Model</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#131b23] shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Certificates &amp; Reports</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  ISO 9001:2008 and IEC 60669-1 quality and safety documents.
                </p>
              </div>
              <a 
                href="#contact" 
                onClick={() => handleDatasheetClick('ISO / IEC Certificates')}
                className="mt-6 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Request Copies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#131b23] shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Warranty Terms</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  Coverage periods and replacement processes for dealers.
                </p>
              </div>
              <a 
                href="#contact" 
                onClick={() => handleDatasheetClick('Warranty Terms Document')}
                className="mt-6 text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Request Terms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-gray-50 dark:bg-[#0e141a] border-b border-gray-200 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5">
              <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-widest">
                Factory Direct
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white mt-1">
                Ask For a Quote
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">
                Tell us your luminaire specifications, batch quantity, or project requirements. We reply with engineering datasheets and wholesale OEM pricing.
              </p>

              <div className="mt-8 space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10">
                  <h3 className="font-bold text-gray-900 dark:text-white">Manufacturing Plant</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Plot No-47, Block-C, Sector-5, DSIIDC Industrial Area, Bawana, Delhi - 110039
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10">
                  <h3 className="font-bold text-gray-900 dark:text-white">Phone &amp; WhatsApp</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    +91 78273 81925, +91 98116 36807<br />Landline: 011-47074183
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10">
                  <h3 className="font-bold text-gray-900 dark:text-white">Email Address</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    eiffellite@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form 
                onSubmit={handleQuoteSubmit}
                className="bg-white dark:bg-[#131b23] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4 text-xs font-semibold"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company / Brand"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">I am a</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white"
                  >
                    <option>Distributor or dealer</option>
                    <option>OEM or private label brand</option>
                    <option>Architect or designer</option>
                    <option>Contractor or builder</option>
                    <option>Facility manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">What do you need?</label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Product models, wattage, quantity, project location..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs shadow-lg shadow-lime-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Enquiry via WhatsApp</span>
                </button>

                {formStatus && (
                  <p className="text-lime-600 dark:text-lime-400 text-center font-bold text-xs mt-2">
                    {formStatus}
                  </p>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#16221b] dark:bg-black text-gray-400 py-12 border-t border-white/10 text-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/eiffel-logo.jpg" alt="Eiffel Logo" className="h-8 w-auto object-contain rounded" />
            <div>
              <strong className="text-white block font-bold">Eiffel Lighting Industries</strong>
              <span>Plot No-47, Sector-5, DSIIDC Bawana, Delhi - 110039</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#products" className="hover:text-white transition-colors">Products</a>
            <a href="#oem" className="hover:text-white transition-colors">OEM Supply</a>
            <a href="#downloads" className="hover:text-white transition-colors">Downloads</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            {isAuthenticated ? (
              <Link to="/dashboard" className="text-lime-400 font-bold hover:underline">
                MIPS Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-lime-400 font-bold hover:underline">
                MIPS Login
              </Link>
            )}
          </div>

          <div>
            &copy; {new Date().getFullYear()} Eiffel Lighting Industries • All rights reserved
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action */}
      <a 
        href="https://wa.me/917827381925?text=Hello%20Eiffel%20Lighting%2C%20I%20need%20a%20quote." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-2xl flex items-center gap-2 transition-transform hover:scale-105"
      >
        <MessageSquare className="w-4 h-4 fill-white" />
        <span>WhatsApp Us</span>
      </a>

    </div>
  );
};

export default LandingPage;
