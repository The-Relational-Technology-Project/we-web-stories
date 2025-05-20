
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ReCaptcha from './ReCaptcha';

const SubmitStory = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  
  const verifyRecaptcha = async (token: string): Promise<boolean> => {
    try {
      setVerifying(true);
      
      const { data, error } = await supabase.functions.invoke('verify-recaptcha', {
        body: { token },
      });
      
      if (error || !data?.success) {
        console.error('reCAPTCHA verification failed:', error || data);
        setRecaptchaError(true);
        toast.error('Human verification failed');
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error verifying reCAPTCHA:', err);
      toast.error('Verification service unavailable');
      return false;
    } finally {
      setVerifying(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    if (!recaptchaToken) {
      setRecaptchaError(true);
      toast.error('Please wait for verification');
      return;
    }
    
    // First verify the reCAPTCHA token
    const isVerified = await verifyRecaptcha(recaptchaToken);
    if (!isVerified) return;
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('story_submissions')
        .insert([
          { 
            title, 
            description, 
            category, 
            email: email || null, 
            name: name || null 
          }
        ]);
        
      if (error) {
        console.error('Error submitting story:', error);
        toast.error('Failed to submit your story');
        return;
      }
      
      toast.success('Your story has been submitted!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setEmail('');
      setName('');
      setRecaptchaToken(null);
      
    } catch (err) {
      console.error('Error submitting story:', err);
      toast.error('Failed to submit your story');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    if (token) {
      setRecaptchaError(false);
    }
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
              <Label htmlFor="title">Story Title*</Label>
              <Input 
                id="title" 
                placeholder="Give your story a catchy title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category*</Label>
              <Select value={category} onValueChange={setCategory} required>
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
              <Label htmlFor="description">Description*</Label>
              <Textarea 
                id="description" 
                placeholder="Describe a moment of connection in the relational web..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name (Optional)</Label>
                <Input 
                  id="name" 
                  placeholder="Your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Your Email (Optional)</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <ReCaptcha 
              onChange={handleRecaptchaChange}
              error={recaptchaError}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-relational-teal hover:bg-relational-teal/90"
              disabled={submitting || verifying}
            >
              {verifying ? 'Verifying...' : submitting ? 'Submitting...' : 'Submit Your Story'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SubmitStory;
