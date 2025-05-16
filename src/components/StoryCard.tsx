
import React, { useState } from 'react';
import { Story } from '@/data/stories';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface StoryCardProps {
  story: Story;
  onLike: (id: string) => void;
}

const categoryColors = {
  learning: 'bg-blue-100 text-blue-800',
  community: 'bg-green-100 text-green-800',
  collaboration: 'bg-purple-100 text-purple-800',
  discovery: 'bg-amber-100 text-amber-800',
  creativity: 'bg-rose-100 text-rose-800',
  abundance: 'bg-emerald-100 text-emerald-800',
  care: 'bg-sky-100 text-sky-800',
  ai: 'bg-violet-100 text-violet-800'
};

const StoryCard: React.FC<StoryCardProps> = ({ story, onLike }) => {
  const [remixText, setRemixText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleLike = () => {
    onLike(story.id);
    if (!story.hasLiked) {
      toast.success('Story liked!');
    }
  };
  
  const handleRemixSubmit = () => {
    if (remixText.trim()) {
      toast.success('Your remix suggestion has been submitted!');
      setRemixText('');
      setDialogOpen(false);
    } else {
      toast.error('Please enter your suggestion');
    }
  };
  
  return (
    <Card className="card-gradient h-full flex flex-col transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardContent className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[story.category]}`}>
            {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-relational-navy">{story.title}</h3>
        <p className="text-gray-600">{story.description}</p>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex justify-between items-center border-t border-gray-100">
        <Button 
          variant="ghost" 
          size="sm"
          className={`gap-1 ${story.hasLiked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${story.hasLiked ? 'fill-current' : ''}`} />
          <span>{story.likes}</span>
        </Button>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-relational-teal">
              <MessageSquare className="h-4 w-4" />
              <span>Remix</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remix this story</DialogTitle>
              <DialogDescription>
                Suggest an improvement or variation to this vision of the relational web.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <h4 className="font-medium mb-2">{story.title}</h4>
              <p className="text-sm text-gray-500 mb-4">{story.description}</p>
              <Textarea 
                placeholder="Your remix idea..." 
                value={remixText}
                onChange={(e) => setRemixText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <DialogFooter>
              <Button onClick={handleRemixSubmit} className="bg-relational-purple hover:bg-relational-purple/90">
                Submit Remix
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
