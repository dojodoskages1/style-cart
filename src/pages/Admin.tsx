import { useState } from 'react';
import { useStore, Product } from '@/store/useStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lock, Plus, Trash2, Edit2, Save, X, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().trim().min(2, "Nome obrigatório").max(100),
  collection: z.string().trim().min(2, "Coleção obrigatória").max(50),
  price: z.number().positive("Preço deve ser positivo"),
  description: z.string().trim().min(10, "Descrição muito curta").max(500),
  sizes: z.string().trim().min(1, "Informe os tamanhos"),
  images: z.string().trim().min(1, "Informe as URLs das imagens"),
});

const Admin = () => {
  const { isAuthenticated, login, logout, products, addProduct, removeProduct, updateProduct } = useStore();
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    collection: '',
    price: '',
    description: '',
    sizes: '',
    images: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      collection: '',
      price: '',
      description: '',
      sizes: '',
      images: '',
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast({ title: "Login realizado com sucesso!" });
      setPassword('');
    } else {
      toast({ title: "Senha incorreta", variant: "destructive" });
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      sizes: formData.sizes,
      images: formData.images,
    };

    const result = productSchema.safeParse(data);
    if (!result.success) {
      toast({ title: "Preencha todos os campos corretamente", variant: "destructive" });
      return;
    }

    addProduct({
      name: formData.name,
      collection: formData.collection,
      price: parseFloat(formData.price),
      description: formData.description,
      sizes: formData.sizes.split(',').map((s) => s.trim()),
      images: formData.images.split(',').map((s) => s.trim()),
    });

    toast({ title: "Produto adicionado!" });
    resetForm();
    setShowAddForm(false);
  };

  const handleUpdateProduct = (id: string) => {
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      images: formData.images,
    };

    const result = productSchema.safeParse(data);
    if (!result.success) {
      toast({ title: "Preencha todos os campos corretamente", variant: "destructive" });
      return;
    }

    updateProduct(id, {
      name: formData.name,
      collection: formData.collection,
      price: parseFloat(formData.price),
      description: formData.description,
      sizes: formData.sizes.split(',').map((s) => s.trim()),
      images: formData.images.split(',').map((s) => s.trim()),
    });

    toast({ title: "Produto atualizado!" });
    setEditingId(null);
    resetForm();
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      collection: product.collection,
      price: product.price.toString(),
      description: product.description,
      sizes: product.sizes.join(', '),
      images: product.images.join(', '),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      removeProduct(id);
      toast({ title: "Produto removido!" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-primary" />
                </div>
                <h1 className="font-display text-3xl text-foreground tracking-wider">
                  ÁREA ADMINISTRATIVA
                </h1>
                <p className="text-muted-foreground mt-2">
                  Digite a senha para acessar
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="Senha"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 font-display text-lg tracking-wider hover:bg-primary/90 transition-colors"
                >
                  ENTRAR
                </button>
              </form>
            </div>
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl text-foreground tracking-wider">
            GERENCIAR PRODUTOS
          </h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>

        {/* Add Product Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="mb-8 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-display tracking-wider hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            ADICIONAR PRODUTO
          </button>
        )}

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-card p-6 rounded-lg border border-border mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-foreground tracking-wider">
                NOVO PRODUTO
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Coleção
                </label>
                <input
                  type="text"
                  value={formData.collection}
                  onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                  className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                  required
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Tamanhos (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                  placeholder="P, M, G, GG"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-muted-foreground mb-2">
                  URLs das Imagens (separadas por vírgula)
                </label>
                <textarea
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none h-20 resize-none"
                  placeholder="https://imagem1.jpg, https://imagem2.jpg"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-muted-foreground mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none h-24 resize-none"
                  required
                  maxLength={500}
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 font-display text-lg tracking-wider hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  SALVAR PRODUTO
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card p-4 rounded-lg border border-border"
            >
              {editingId === product.id ? (
                <div className="animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-input border border-border rounded px-4 py-2 text-foreground"
                      placeholder="Nome"
                    />
                    <input
                      type="text"
                      value={formData.collection}
                      onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                      className="bg-input border border-border rounded px-4 py-2 text-foreground"
                      placeholder="Coleção"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-input border border-border rounded px-4 py-2 text-foreground"
                      placeholder="Preço"
                    />
                    <input
                      type="text"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      className="bg-input border border-border rounded px-4 py-2 text-foreground"
                      placeholder="Tamanhos"
                    />
                    <input
                      type="text"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      className="bg-input border border-border rounded px-4 py-2 text-foreground md:col-span-2"
                      placeholder="URLs das Imagens (separadas por vírgula)"
                    />
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-input border border-border rounded px-4 py-2 text-foreground md:col-span-2 h-20 resize-none"
                      placeholder="Descrição"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleUpdateProduct(product.id)}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                    >
                      <Save size={16} />
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        resetForm();
                      }}
                      className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/80 transition-colors"
                    >
                      <X size={16} />
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {product.collection} • R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tamanhos: {product.sizes.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => startEditing(product)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhum produto cadastrado.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
