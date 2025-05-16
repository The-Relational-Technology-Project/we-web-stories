
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const SubmitStory = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      toast.error('Please fill out all fields');
      return;
    }
    
    // Here we would normally submit to a backend
    toast.success('Your story has been submitted!');
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
  };
  
  return (
    <section id="submit" className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">Submit Your Vision</h2>
        <p className="text-center text-gray-600 mb-10">
          Have an idea for how the relational web could transform human connection? Share your story with us.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Story Title</Label>
              <Input 
                id="title" 
                placeholder="Give your story a catchy title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                  <SelectItem value="discovery">Discovery</SelectItem>
                  <SelectItem value="creativity">Creativity</SelectItem>
                  <SelectItem value="abundance">Abundance</SelectItem>
                  <SelectItem value="care">Care</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe a moment of connection in the relational web..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-relational-teal hover:bg-relational-teal/90"
            >
              Submit Your Story
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SubmitStory;
