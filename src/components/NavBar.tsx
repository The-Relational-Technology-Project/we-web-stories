
import React from 'react';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="py-4 px-6 md:px-10 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-display text-xl font-bold text-relational-coral">Relational</span>
          <span className="font-display text-xl font-bold text-relational-navy">Web</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#stories" className="text-sm font-medium hover:text-relational-coral transition-colors">
            Stories
          </a>
          <a href="#submit" className="text-sm font-medium hover:text-relational-coral transition-colors">
            Submit
          </a>
          <a href="#contact" className="text-sm font-medium hover:text-relational-coral transition-colors">
            Contact
          </a>
        </div>
        
        <Button 
          className="bg-relational-coral hover:bg-relational-coral/90 text-white"
          size="sm"
          onClick={scrollToContact}
        >
          Join the Community
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
