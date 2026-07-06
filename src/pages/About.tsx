
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8 text-center">Our Story</h1>
      
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-serif mb-4">Traditional Craftsmanship</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Threads & Trinkets, we preserve the time-honored tradition of silk thread jewelry making. 
              Each piece is meticulously handcrafted by our skilled artisans, combining traditional techniques 
              with contemporary designs to create unique pieces that tell a story.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-serif mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are dedicated to creating sustainable, eco-friendly jewelry that doesn't compromise on style. 
              Our silk threads are sourced from ethical suppliers, ensuring both quality and responsibility 
              in every piece we create.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-serif mb-4">Quality & Care</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every piece of jewelry undergoes rigorous quality checks before reaching you. We take pride 
              in our attention to detail and commitment to excellence, ensuring that each item meets our 
              high standards of craftsmanship.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
