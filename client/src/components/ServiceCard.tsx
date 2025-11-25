import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  priceRange: string;
  timeEstimate: string;
  featured?: boolean;
  imageUrl?: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  priceRange,
  timeEstimate,
  featured = false,
  imageUrl,
}: ServiceCardProps) {
  const handleBookNow = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (imageUrl) {
    return (
      <div className="relative h-80 rounded-lg overflow-hidden group hover-elevate transition-all duration-300 cursor-pointer" onClick={handleBookNow} data-testid={`card-service-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>
        
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-2">
            {featured && <Badge variant="default">Popular</Badge>}
          </div>
          
          <div className="flex-1"></div>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-100 text-sm line-clamp-2">{description}</p>
            </div>
            <Button 
              size="sm" 
              className="w-full" 
              onClick={handleBookNow} 
              data-testid={`button-book-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              Book Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6 hover-elevate transition-all duration-300 h-full flex flex-col" data-testid={`card-service-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="p-3 rounded-md bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {featured && <Badge variant="default">Popular</Badge>}
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      
      <p className="text-muted-foreground mb-4 flex-1">{description}</p>
      
      <div className="flex items-center gap-4 text-sm mb-4">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{timeEstimate}</span>
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Button variant="ghost" size="sm" className="flex-1" onClick={handleBookNow} data-testid={`button-learn-more-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          Learn More
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        <Button size="sm" className="flex-1" onClick={handleBookNow} data-testid={`button-book-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          Book Now
        </Button>
      </div>
    </div>
  );
}
