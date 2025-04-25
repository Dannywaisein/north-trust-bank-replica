
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              North Trust Bank
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/personal" className="text-white hover:text-accent transition-colors">
              Personal
            </Link>
            <Link to="/business" className="text-white hover:text-accent transition-colors">
              Business
            </Link>
            <Link to="/wealth" className="text-white hover:text-accent transition-colors">
              Wealth
            </Link>
            <Link to="/about" className="text-white hover:text-accent transition-colors">
              About Us
            </Link>
            <Button className="bg-accent hover:bg-accent-hover text-primary font-semibold">
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link
              to="/personal"
              className="block text-white hover:text-accent transition-colors"
            >
              Personal
            </Link>
            <Link
              to="/business"
              className="block text-white hover:text-accent transition-colors"
            >
              Business
            </Link>
            <Link
              to="/wealth"
              className="block text-white hover:text-accent transition-colors"
            >
              Wealth
            </Link>
            <Link
              to="/about"
              className="block text-white hover:text-accent transition-colors"
            >
              About Us
            </Link>
            <Button className="w-full bg-accent hover:bg-accent-hover text-primary font-semibold">
              Login
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
