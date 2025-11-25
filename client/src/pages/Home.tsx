import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import StaffCard from "@/components/StaffCard";
import TestimonialCard from "@/components/TestimonialCard";
import PackageCard from "@/components/PackageCard";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import { Camera, Home as HomeIcon, Laptop, Wrench, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { Service, Package, Gallery, Staff, Testimonial } from "@shared/schema";

const iconMap: Record<string, any> = {
  "Camera": Camera,
  "Home": HomeIcon,
  "Laptop": Laptop,
  "Wrench": Wrench,
};

export default function Home() {
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services?active=true"],
  });

  const { data: packages, isLoading: packagesLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages?active=true"],
  });

  const { data: galleryItems, isLoading: galleryLoading } = useQuery<Gallery[]>({
    queryKey: ["/api/gallery?active=true"],
  });

  const { data: staffMembers, isLoading: staffLoading } = useQuery<Staff[]>({
    queryKey: ["/api/staff?active=true"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials?active=true"],
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Hero />
        
        <section id="services" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Professional technical solutions for your home and business needs
              </p>
            </div>
            
            {servicesLoading ? (
              <div className="flex justify-center items-center py-12" data-testid="loading-services">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services?.map((service) => {
                  const IconComponent = iconMap[service.category] || Wrench;
                  return (
                    <ServiceCard
                      key={service.id}
                      icon={IconComponent}
                      title={service.title}
                      description={service.description}
                      priceRange={`৳${service.price.toLocaleString()}`}
                      timeEstimate="Contact for details"
                      featured={service.category === "Camera"}
                      imageUrl={service.imageUrl}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section id="packages" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Service Packages</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose a package that fits your needs and budget
              </p>
            </div>
            
            {packagesLoading ? (
              <div className="flex justify-center items-center py-12" data-testid="loading-packages">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages?.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    name={pkg.name}
                    price={`৳${pkg.discountedPrice.toLocaleString()}`}
                    duration={pkg.description}
                    features={pkg.features}
                    popular={pkg.isPopular}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {galleryLoading ? (
          <section id="ourwork" className="py-16 bg-muted/30">
            <div className="flex justify-center items-center py-12" data-testid="loading-gallery">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </section>
        ) : galleryItems && galleryItems.length > 0 ? (
          <section id="ourwork" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Our Work Speaks</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  See our professional projects and satisfied customers across Bangladesh
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {galleryItems.map((item) => (
                  <div key={item.id} className="rounded-lg overflow-hidden bg-card border">
                    {item.videoUrl ? (
                      <div className="relative bg-black aspect-video">
                        {item.videoUrl.includes("youtube.com") || item.videoUrl.includes("youtu.be") ? (
                          <iframe
                            width="100%"
                            height="100%"
                            src={item.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                            title={item.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video width="100%" height="100%" controls className="w-full h-full">
                            <source src={item.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1">
                        {item.beforeImageUrl && (
                          <img src={item.beforeImageUrl} alt="Before" className="w-full h-48 object-cover" />
                        )}
                        {item.afterImageUrl && (
                          <img src={item.afterImageUrl} alt="After" className="w-full h-48 object-cover" />
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Trusted by hundreds of satisfied customers across Bangladesh
              </p>
            </div>
            
            {testimonialsLoading ? (
              <div className="flex justify-center items-center py-12" data-testid="loading-testimonials">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials?.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    name={testimonial.customerName}
                    service={testimonial.serviceType}
                    rating={testimonial.rating}
                    comment={testimonial.comment}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Certified professionals ready to serve you
              </p>
            </div>
            
            {staffLoading ? (
              <div className="flex justify-center items-center py-12" data-testid="loading-staff">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {staffMembers?.map((member) => (
                  <StaffCard
                    key={member.id}
                    name={member.name}
                    role={member.role}
                    photo={member.imageUrl}
                    specializations={member.expertise}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="booking" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Book Your Service</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get started with professional technical support today
              </p>
            </div>
            
            <div className="flex justify-center">
              <BookingForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
