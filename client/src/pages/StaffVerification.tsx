import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Calendar, Award, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Staff } from "@shared/schema";

export default function StaffVerification() {
  const [, params] = useRoute("/staff/:id");
  const employeeId = params?.id;

  const { data: staff, isLoading, isError } = useQuery<Staff>({
    queryKey: [`/api/staff/employee/${employeeId}`],
    enabled: !!employeeId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30" data-testid="loading-staff-verification">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !staff) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Staff Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The QR code you scanned does not match any verified staff member.
            </p>
            <Button asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = staff.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover-elevate px-3 py-2 rounded-md mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Homepage
        </Link>

        <Card className="overflow-hidden">
          <div className="bg-primary/10 p-6 text-center border-b">
            <h1 className="font-serif text-2xl font-bold">Quickfixx</h1>
            <p className="text-sm text-muted-foreground">Staff Verification</p>
          </div>

          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-primary/20">
                <AvatarImage src={staff.imageUrl} alt={staff.name} />
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {staff.isActive && (
                <Badge variant="default" className="mb-4">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Verified Employee
                </Badge>
              )}

              <h2 className="text-2xl font-bold mb-1" data-testid="text-staff-name">{staff.name}</h2>
              <p className="text-lg text-muted-foreground mb-1" data-testid="text-staff-role">{staff.role}</p>
              <p className="text-sm text-muted-foreground font-mono" data-testid="text-employee-id">
                Employee ID: {staff.employeeId}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Award className="h-4 w-4 text-primary" />
                  About
                </div>
                <p className="text-sm text-muted-foreground">{staff.bio}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Award className="h-4 w-4 text-primary" />
                  Expertise
                </div>
                <div className="flex flex-wrap gap-2">
                  {staff.expertise.map((spec, index) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Member Since
                </div>
                <p className="text-muted-foreground">
                  {new Date(staff.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm text-center text-muted-foreground">
                  This technician is a verified member of the Quick Fixx team. 
                  If you have any concerns, please contact us at{" "}
                  <a href="tel:+8801537313652" className="text-primary font-semibold">
                    +880 1537-313652
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="outline" asChild>
            <Link href="/">Visit Quick Fixx Website</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
