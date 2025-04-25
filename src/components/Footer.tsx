
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Banking</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Checking Accounts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Savings Accounts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Credit Cards
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Mortgages
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Business Banking</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Business Accounts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Lending
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Merchant Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Treasury Management
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
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
