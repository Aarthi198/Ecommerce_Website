
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';
import { submitContactMessage } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await submitContactMessage(formData);
      toast({
        title: 'Message sent!',
        description: 'We will get back to you soon.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast({
        title: 'Could not send message',
        description: (err as Error).message || 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8 text-center">Contact Us</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Email Us</h3>
                </div>
                <a href="mailto:hello@threadsandtrinkets.com" className="text-muted-foreground hover:text-primary transition-colors">
                  hello@threadsandtrinkets.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Call Us</h3>
                </div>
                <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Visit Our Studio</h3>
              </div>
              <address className="text-muted-foreground not-italic">
                123 Artisan Street<br />
                Creative District<br />
                Craftsville, CV 12345
              </address>
            </CardContent>
          </Card>

          <div className="text-muted-foreground">
            <p>Business Hours: Monday - Friday, 9:00 AM - 6:00 PM</p>
            <p>Saturday, 10:00 AM - 4:00 PM | Closed on Sundays</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-serif font-bold mb-6">Send us a message</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(event) => handleChange('message', event.target.value)}
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
