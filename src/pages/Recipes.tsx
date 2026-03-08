import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Clock, Flame, ChevronRight, X, Utensils, ListChecks } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type Category = 'All' | 'High Protein' | 'Vegan' | 'Anti-inflammatory' | 'Low Carb';

interface Recipe {
  id: string;
  title: string;
  category: Category;
  time: string;
  calories: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

const categories: Category[] = ['All', 'High Protein', 'Vegan', 'Anti-inflammatory', 'Low Carb'];

export default function Recipes() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipesList, setRecipesList] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipesList(data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipesList.filter(recipe => {
    const matchesCategory = activeCategory === 'All' || recipe.category === activeCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header */}
      <section className="bg-bg-dark py-16 border-b border-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Functional Recipes</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Delicious, science-backed meals designed to support your clinical goals and nourish your body from within.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-primary/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    activeCategory === cat
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-primary/5 border border-gray-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full md:w-64 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredRecipes.map((recipe) => (
                <motion.div
                  layout
                  key={recipe.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs font-bold shadow-sm">
                        {recipe.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                      {recipe.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock className="h-3.5 w-3.5 mr-1 text-primary" />
                          {recipe.time}
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Flame className="h-3.5 w-3.5 mr-1 text-secondary" />
                          {recipe.calories}
                        </div>
                      </div>
                      <button className="text-primary hover:text-secondary transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-bg-dark w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-400 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query.</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="mt-6 text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-500 hover:text-primary transition-colors shadow-sm"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 left-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold shadow-lg">
                    {selectedRecipe.category}
                  </span>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto scrollbar-hide">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedRecipe.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{selectedRecipe.description}</p>
                </div>

                <div className="flex items-center space-x-8 mb-10 pb-8 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Time</span>
                    <div className="flex items-center text-gray-900 font-bold">
                      <Clock size={16} className="mr-2 text-primary" />
                      {selectedRecipe.time}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Calories</span>
                    <div className="flex items-center text-gray-900 font-bold">
                      <Flame size={16} className="mr-2 text-secondary" />
                      {selectedRecipe.calories}
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Utensils size={18} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Ingredients</h3>
                    </div>
                    <ul className="space-y-3">
                      {selectedRecipe.ingredients.map((ingredient, i) => (
                        <li key={i} className="flex items-start space-x-3 text-gray-600 text-sm">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <ListChecks size={18} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Instructions</h3>
                    </div>
                    <ol className="space-y-6">
                      {selectedRecipe.instructions.map((step, i) => (
                        <li key={i} className="flex space-x-4">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-bg-dark text-primary text-xs font-bold shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Newsletter / CTA */}
      <section className="py-20 bg-bg-dark border-t border-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Weekly Healthy Recipes</h2>
          <p className="text-gray-600 mb-8">Join our community and receive functional nutrition tips and new recipes directly in your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
