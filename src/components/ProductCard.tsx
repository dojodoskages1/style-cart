import { useState } from 'react';
import { ShoppingCart, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, escolha o tamanho desejado.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, selectedSize);
    setIsAdded(true);
    toast({
      title: "Adicionado ao carrinho!",
      description: `${product.name} - Tamanho ${selectedSize}`,
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="group bg-card rounded-lg overflow-hidden card-hover japanese-border">
      {/* Product Image Carousel */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Navigation Arrows */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronRight size={18} className="text-foreground" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === index
                    ? 'bg-primary w-4'
                    : 'bg-background/60 hover:bg-background/80'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded">
            {product.collection}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-display text-xl text-foreground mb-2 tracking-wide">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="mb-4">
          <span className="font-display text-2xl text-primary">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">TAMANHO</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[40px] h-10 px-3 border transition-all duration-200 text-sm font-medium ${
                  selectedSize === size
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-foreground hover:border-primary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 flex items-center justify-center gap-2 font-medium transition-all duration-300 btn-samurai ${
            isAdded
              ? 'bg-green-600 text-white'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isAdded ? (
            <>
              <Check size={20} />
              Adicionado!
            </>
          ) : (
            <>
              <ShoppingCart size={20} />
              Adicionar ao Carrinho
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
