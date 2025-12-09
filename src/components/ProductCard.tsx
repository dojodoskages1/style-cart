import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Product, useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);
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

  return (
    <div className="group bg-card rounded-lg overflow-hidden card-hover japanese-border">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
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
