import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Download, Share2, RotateCcw } from "lucide-react";
import type { InsertBooking, Booking } from "@shared/schema";

export default function BookingForm() {
  const { toast } = useToast();
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    latitude: "",
    longitude: "",
    serviceType: "",
    problem: "",
    preferredTime: "",
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          });
          toast({
            title: "Location captured",
            description: `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Please enable location access or manually enter GPS coordinates",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Please manually enter GPS coordinates",
        variant: "destructive",
      });
    }
  };

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      return await response.json();
    },
    onSuccess: (booking: Booking) => {
      setConfirmedBooking(booking);
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dateTime = new Date(formData.preferredTime);
    const bookingData: InsertBooking = {
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email || undefined,
      customerAddress: formData.address,
      latitude: formData.latitude || undefined,
      longitude: formData.longitude || undefined,
      serviceType: formData.serviceType,
      preferredDate: dateTime.toISOString().split('T')[0],
      preferredTime: dateTime.toTimeString().split(' ')[0],
      details: formData.problem,
    };

    bookingMutation.mutate(bookingData);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && confirmedBooking) {
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Quickfixx Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .success { color: green; font-size: 24px; }
            .booking-id { 
              background: #f0f0f0; 
              padding: 20px; 
              border: 2px solid green; 
              text-align: center; 
              margin: 20px 0;
              font-size: 18px;
              font-weight: bold;
            }
            .details { margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #666; }
            .value { font-size: 16px; }
            .footer { margin-top: 30px; font-style: italic; color: #999; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="success">✓ Booking Confirmed!</div>
            <h2>Quickfixx Service Booking</h2>
          </div>
          
          <div class="booking-id">
            Booking ID: ${confirmedBooking.id}
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="label">Name:</span> 
              <span class="value">${confirmedBooking.customerName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span> 
              <span class="value">${confirmedBooking.customerPhone}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span> 
              <span class="value">${confirmedBooking.customerEmail || 'Not provided'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Address:</span> 
              <span class="value">${confirmedBooking.customerAddress}</span>
            </div>
            <div class="detail-row">
              <span class="label">Service:</span> 
              <span class="value">${confirmedBooking.serviceType}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span> 
              <span class="value">${confirmedBooking.preferredDate}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time:</span> 
              <span class="value">${confirmedBooking.preferredTime}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status:</span> 
              <span class="value">${confirmedBooking.status}</span>
            </div>
          </div>
          
          <div class="footer">
            We will contact you shortly to confirm your appointment.
          </div>
        </body>
        </html>
      `;
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShare = async () => {
    if (!confirmedBooking) return;
    
    const text = `Quickfixx Booking Confirmation
Booking ID: ${confirmedBooking.id}
Name: ${confirmedBooking.customerName}
Phone: ${confirmedBooking.customerPhone}
Service: ${confirmedBooking.serviceType}
Date: ${confirmedBooking.preferredDate}
Time: ${confirmedBooking.preferredTime}
Status: ${confirmedBooking.status}`;

    if (navigator.share) {
      await navigator.share({
        title: "Quickfixx Booking Confirmation",
        text: text,
      });
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Booking details copied. You can paste it anywhere.",
      });
    }
  };

  const handleNewBooking = () => {
    setConfirmedBooking(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      latitude: "",
      longitude: "",
      serviceType: "",
      problem: "",
      preferredTime: "",
    });
  };

  // Confirmation Screen
  if (confirmedBooking) {
    return (
      <Card className="max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold mb-2">Booking Confirmed!</h3>
          <p className="text-muted-foreground">Your service booking has been successfully submitted</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Booking ID Section */}
          <div className="p-6 bg-muted rounded-lg border-2 border-green-600/30">
            <p className="text-sm text-muted-foreground mb-2 font-semibold">YOUR BOOKING ID</p>
            <p className="text-3xl font-bold font-mono break-all" data-testid="text-booking-id">{confirmedBooking.id}</p>
            <p className="text-xs text-muted-foreground mt-2">Save this ID to track your booking status</p>
          </div>

          {/* Booking Details */}
          <div className="space-y-4 print:space-y-3">
            <div className="grid grid-cols-2 gap-4 print:gap-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Name</p>
                <p className="text-base font-medium" data-testid="text-confirm-name">{confirmedBooking.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Phone</p>
                <p className="text-base font-medium">{confirmedBooking.customerPhone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Service</p>
                <p className="text-base font-medium" data-testid="text-confirm-service">{confirmedBooking.serviceType}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Status</p>
                <p className="text-base font-medium text-yellow-600">{confirmedBooking.status}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 print:gap-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Date</p>
                <p className="text-base font-medium">{confirmedBooking.preferredDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Time</p>
                <p className="text-base font-medium">{confirmedBooking.preferredTime}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Address</p>
              <p className="text-sm">{confirmedBooking.customerAddress}</p>
            </div>

            {confirmedBooking.customerEmail && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Email</p>
                <p className="text-sm">{confirmedBooking.customerEmail}</p>
              </div>
            )}

            {confirmedBooking.details && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Details</p>
                <p className="text-sm">{confirmedBooking.details}</p>
              </div>
            )}

            {confirmedBooking.latitude && confirmedBooking.longitude && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">GPS Location</p>
                <p className="text-sm font-mono">{confirmedBooking.latitude}, {confirmedBooking.longitude}</p>
              </div>
            )}
          </div>

          {/* Info Message */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              We have received your booking request. Our team will contact you shortly at <strong>{confirmedBooking.customerPhone}</strong> to confirm your appointment.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3 sm:flex-row">
          <Button 
            variant="outline"
            className="w-full sm:flex-1 print:hidden"
            onClick={handlePrint}
            data-testid="button-print-booking"
          >
            <Download className="h-4 w-4 mr-2" />
            Print / Save as PDF
          </Button>
          <Button 
            variant="outline"
            className="w-full sm:flex-1 print:hidden"
            onClick={handleShare}
            data-testid="button-share-booking"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            className="w-full sm:flex-1 print:hidden"
            onClick={handleNewBooking}
            data-testid="button-new-booking"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Make Another Booking
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Booking Form
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <h3 className="text-2xl font-semibold">Book a Service</h3>
        <p className="text-muted-foreground">Fill out the form and we'll get back to you shortly</p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1xxx-xxxxxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              data-testid="input-phone"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              data-testid="input-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Your location"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              data-testid="input-address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>GPS Location</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGetLocation}
              data-testid="button-get-location"
            >
              📍 Get My GPS Location
            </Button>
            {formData.latitude && formData.longitude && (
              <p className="text-sm text-muted-foreground">
                ✓ GPS captured: {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude (Optional)</Label>
              <Input
                id="latitude"
                placeholder="e.g., 23.8103"
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                data-testid="input-latitude"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude (Optional)</Label>
              <Input
                id="longitude"
                placeholder="e.g., 90.4125"
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                data-testid="input-longitude"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service Type</Label>
            <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
              <SelectTrigger id="service" data-testid="select-service">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cctv">CCTV Installation</SelectItem>
                <SelectItem value="smart-home">Smart Home Setup</SelectItem>
                <SelectItem value="it-support">IT Support</SelectItem>
                <SelectItem value="quick-fix">Quick Fix</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">Problem Description</Label>
            <Textarea
              id="problem"
              placeholder="Describe your requirements..."
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              data-testid="textarea-problem"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Preferred Time</Label>
            <Input
              id="time"
              type="datetime-local"
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              data-testid="input-time"
              required
            />
          </div>
        </CardContent>

        <CardFooter className="gap-3 flex-col sm:flex-row">
          <Button 
            type="submit" 
            className="w-full sm:flex-1" 
            data-testid="button-submit-booking"
            disabled={bookingMutation.isPending}
          >
            {bookingMutation.isPending ? "Submitting..." : "Submit Booking"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full sm:flex-1" 
            asChild
            data-testid="button-whatsapp-booking"
          >
            <a href="https://wa.me/8801537313652" target="_blank" rel="noopener noreferrer">
              Book via WhatsApp
            </a>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
