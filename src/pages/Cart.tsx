import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(15, "WhatsApp inválido").regex(/^[\d\s\-\(\)]+$/, "Apenas números são permitidos"),
});

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string }>({});

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = checkoutSchema.safeParse({ name, whatsapp });
    
    if (!result.success) {
      const fieldErrors: { name?: string; whatsapp?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'name') fieldErrors.name = err.message;
        if (err.path[0] === 'whatsapp') fieldErrors.whatsapp = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    // Create WhatsApp message
    const orderItems = cart
      .map(
        (item) =>
          `• ${item.product.name} (Tam: ${item.size}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}`
      )
      .join('\n');

    const message = `🥷 *NOVO PEDIDO - DOJO DOS KAGES*\n\n*Cliente:* ${name}\n*WhatsApp:* ${whatsapp}\n\n*Itens:*\n${orderItems}\n\n*Total:* R$ ${total.toFixed(2).replace('.', ',')}\n\n---\nPedido realizado pelo site.`;

    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '5511999999999'; // Replace with store number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Show success
    setIsSubmitted(true);
    clearCart();

    toast({
      title: "Pedido enviado!",
      description: "Entraremos em contato em breve.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h1 className="font-display text-4xl text-foreground mb-4 tracking-wider">
              PEDIDO ENVIADO!
            </h1>
            <p className="text-muted-foreground mb-8">
              Entraremos em contato pelo WhatsApp informado para confirmar seu pedido.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-display text-lg tracking-wider hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft size={20} />
              VOLTAR À LOJA
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Continuar Comprando
        </Link>

        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8 tracking-wider">
          SEU CARRINHO
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-8">
              Seu carrinho está vazio.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-display text-lg tracking-wider hover:bg-primary/90 transition-colors"
            >
              VER PRODUTOS
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="bg-card p-4 rounded-lg border border-border flex gap-4"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-foreground">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tamanho: {item.size}
                    </p>
                    <p className="text-primary font-display text-lg mt-1">
                      R$ {item.product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-secondary rounded hover:bg-primary transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-secondary rounded hover:bg-primary transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Form */}
            <div className="bg-card p-6 rounded-lg border border-border h-fit">
              <h2 className="font-display text-2xl text-foreground mb-6 tracking-wider">
                FINALIZAR PEDIDO
              </h2>

              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-display text-2xl text-primary">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="Digite seu nome"
                    required
                    maxLength={100}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Seu WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="(11) 99999-9999"
                    required
                    maxLength={15}
                  />
                  {errors.whatsapp && (
                    <p className="text-destructive text-sm mt-1">{errors.whatsapp}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 font-display text-lg tracking-wider flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors btn-samurai"
                >
                  <Send size={20} />
                  ENVIAR PEDIDO
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  Ao enviar, você será redirecionado para o WhatsApp.
                </p>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
