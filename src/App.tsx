import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Shop from './pages/Shop';
import Appointment from './pages/Appointment';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-bg-light font-sans selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
