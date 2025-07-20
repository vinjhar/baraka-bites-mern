import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, Loader2 } from 'lucide-react';
import { isTokenValid } from '../utils/auth';

type User = {
  role?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
};

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenValid = isTokenValid();
    setIsAuthenticated(tokenValid);

    if (tokenValid) {
      const userJson = localStorage.getItem('user');
      console.log('User JSON:', userJson);
      if (userJson) {
        try {
          const user: User = JSON.parse(userJson);
          console.log('Parsed user:', user);
          console.log('User isAdmin value:', user.isAdmin);
          console.log('Type of isAdmin:', typeof user.isAdmin);
          
          // Fix: Handle both boolean and string values
          setIsAdmin(user.isAdmin === true || user.isAdmin === 'true');
        } catch (error) {
          console.error('Error parsing user JSON:', error);
          setIsAdmin(false);
        }
      }
    } else {
      setIsAdmin(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate('/signin');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navbarClass = isScrolled
    ? 'fixed w-full bg-primary shadow-md transition-all duration-300 z-50'
    : 'fixed w-full bg-primary/80 backdrop-blur-sm transition-all duration-300 z-50';

  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `font-medium transition-colors duration-200 hover:text-gold text-cream ${
      isActive ? 'text-gold' : ''
    }`;
  };

  const mobileNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `block px-4 py-2 text-lg font-medium text-primary hover:bg-primary/10 rounded transition-colors duration-200 ${
      isActive ? 'bg-primary/10 text-gold' : ''
    }`;
  };

  return (
    <nav className={navbarClass}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="w-6 h-6 text-gold rotate-45" />
          <div className="flex flex-col ml-2">
            <span className="text-2xl font-serif text-gold">Baraka</span>
            <span className="text-sm font-medium tracking-wider text-cream">BITES</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={navLinkClass('/')}>Home</Link>
          <Link to="/sunnah-foods" className={navLinkClass('/sunnah-foods')}>Sunnah Foods</Link>
          <Link to="/blog" className={navLinkClass('/blog')}>Blog</Link>
          <Link to="/contact" className={navLinkClass('/contact')}>Contact</Link>
          {isAdmin && <Link to="/admin-panel" className={navLinkClass('/admin-panel')}>Admin Panel</Link>}

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="px-4 py-2 rounded-md bg-gold text-primary font-medium hover:bg-gold/90">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-md border-2 border-gold text-gold font-medium hover:bg-gold/10 flex items-center disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  'Logout'
                )}
              </button>
            </div>
          ) : (
            <Link to="/signin" className="px-4 py-2 rounded-md bg-gold text-primary font-medium hover:bg-gold/90">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-cream" />
          ) : (
            <Menu className="w-6 h-6 text-cream" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream shadow-lg absolute top-16 left-0 right-0 z-20">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link to="/" className={mobileNavLinkClass('/')} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/sunnah-foods" className={mobileNavLinkClass('/sunnah-foods')} onClick={() => setMobileMenuOpen(false)}>Sunnah Foods</Link>
            <Link to="/blog" className={mobileNavLinkClass('/blog')} onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link to="/contact" className={mobileNavLinkClass('/contact')} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            {isAdmin && (
              <Link to="/admin-panel" className={mobileNavLinkClass('/admin-panel')} onClick={() => setMobileMenuOpen(false)}>
                Admin Panel
              </Link>
            )}

            <div className="pt-2 border-t border-primary/20">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-center rounded-md bg-primary text-cream font-medium hover:bg-primary/90"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-2 text-center rounded-md border-2 border-primary text-primary font-medium hover:bg-primary/10 flex justify-center items-center disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      'Logout'
                    )}
                  </button>
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="px-4 py-2 block text-center rounded-md bg-primary text-cream font-medium hover:bg-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;