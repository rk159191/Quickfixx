import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface StaffCardProps {
  name: string;
  role: string;
  photo: string;
  specializations: string[];
}

export default function StaffCard({ name, role, photo, specializations }: StaffCardProps) {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="hover-elevate transition-all duration-300">
      <CardContent className="p-6 text-center">
        <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-primary/20">
          <AvatarImage src={photo} alt={name} />
          <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{role}</p>
        
        <div className="flex flex-wrap gap-1 justify-center">
          {specializations.map((spec, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
