import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TestimonialCardProps {
  name: string;
  service: string;
  rating: number;
  comment: string;
}

export default function TestimonialCard({ name, service, rating, comment }: TestimonialCardProps) {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="h-full hover-elevate transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold">{name}</h4>
            <Badge variant="secondary" className="text-xs mt-1">{service}</Badge>
          </div>
        </div>
        
        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "fill-primary text-primary" : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">{comment}</p>
      </CardContent>
    </Card>
  );
}
