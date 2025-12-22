import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Sun } from 'lucide-react';

const App: React.FC = () => {
  return (
    <Router>
      <div className="relative">
        {/* Navigation */}
        <nav className="absolute top-0 inset-x-0 z-50 py-6 px-6">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
              <div className="bg-primary p-1.5 rounded-lg">
                <Sun className="w-6 h-6 text-black" />
              </div>
              <span>SOLAR<span className="text-primary">GEN</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-muted">
              <a href="#" className="hover:text-white transition-colors">Residential</a>
              <a href="#" className="hover:text-white transition-colors">Commercial</a>
              <a href="#" className="hover:text-white transition-colors">Partners</a>
              <a href="tel:+6123456789" className="btn btn-secondary py-2 px-5">Contact Sales</a>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bill/:slug" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
