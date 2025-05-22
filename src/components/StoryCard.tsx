
import React, { useState } from 'react';
import { Story } from '@/data/stories';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface StoryCardProps {
  story: Story;
  onLike: (id: string) => void;
  onHover?: () => void;
  hoverIntensity?: number;
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

// Wear effect classes based on hover intensity
const wearClasses = [
  '', // 0 - no wear
  'shadow-inner', // 1 - light wear
  'shadow-inner bg-amber-50/80', // 2 - noticeable wear
  'shadow-inner bg-amber-50/70', // 3 - medium wear
  'shadow-inner bg-amber-50/60 border-opacity-80', // 4 - heavy wear
  'shadow-inner bg-amber-50/50 border-opacity-70' // 5 - very heavy wear
];

const StoryCard: React.FC<StoryCardProps> = ({ story, onLike, onHover, hoverIntensity = 0 }) => {
  const [remixText, setRemixText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLike = () => {
    onLike(story.id);
    if (!story.hasLiked) {
      toast.success('Story liked!');
    }
  };
  
  const handleRemixSubmit = async () => {
    if (!remixText.trim()) {
      toast.error('Please enter your suggestion');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save the remix suggestion to Supabase
      const { error } = await supabase
        .from('remix_suggestions')
        .insert([
          { 
            story_id: story.id,
            remix_text: remixText
          }
        ]);
        
      if (error) {
        console.error('Error submitting remix:', error);
        toast.error('Failed to submit remix');
        return;
      }
      
      toast.success('Your remix suggestion has been submitted!');
      setRemixText('');
      setDialogOpen(false);
    } catch (err) {
      console.error('Error submitting remix suggestion:', err);
      toast.error('Failed to submit remix');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectSubmit = async () => {
    // Validate form
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit connection request to Supabase
      const { error } = await supabase
        .from('connection_requests')
        .insert([
          { 
            story_id: story.id,
            email,
            message 
          }
        ]);

      if (error) {
        console.error('Error submitting connection request:', error);
        toast.error('Failed to submit connection request');
        setIsSubmitting(false);
        return;
      }

      // Show success dialog
      setConnectDialogOpen(false);
      setSuccessDialogOpen(true);
      
      // Reset form
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting connection request:', err);
      toast.error('Failed to submit connection request');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to format category display text
  const formatCategoryText = (category: string) => {
    if (category === 'ai') return 'AI';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  return (
    <Card 
      className={`card-gradient h-full flex flex-col transition-all duration-300 hover:shadow-lg animate-fade-in ${wearClasses[hoverIntensity]}`}
      onMouseEnter={() => onHover?.()}
    >
      <CardContent className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[story.category]}`}>
            {formatCategoryText(story.category)}
          </span>
          {hoverIntensity > 0 && (
            <div className="text-xs text-gray-400">
              {hoverIntensity > 3 ? 'Popular' : 'Emerging'}
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 text-relational-navy">{story.title}</h3>
        <p className="text-gray-600">{story.description}</p>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex justify-between items-center border-t border-gray-100">
        <div className="flex items-center space-x-1">
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
                <Button 
                  onClick={handleRemixSubmit} 
                  className="bg-relational-purple hover:bg-relational-purple/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Remix'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-relational-coral">
              <User className="h-4 w-4" />
              <span>Connect</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect with the storyteller</DialogTitle>
              <DialogDescription>
                Would you like to connect with the person who submitted this story? 
                Provide your email and a brief message, and we'll reach out to them on your behalf.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <h4 className="font-medium">{story.title}</h4>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Your email</label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea 
                  id="message"
                  placeholder="Tell them why you'd like to connect..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500">
                  This message will be shared with the person who submitted this story.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleConnectSubmit} 
                className="bg-relational-coral hover:bg-relational-coral/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Request Connection'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Connection Request Sent!</AlertDialogTitle>
              <AlertDialogDescription>
                <p className="mb-4">
                  Thank you for your interest in connecting. We'll reach out to the storyteller
                  with your message and let them know you'd like to connect.
                </p>
                <p>
                  If they're interested, we'll share your contact information with them and
                  they may reach out to you directly.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-center">
              <Button 
                onClick={() => setSuccessDialogOpen(false)}
                className="bg-relational-coral hover:bg-relational-coral/90"
              >
                Close
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
