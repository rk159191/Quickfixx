import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface BeforeAfterItem {
  beforeImage: string;
  afterImage: string;
  title: string;
  category: string;
}

interface BeforeAfterGalleryProps {
  items: BeforeAfterItem[];
}

export default function BeforeAfterGallery({ items }: BeforeAfterGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];
  const filteredItems = selectedCategory === "All" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Our Work Speaks</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See the transformation we bring to homes and businesses across Bangladesh
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer hover-elevate px-4 py-2"
              onClick={() => setSelectedCategory(category)}
              data-testid={`filter-${category.toLowerCase()}`}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`gallery-item-${index}`}>
              <div className="relative">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img 
                      src={item.beforeImage} 
                      alt={`${item.title} - Before`}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-destructive/90 text-destructive-foreground text-xs font-semibold px-2 py-1 rounded">
                      Before
                    </span>
                  </div>
                  <div className="relative">
                    <img 
                      src={item.afterImage} 
                      alt={`${item.title} - After`}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                      After
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
