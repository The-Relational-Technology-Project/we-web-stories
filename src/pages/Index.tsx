
import React from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import StoryGrid from '@/components/StoryGrid';
import SubmitStory from '@/components/SubmitStory';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Hero />
      <StoryGrid />
      <SubmitStory />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
