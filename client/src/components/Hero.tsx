import { Button } from "@/components/ui/button";
import { Shield, Clock, Award, Search } from "lucide-react";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center bg-gradient-to-r from-black to-slate-800">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Fast, Reliable Technical Support{" "}
            <span className="text-primary">Across Bangladesh</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-200">
            Expert CCTV installation, smart home setup, IT support, and quick fix services. 
            Professional technicians ready to serve your home or business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="text-base" asChild data-testid="button-book-now">
              <a href="#booking">Book Service Now</a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base bg-background/10 backdrop-blur-sm border-white/30 hover:bg-background/20" 
              asChild
              data-testid="button-check-status-hero"
            >
              <Link href="/booking-status">
                <Search className="h-5 w-5 mr-2" />
                Check Status
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base bg-background/10 backdrop-blur-sm border-white/30 hover:bg-background/20" 
              asChild
              data-testid="button-view-services"
            >
              <a href="#services">View All Services</a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium">Trusted</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">Fast Service</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-medium">Affordable</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
