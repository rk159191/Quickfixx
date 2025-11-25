import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Phone, MapPin, FileText } from "lucide-react";
import type { Booking } from "@shared/schema";

export default function BookingStatus() {
  const [searchPhone, setSearchPhone] = useState("");
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const searchMutation = useMutation({
    mutationFn: async (phone: string) => {
      const response = await fetch(`/api/bookings/search/phone/${encodeURIComponent(phone)}`);
      if (!response.ok) {
        throw new Error("Failed to search bookings");
      }
      return await response.json();
    },
    onSuccess: (data: Booking[]) => {
      setFilteredBookings(data);
      setHasSearched(true);
    },
    onError: () => {
      setFilteredBookings([]);
      setHasSearched(true);
    },
  });

  const handleSearch = () => {
    if (!searchPhone.trim()) {
      setFilteredBookings([]);
      setHasSearched(true);
      return;
    }

    searchMutation.mutate(searchPhone);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-bold mb-4">Check Booking Status</h1>
            <p className="text-muted-foreground">
              Enter your phone number or name to see your booking details and status
            </p>
          </div>

          <Card className="p-6 mb-8">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter your phone number"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                data-testid="input-search-booking"
              />
              <Button onClick={handleSearch} data-testid="button-search-booking" disabled={searchMutation.isPending}>
                <Search className="h-4 w-4 mr-2" />
                {searchMutation.isPending ? "Searching..." : "Search"}
              </Button>
            </div>
          </Card>

          {hasSearched && filteredBookings.length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">
              No bookings found. Please check your phone number or name and try again.
            </Card>
          )}

          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="p-6" data-testid={`card-booking-${booking.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{booking.customerName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Phone className="h-4 w-4" />
                      {booking.customerPhone}
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status || "Pending"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Service Type</p>
                    <p className="font-medium">{booking.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{booking.customerEmail || "Not provided"}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      Date: {booking.preferredDate}
                    </div>
                  </div>
                  <div className="text-sm font-medium">Time: {booking.preferredTime}</div>
                </div>

                <div className="mb-4 p-3 bg-muted rounded-md">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <p className="text-muted-foreground">{booking.customerAddress}</p>
                  </div>
                </div>

                {booking.details && (
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium mb-1">Additional Details</p>
                        <p className="text-sm text-muted-foreground">{booking.details}</p>
                      </div>
                    </div>
                  </div>
                )}

                {booking.latitude && booking.longitude && (
                  <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                    <p className="text-muted-foreground">
                      Location: {booking.latitude}, {booking.longitude}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
