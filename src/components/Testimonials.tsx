
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "Natural Foods Co.",
    content: "The CPG Matchmaker platform has transformed how we source ingredients. We found the perfect organic supplier in just two weeks, when previously it took months.",
    image: "/placeholder.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Operations Director",
    company: "Eco Packaging Solutions",
    content: "As a sustainable packaging manufacturer, finding the right brands to partner with was challenging. This platform's AI matching has increased our conversion rate by 65%.",
    image: "/placeholder.jpg"
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Procurement Specialist",
    company: "Wellness Brands Inc.",
    content: "The detailed filtering options and AI recommendations have streamlined our vendor selection process dramatically. We've reduced our sourcing cycle by 40%.",
    image: "/placeholder.jpg"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-foreground/70">
            Discover how our platform has helped businesses across the CPG industry
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl glass border border-white/10 p-8 md:p-12">
              <Quote className="absolute top-6 left-6 h-12 w-12 text-primary/10" />
              
              <div className="relative z-10">
                {/* Single testimonial view with better transition handling */}
                <div className="flex flex-col">
                  <blockquote className="text-lg md:text-xl mb-6">
                    "{testimonials[activeIndex].content}"
                  </blockquote>
                  
                  <div className="mt-auto flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                      <img 
                        src={testimonials[activeIndex].image} 
                        alt={testimonials[activeIndex].name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonials[activeIndex].name}</h4>
                      <p className="text-sm text-foreground/70">{testimonials[activeIndex].role}, {testimonials[activeIndex].company}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation controls */}
            <div className="flex justify-center mt-6 gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={prevTestimonial}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex gap-1 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      index === activeIndex ? "w-6 bg-primary" : "w-2 bg-muted"
                    )}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={nextTestimonial}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
