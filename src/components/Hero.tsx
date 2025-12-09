import { ChevronDown } from 'lucide-react';
import logo from '@/assets/logo.jpg';

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-4 animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img 
            src={logo} 
            alt="Dojo dos Kages" 
            className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover border-4 border-primary shadow-2xl shadow-primary/30"
          />
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-4 tracking-wider">
          DOJO <span className="text-primary">DOS</span> KAGES
        </h1>
        
        {/* Tagline */}
        <p className="text-lg md:text-xl text-muted-foreground tracking-[0.3em] mb-8">
          SEU ESTILO, SEU LEGADO
        </p>

        {/* CTA */}
        <button
          onClick={scrollToProducts}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-display text-xl tracking-wider hover:bg-primary/90 transition-all duration-300 btn-samurai"
        >
          VER COLEÇÃO
        </button>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
