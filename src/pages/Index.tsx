import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

const Index = () => {
  const products = useStore((state) => state.products);

  const collections = [...new Set(products.map((p) => p.collection))];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Products Section */}
      <main id="products" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4 tracking-wider">
            NOSSAS COLEÇÕES
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>

        {collections.map((collection) => (
          <section key={collection} className="mb-16">
            <h3 className="font-display text-2xl text-primary mb-8 tracking-wider border-l-4 border-primary pl-4">
              {collection.toUpperCase()}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products
                .filter((p) => p.collection === collection)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </section>
        ))}

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Nenhum produto disponível no momento.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
