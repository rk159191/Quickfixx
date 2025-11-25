import { Facebook, Instagram, Phone, Mail, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuery } from "@tanstack/react-query";
import type { ContactInfo } from "@shared/schema";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const { data: contact } = useQuery<ContactInfo>({
    queryKey: ["/api/contact"],
  });

  const phone = contact?.phone || "+880 1537-313652";
  const whatsapp = contact?.whatsapp || "+8801537313652";
  const email = contact?.email || "info@quickfixx.com";
  const facebook = contact?.facebook || "facebook.com/Quickfixx24";
  const instagram = contact?.instagram || "instagram.com/Quickfixx24";
  const linkedin = contact?.linkedin || "";
  const twitter = contact?.twitter || "";
  const youtube = contact?.youtube || "";

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-serif text-xl font-bold">Quickfixx</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Professional technical support services across Bangladesh. Fast, reliable, and affordable.
            </p>
            <div className="flex gap-3 flex-wrap">
              {facebook && (
                <a
                  href={facebook.startsWith("http") ? facebook : `https://${facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md hover-elevate bg-muted"
                  data-testid="link-facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram.startsWith("http") ? instagram : `https://${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md hover-elevate bg-muted"
                  data-testid="link-instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md hover-elevate bg-muted"
                  data-testid="link-linkedin"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter.startsWith("http") ? twitter : `https://${twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md hover-elevate bg-muted"
                  data-testid="link-twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {youtube && (
                <a
                  href={youtube.startsWith("http") ? youtube : `https://${youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md hover-elevate bg-muted"
                  data-testid="link-youtube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#services" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  CCTV Installation
                </a>
              </li>
              <li>
                <a href="#services" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Smart Home Setup
                </a>
              </li>
              <li>
                <a href="#services" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  IT Support
                </a>
              </li>
              <li>
                <a href="#services" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Quick Fix
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#packages" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  About Us
                </a>
              </li>
              <li>
                <a href="#packages" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Service Packages
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Blog & Guides
                </Link>
              </li>
              <li>
                <Link href="/booking-status" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Check Booking Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${phone}`} className="flex items-center gap-2 text-muted-foreground hover-elevate px-2 py-1 rounded-md">
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`} className="flex items-center gap-2 text-muted-foreground hover-elevate px-2 py-1 rounded-md">
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-muted-foreground hover-elevate px-2 py-1 rounded-md">
                  <Mail className="h-4 w-4" />
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Quickfixx. All rights reserved.</p>
          <div className="flex gap-4 items-center">
            <Link href="/privacy" className="hover-elevate px-2 py-1 rounded-md">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover-elevate px-2 py-1 rounded-md">
              Terms of Service
            </Link>
            <div className="border-l border-muted pl-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
