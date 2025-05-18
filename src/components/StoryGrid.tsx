
import React, { useState, useEffect } from 'react';
import { Story } from '@/data/stories';
import StoryCard from '@/components/StoryCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type CategoryType = Story['category'] | 'all';

const StoryGrid = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [loading, setLoading] = useState(true);
  const [hoverCounts, setHoverCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*');
          
        if (error) {
          console.error('Error fetching stories:', error);
          toast.error('Failed to load stories');
          return;
        }
        
        // Transform the data to match the Story type
        const formattedStories = data.map(story => ({
          id: story.id,
          title: story.title,
          description: story.description,
          likes: story.likes,
          category: story.category as Story['category'],
          hasLiked: false
        }));
        
        setStories(formattedStories);
        
        // Initialize hover counts for each story
        const initialHoverCounts: Record<string, number> = {};
        formattedStories.forEach(story => {
          // Set initial hover count to 10% of the likes count to start with some "wear"
          initialHoverCounts[story.id] = Math.floor(story.likes * 0.1);
        });
        setHoverCounts(initialHoverCounts);
      } catch (err) {
        console.error('Error fetching stories:', err);
        toast.error('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStories();
  }, []);
  
  const handleLike = async (id: string) => {
    // Find the story and toggle its like status in the UI first (optimistic update)
    const updatedStories = stories.map(story => 
      story.id === id 
        ? { 
            ...story, 
            likes: story.hasLiked ? story.likes - 1 : story.likes + 1,
            hasLiked: !story.hasLiked 
          } 
        : story
    );
    setStories(updatedStories);
    
    // Find the updated story to get the new likes count
    const updatedStory = updatedStories.find(story => story.id === id);
    if (!updatedStory) return;
    
    // Update the likes count in Supabase
    try {
      const { error } = await supabase
        .from('stories')
        .update({ likes: updatedStory.likes })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating likes:', error);
        toast.error('Failed to update likes');
        
        // Revert the optimistic update if the server update failed
        setStories(stories);
      }
    } catch (err) {
      console.error('Error updating likes:', err);
      toast.error('Failed to update likes');
      
      // Revert the optimistic update if the server update failed
      setStories(stories);
    }
  };
  
  const handleCardHover = (id: string) => {
    setHoverCounts(prevCounts => ({
      ...prevCounts,
      [id]: (prevCounts[id] || 0) + 1
    }));
  };
  
  const getHoverIntensity = (id: string) => {
    const count = hoverCounts[id] || 0;
    // Calculate intensity from 0 to 5 based on hover count
    return Math.min(Math.floor(count / 5), 5);
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
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">Stories from the Future</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Explore vignettes from the future relational web where the internet connects us in meaningful, local, and serendipitous ways.
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
        
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Loading stories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.length > 0 ? (
              filteredStories.map(story => (
                <StoryCard 
                  key={story.id} 
                  story={story} 
                  onLike={handleLike}
                  onHover={() => handleCardHover(story.id)}
                  hoverIntensity={getHoverIntensity(story.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500">No stories found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default StoryGrid;
