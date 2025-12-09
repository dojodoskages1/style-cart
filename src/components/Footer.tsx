import { Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl text-foreground tracking-wider">
              DOJO DOS KAGES
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Seu estilo, seu legado.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full hover:bg-primary transition-colors"
            >
              <Instagram size={20} className="text-foreground" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full hover:bg-primary transition-colors"
            >
              <MessageCircle size={20} className="text-foreground" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Dojo dos Kages. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
