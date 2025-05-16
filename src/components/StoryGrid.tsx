
import React, { useState } from 'react';
import { stories as initialStories, Story } from '@/data/stories';
import StoryCard from '@/components/StoryCard';
import { Button } from '@/components/ui/button';

type CategoryType = Story['category'] | 'all';

const StoryGrid = () => {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  
  const handleLike = (id: string) => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === id 
          ? { 
              ...story, 
              likes: story.hasLiked ? story.likes - 1 : story.likes + 1,
              hasLiked: !story.hasLiked 
            } 
          : story
      )
    );
  };
  
  const filterStories = (category: CategoryType) => {
    setActiveCategory(category);
  };
  
  const filteredStories = activeCategory === 'all' 
    ? stories 
    : stories.filter(story => story.category === activeCategory);
    
  const categories: CategoryType[] = ['all', 'learning', 'community', 'collaboration', 'discovery', 'creativity', 'abundance', 'care', 'ai'];
  
  return (
    <section id="stories" className="py-16 bg-amber-50/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">Stories from the Relational Web</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Explore vignettes from a future where the internet connects us in meaningful, local, and serendipitous ways.
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => filterStories(category)}
              className={
                activeCategory === category 
                  ? "bg-amber-500 hover:bg-amber-600" 
                  : "border-amber-300 text-amber-700 hover:bg-amber-100"
              }
            >
              {category === 'all' ? 'All Stories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map(story => (
            <StoryCard 
              key={story.id} 
              story={story} 
              onLike={handleLike}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoryGrid;
