
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Banking</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/personal" className="hover:text-accent transition-colors">
                  Checking Accounts
                </Link>
              </li>
              <li>
                <Link to="/personal" className="hover:text-accent transition-colors">
                  Savings Accounts
                </Link>
              </li>
              <li>
                <Link to="/personal" className="hover:text-accent transition-colors">
                  Credit Cards
                </Link>
              </li>
              <li>
                <Link to="/personal" className="hover:text-accent transition-colors">
                  Mortgages
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Business Banking</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/business" className="hover:text-accent transition-colors">
                  Business Accounts
                </Link>
              </li>
              <li>
                <Link to="/business" className="hover:text-accent transition-colors">
                  Lending
                </Link>
              </li>
              <li>
                <Link to="/business" className="hover:text-accent transition-colors">
                  Merchant Services
                </Link>
              </li>
              <li>
                <Link to="/business" className="hover:text-accent transition-colors">
                  Treasury Management
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link to="#" className="hover:text-accent transition-colors">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link to="#" className="hover:text-accent transition-colors">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link to="#" className="hover:text-accent transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link to="#" className="hover:text-accent transition-colors">
                <Linkedin className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-navy-light text-center">
          <p>&copy; 2025 North Trust Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

