
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToStories = () => {
    const storiesSection = document.getElementById('stories');
    if (storiesSection) {
      storiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSubmit = () => {
    const submitSection = document.getElementById('submit');
    if (submitSection) {
      submitSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-mesh">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Putting the <span className="text-amber-500">'we'</span> back in the web
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-muted-foreground">
          Imagine a web that connects us not just to information, but to each other—based on shared interests, 
          locations, and moments of serendipity.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-white"
            size="lg"
            onClick={scrollToStories}
          >
            Explore Stories
          </Button>
          <Button 
            variant="outline" 
            className="border-rose-400 text-rose-500 hover:bg-rose-50"
            size="lg"
            onClick={scrollToSubmit}
          >
            Submit Your Vision
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
