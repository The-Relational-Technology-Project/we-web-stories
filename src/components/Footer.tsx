
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 bg-relational-navy text-white border-t border-relational-navy/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <span className="font-display text-xl font-bold text-relational-coral">Relational</span>
              <span className="font-display text-xl font-bold text-white">Web</span>
            </div>
            <p className="text-sm text-relational-sand/70 mt-1">
              Connecting people in meaningful ways.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <a href="#stories" className="text-sm hover:text-relational-coral transition-colors">
              Stories
            </a>
            <a href="#submit" className="text-sm hover:text-relational-coral transition-colors">
              Submit
            </a>
            <a href="#contact" className="text-sm hover:text-relational-coral transition-colors">
              Contact
            </a>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-relational-sand/70">
            &copy; {new Date().getFullYear()} Relational Web Project
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
