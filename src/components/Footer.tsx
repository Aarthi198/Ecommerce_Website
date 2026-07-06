
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary/30 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-serif font-bold mb-4">Silk Thread Treasures</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Handcrafted silk thread jewelry that adds elegance to every occasion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products/bangles" className="text-sm hover:text-primary transition-colors">
                  Bangles
                </Link>
              </li>
              <li>
                <Link to="/products/earrings" className="text-sm hover:text-primary transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-sm hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm hover:text-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Mail size={16} className="mr-2 text-muted-foreground" />
                <a href="mailto:hello@silkthreadtreasures.com" className="hover:text-primary transition-colors">
                  hello@silkthreadtreasures.com
                </a>
              </li>
              <li className="flex items-center text-sm">
                <Phone size={16} className="mr-2 text-muted-foreground" />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Silk Thread Treasures. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
