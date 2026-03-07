import { Leaf, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Leaf className="h-8 w-8 text-secondary" />
              <span className="text-2xl font-bold tracking-tight">NutriVida</span>
            </Link>
            <p className="text-white/80 max-w-md mb-6">
              Transforming lives through personalized clinical nutrition and functional habits. 
              Your health journey starts with the right guidance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition-colors"><Instagram /></a>
              <a href="#" className="hover:text-secondary transition-colors"><Facebook /></a>
              <a href="#" className="hover:text-secondary transition-colors"><Twitter /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/recipes" className="hover:text-white transition-colors">Recipes</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/appointment" className="hover:text-white transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-4 text-white/70">
              <li>123 Wellness Way</li>
              <li>Health City, HC 54321</li>
              <li>contact@nutrivida.com</li>
              <li>+1 (555) 000-0000</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} NutriVida. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
