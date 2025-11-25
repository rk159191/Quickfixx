import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Home,
  Package,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  LogOut,
  Wrench,
  Phone,
  Palette,
} from "lucide-react";
import ServicesManagement from "./admin/ServicesManagement";
import PackagesManagement from "./admin/PackagesManagement";
import StaffManagement from "./admin/StaffManagement";
import GalleryManagement from "./admin/GalleryManagement";
import TestimonialsManagement from "./admin/TestimonialsManagement";
import BookingsManagement from "./admin/BookingsManagement";
import ContactManagement from "./admin/ContactManagement";
import StaffAccountsManagement from "./admin/StaffAccountsManagement";
import ChangePassword from "./admin/ChangePassword";
import BrandingManagement from "./admin/BrandingManagement";
import { Lock } from "lucide-react";

const menuItems = [
  { id: "dashboard", title: "Dashboard", icon: Home },
  { id: "branding", title: "Branding", icon: Palette },
  { id: "services", title: "Services", icon: Wrench },
  { id: "packages", title: "Packages", icon: Package },
  { id: "staff", title: "Staff", icon: Users },
  { id: "gallery", title: "Gallery", icon: ImageIcon },
  { id: "testimonials", title: "Testimonials", icon: MessageSquare },
  { id: "bookings", title: "Bookings", icon: Calendar },
  { id: "contact", title: "Contact", icon: Phone },
  { id: "staff-accounts", title: "Staff Accounts", icon: Users },
  { id: "change-password", title: "Change Password", icon: Lock },
];

function AppSidebar({ activeView, setActiveView }: { activeView: string; setActiveView: (view: string) => void }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
      });
      setLocation("/admin/login");
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold text-primary">Quickfixx Admin</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.id)}
                    isActive={activeView === item.id}
                    data-testid={`nav-${item.id}`}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          data-testid="button-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

function DashboardHome() {
  const { data: services } = useQuery<any[]>({ queryKey: ["/api/services"] });
  const { data: packages } = useQuery<any[]>({ queryKey: ["/api/packages"] });
  const { data: staff } = useQuery<any[]>({ queryKey: ["/api/staff"] });
  const { data: bookings } = useQuery<any[]>({ queryKey: ["/api/bookings"] });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-card-border rounded-md p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Services</h3>
          <p className="text-3xl font-bold mt-2" data-testid="text-services-count">{services?.length || 0}</p>
        </div>
        <div className="bg-card border border-card-border rounded-md p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Packages</h3>
          <p className="text-3xl font-bold mt-2" data-testid="text-packages-count">{packages?.length || 0}</p>
        </div>
        <div className="bg-card border border-card-border rounded-md p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Staff Members</h3>
          <p className="text-3xl font-bold mt-2" data-testid="text-staff-count">{staff?.length || 0}</p>
        </div>
        <div className="bg-card border border-card-border rounded-md p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Bookings</h3>
          <p className="text-3xl font-bold mt-2" data-testid="text-bookings-count">{bookings?.length || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeView, setActiveView] = useState("dashboard");

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      setLocation("/admin/login");
    }
  }, [user, isLoading, error, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-lg font-semibold">Quickfixx Admin Dashboard</h1>
            <div className="w-10"></div>
          </header>
          <main className="flex-1 overflow-auto bg-background">
            {activeView === "dashboard" && <DashboardHome />}
            {activeView === "services" && <ServicesManagement />}
            {activeView === "packages" && <PackagesManagement />}
            {activeView === "staff" && <StaffManagement />}
            {activeView === "gallery" && <GalleryManagement />}
            {activeView === "testimonials" && <TestimonialsManagement />}
            {activeView === "bookings" && <BookingsManagement />}
            {activeView === "contact" && <ContactManagement />}
            {activeView === "staff-accounts" && <StaffAccountsManagement />}
            {activeView === "change-password" && <ChangePassword />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
