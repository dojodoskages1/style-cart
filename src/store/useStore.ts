import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  description: string;
  sizes: string[];
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  isAuthenticated: boolean;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  
  // Cart actions
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  
  // Auth actions
  login: (password: string) => boolean;
  logout: () => void;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Camiseta Samurai Spirit',
    collection: 'Bushido',
    price: 129.90,
    description: 'Camiseta premium com estampa exclusiva de samurai. Tecido 100% algodão penteado.',
    sizes: ['P', 'M', 'G', 'GG'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500',
    ],
  },
  {
    id: '2',
    name: 'Moletom Kage Shadow',
    collection: 'Kage',
    price: 249.90,
    description: 'Moletom oversized com capuz. Design minimalista com detalhes bordados.',
    sizes: ['P', 'M', 'G', 'GG'],
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=500',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500',
    ],
  },
  {
    id: '3',
    name: 'Calça Ninja Tech',
    collection: 'Shinobi',
    price: 199.90,
    description: 'Calça cargo com bolsos funcionais. Tecido ripstop resistente.',
    sizes: ['38', '40', '42', '44'],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
    ],
  },
  {
    id: '4',
    name: 'Jaqueta Ronin',
    collection: 'Bushido',
    price: 399.90,
    description: 'Jaqueta estilo bomber com forro interno. Acabamento premium.',
    sizes: ['P', 'M', 'G', 'GG'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500',
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=500',
    ],
  },
];

export const useStore = create<StoreState>((set, get) => ({
  products: initialProducts,
  cart: [],
  isAuthenticated: false,

  addProduct: (product) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    set((state) => ({ products: [...state.products, newProduct] }));
  },

  removeProduct: (id) => {
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  addToCart: (product, size) => {
    set((state) => {
      const existingItem = state.cart.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity: 1, size }] };
    });
  },

  removeFromCart: (productId, size) => {
    set((state) => ({
      cart: state.cart.filter(
        (item) => !(item.product.id === productId && item.size === size)
      ),
    }));
  },

  updateQuantity: (productId, size, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId, size);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),

  login: (password) => {
    if (password === 'admin123') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false }),
}));
