import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBasket, Info, CheckCircle2, AlertCircle, Apple, Beef, Wheat, Coffee } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type ShopCategory = 'All' | 'Pantry' | 'Proteins' | 'Produce' | 'Snacks';

interface Product {
  id: string;
  name: string;
  category: ShopCategory;
  why: string;
  lookFor: string;
  image: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Extra Virgin Olive Oil',
    category: 'Pantry',
    why: 'High in monounsaturated fats and antioxidants. Essential for heart health and reducing inflammation.',
    lookFor: 'Cold-pressed, dark glass bottle, and a recent harvest date.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    name: 'Greek Yogurt (Plain)',
    category: 'Proteins',
    why: 'Excellent source of probiotics for gut health and high-quality protein for muscle maintenance.',
    lookFor: 'Zero added sugars, live active cultures, and preferably organic.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    name: 'Wild-Caught Salmon',
    category: 'Proteins',
    why: 'Rich in Omega-3 fatty acids which are crucial for brain function and cardiovascular health.',
    lookFor: 'Wild-caught label (avoid "Atlantic" or farmed), deep pink/red color.',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    name: 'Organic Spinach',
    category: 'Produce',
    why: 'Packed with iron, vitamins A, C, and K. High fiber content supports digestion.',
    lookFor: 'Bright green leaves, no wilting, preferably organic to avoid pesticides.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '5',
    name: 'Raw Almonds',
    category: 'Snacks',
    why: 'Great source of Vitamin E, magnesium, and healthy fats. Helps manage blood sugar levels.',
    lookFor: 'Raw, unsalted, and unroasted to preserve natural nutrients.',
    image: 'https://images.unsplash.com/photo-1508029091899-599903ad9c1f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '6',
    name: 'Apple Cider Vinegar',
    category: 'Pantry',
    why: 'Can help improve insulin sensitivity and aid in digestion when taken before meals.',
    lookFor: 'Unfiltered, unpasteurized, and containing "The Mother".',
    image: 'https://images.unsplash.com/photo-1622467827417-bbe2237067a9?auto=format&fit=crop&q=80&w=600'
  }
];

const categories: { name: ShopCategory; icon: any }[] = [
  { name: 'All', icon: ShoppingBasket },
  { name: 'Produce', icon: Apple },
  { name: 'Proteins', icon: Beef },
  { name: 'Pantry', icon: Wheat },
  { name: 'Snacks', icon: Coffee }
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Nutritionist's Shopping Guide</h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl">
              Stop guessing at the supermarket. Here are the clinical-grade products I recommend for your pantry and fridge.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Expert Tips Banner */}
      <section className="py-8 bg-bg-dark border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: CheckCircle2, title: 'Read Labels', desc: 'Always check the ingredient list first, not the marketing claims.' },
              { icon: AlertCircle, title: 'Avoid Additives', desc: 'Look out for hidden sugars, artificial colors, and preservatives.' },
              { icon: ShoppingBasket, title: 'Shop Perimeter', desc: 'Most whole, fresh foods are located on the outer aisles of the store.' }
            ].map((tip, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl bg-white/50 border border-primary/5">
                <tip.icon className="text-primary shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{tip.title}</h3>
                  <p className="text-gray-600 text-xs mt-1 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-primary/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={cn(
                    "flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                    activeCategory === cat.name
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-bg-light text-gray-600 hover:bg-primary/5 border border-transparent"
                  )}
                >
                  <cat.icon size={16} />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Find a product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-bg-light border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary w-full md:w-80 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-primary text-xs font-bold shadow-sm uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 bg-secondary/20 p-1.5 rounded-lg">
                          <Info size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Why it's recommended</p>
                          <p className="text-gray-600 text-sm leading-relaxed">{product.why}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="mt-1 bg-accent/20 p-1.5 rounded-lg">
                          <Search size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">What to look for</p>
                          <p className="text-gray-600 text-sm leading-relaxed italic">{product.lookFor}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-32">
              <ShoppingBasket className="mx-auto h-16 w-16 text-gray-200 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try a different search term or category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-400 mb-4">
            <AlertCircle size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Professional Disclaimer</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            This guide is for informational purposes only. Recommendations are based on general clinical nutrition principles. 
            Always consult with your nutritionist during your personalized session to determine which products are best for your specific metabolic profile and health goals.
          </p>
        </div>
      </section>
    </div>
  );
}
