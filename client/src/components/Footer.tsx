import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, GitBranch as BrandTiktok, Leaf } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Leaf className="w-6 h-6 text-gold rotate-45" />
              <div className="flex flex-col ml-2">
                <span className="text-2xl font-serif text-gold">Baraka</span>
                <span className="text-sm font-medium tracking-wider text-cream">BITES</span>
              </div>
            </div>
            <p className="mb-4">
              Made with ❤️ for the Ummah
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/humbleservantofallah2023" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cream hover:text-gold transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@humbleservantofallah2023" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cream hover:text-gold transition-colors duration-200"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@humbleservantofallah2023" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cream hover:text-gold transition-colors duration-200"
              >
                <BrandTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gold font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-gold transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/sunnah-foods" className="hover:text-gold transition-colors duration-200">Sunnah Foods</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-gold transition-colors duration-200">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors duration-200">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="hover:text-gold transition-colors duration-200">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gold transition-colors duration-200">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-bold text-lg mb-4">Contact Us</h3>
            <p className="text-cream">hello@barakabites.app</p>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Baraka Bites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;