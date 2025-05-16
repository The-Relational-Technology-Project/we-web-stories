
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ContactSection = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thanks for reaching out! We\'ll be in touch soon.');
    // Here we would normally send this to a backend
  };
  
  return (
    <section id="contact" className="py-16 bg-relational-navy text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Community</h2>
            <p className="text-relational-sand/90 mb-6">
              We're building an open-source community to create a more relational web. 
              Connect with others who share this vision and help us make it a reality.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-relational-purple/20 flex items-center justify-center mt-1">
                  <span className="text-relational-purple">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Contribute Stories</h3>
                  <p className="text-relational-sand/80">
                    Share your vision for what a relational web could look like
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-relational-teal/20 flex items-center justify-center mt-1">
                  <span className="text-relational-teal">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Join the Discussion</h3>
                  <p className="text-relational-sand/80">
                    Connect with others who are passionate about reimagining the web
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-relational-coral/20 flex items-center justify-center mt-1">
                  <span className="text-relational-coral">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Build the Future</h3>
                  <p className="text-relational-sand/80">
                    Contribute code, design, or ideas to our open-source projects
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="How would you like to contribute?" 
                    className="min-h-[100px]"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-relational-purple hover:bg-relational-purple/90"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
