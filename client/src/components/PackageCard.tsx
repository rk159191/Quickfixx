import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PackageCardProps {
  name: string;
  price: string;
  duration: string;
  features: string[];
  popular?: boolean;
}

export default function PackageCard({ name, price, duration, features, popular = false }: PackageCardProps) {
  const handleSelectPackage = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card className={`hover-elevate transition-all duration-300 h-full flex flex-col ${popular ? 'border-primary shadow-lg' : ''}`}>
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold">{name}</h3>
          {popular && <Badge variant="default">Popular</Badge>}
        </div>
        <div>
          <span className="text-3xl font-bold text-primary">{price}</span>
          <span className="text-sm text-muted-foreground ml-2">{duration}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" variant={popular ? "default" : "outline"} onClick={handleSelectPackage} data-testid={`button-select-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          Select Package
        </Button>
      </CardFooter>
    </Card>
  );
}
