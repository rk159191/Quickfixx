import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold">Quickfixx</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">
              Home
            </Link>
            <a href="#services" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">
              Services
            </a>
            <a href="#packages" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">
              Packages
            </a>
            <a href="#ourwork" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">
              About
            </a>
            <a href="#booking" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild data-testid="button-whatsapp">
              <a href="https://wa.me/8801537313652" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
            <Button size="sm" asChild data-testid="button-call">
              <a href="tel:+8801537313652">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href="/"
              className="text-sm font-medium hover-elevate px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="#services"
              className="text-sm font-medium hover-elevate px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#packages"
              className="text-sm font-medium hover-elevate px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Packages
            </a>
            <a
              href="#ourwork"
              className="text-sm font-medium hover-elevate px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#booking"
              className="text-sm font-medium hover-elevate px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <div className="flex flex-col gap-2 mt-4">
              <Button variant="outline" asChild data-testid="button-whatsapp-mobile">
                <a href="https://wa.me/8801537313652" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
              <Button asChild data-testid="button-call-mobile">
                <a href="tel:+8801537313652">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
