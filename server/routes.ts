import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import {
  insertServiceSchema,
  insertPackageSchema,
  insertStaffSchema,
  insertGallerySchema,
  insertTestimonialSchema,
  insertBookingSchema,
  insertAdminUserSchema,
  insertContactInfoSchema,
  insertStaffUserSchema,
  changePasswordSchema,
  insertBrandingSchema,
} from "@shared/schema";

// Authentication middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json({ user: req.user });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertAdminUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await storage.createAdminUser({
        ...data,
        password: hashedPassword,
      });
      res.status(201).json({ message: "Admin user created successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/auth/change-password", isAuthenticated, async (req, res) => {
    try {
      const data = changePasswordSchema.parse(req.body);
      const admin = await storage.getAdminUser((req.user as any).id);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      const validPassword = await bcrypt.compare(data.currentPassword, admin.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      const updated = await storage.updateAdminPassword((req.user as any).id, hashedPassword);
      res.json({ message: "Password changed successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Staff accounts routes
  app.post("/api/staff-accounts", isAuthenticated, async (req, res) => {
    try {
      const data = insertStaffUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const staffUser = await storage.createStaffUser({
        ...data,
        password: hashedPassword,
      });
      res.status(201).json(staffUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/staff-accounts", isAuthenticated, async (req, res) => {
    const staffAccounts = await storage.getAllStaffUsers();
    res.json(staffAccounts);
  });

  app.delete("/api/staff-accounts/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deleteStaffUser(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Staff account not found" });
    }
    res.status(204).send();
  });
  // Services routes
  app.get("/api/services", async (req, res) => {
    const activeOnly = req.query.active === "true";
    const services = activeOnly ? await storage.getActiveServices() : await storage.getAllServices();
    res.json(services);
  });

  app.get("/api/services/:id", async (req, res) => {
    const service = await storage.getService(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  });

  app.post("/api/services", isAuthenticated, async (req, res) => {
    try {
      const data = insertServiceSchema.parse(req.body);
      const service = await storage.createService(data);
      res.status(201).json(service);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/services/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, data);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/services/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deleteService(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(204).send();
  });

  // Packages routes
  app.get("/api/packages", async (req, res) => {
    const activeOnly = req.query.active === "true";
    const packages = activeOnly ? await storage.getActivePackages() : await storage.getAllPackages();
    res.json(packages);
  });

  app.get("/api/packages/:id", async (req, res) => {
    const pkg = await storage.getPackage(req.params.id);
    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json(pkg);
  });

  app.post("/api/packages", isAuthenticated, async (req, res) => {
    try {
      const data = insertPackageSchema.parse(req.body);
      const pkg = await storage.createPackage(data);
      res.status(201).json(pkg);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/packages/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertPackageSchema.partial().parse(req.body);
      const pkg = await storage.updatePackage(req.params.id, data);
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(pkg);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/packages/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deletePackage(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.status(204).send();
  });

  // Staff routes
  app.get("/api/staff", async (req, res) => {
    const activeOnly = req.query.active === "true";
    const staff = activeOnly ? await storage.getActiveStaff() : await storage.getAllStaff();
    res.json(staff);
  });

  app.get("/api/staff/:id", async (req, res) => {
    const member = await storage.getStaff(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    res.json(member);
  });

  app.get("/api/staff/employee/:employeeId", async (req, res) => {
    const member = await storage.getStaffByEmployeeId(req.params.employeeId);
    if (!member) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    res.json(member);
  });

  app.post("/api/staff", isAuthenticated, async (req, res) => {
    try {
      const data = insertStaffSchema.parse(req.body);
      const member = await storage.createStaff(data);
      res.status(201).json(member);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/staff/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertStaffSchema.partial().parse(req.body);
      const member = await storage.updateStaff(req.params.id, data);
      if (!member) {
        return res.status(404).json({ error: "Staff member not found" });
      }
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/staff/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deleteStaff(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    res.status(204).send();
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    const activeOnly = req.query.active === "true";
    const gallery = activeOnly ? await storage.getActiveGallery() : await storage.getAllGallery();
    res.json(gallery);
  });

  app.get("/api/gallery/:id", async (req, res) => {
    const item = await storage.getGalleryItem(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Gallery item not found" });
    }
    res.json(item);
  });

  app.post("/api/gallery", isAuthenticated, async (req, res) => {
    try {
      const data = insertGallerySchema.parse(req.body);
      const item = await storage.createGalleryItem(data);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/gallery/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertGallerySchema.parse(req.body);
      const item = await storage.updateGalleryItem(req.params.id, data);
      if (!item) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/gallery/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deleteGalleryItem(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Gallery item not found" });
    }
    res.status(204).send();
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    const activeOnly = req.query.active === "true";
    const testimonials = activeOnly ? await storage.getActiveTestimonials() : await storage.getAllTestimonials();
    res.json(testimonials);
  });

  app.get("/api/testimonials/:id", async (req, res) => {
    const testimonial = await storage.getTestimonial(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json(testimonial);
  });

  app.post("/api/testimonials", isAuthenticated, async (req, res) => {
    try {
      const data = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(data);
      res.status(201).json(testimonial);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/testimonials/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, data);
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/testimonials/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deleteTestimonial(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.status(204).send();
  });

  // Bookings routes
  app.get("/api/bookings", isAuthenticated, async (req, res) => {
    const bookings = await storage.getAllBookings();
    res.json(bookings);
  });

  app.get("/api/bookings/:id", isAuthenticated, async (req, res) => {
    const booking = await storage.getBooking(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const data = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(data);
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Public booking search endpoint (no authentication required)
  app.get("/api/bookings/search/phone/:phone", async (req, res) => {
    try {
      const phone = req.params.phone;
      if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
      }
      const results = await storage.getBookingsByPhone(phone);
      res.json(results);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/bookings/:id/status", isAuthenticated, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/bookings/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deleteBooking(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(204).send();
  });

  // Contact Info routes
  app.get("/api/contact", async (req, res) => {
    const info = await storage.getContactInfo();
    res.json(info);
  });

  app.patch("/api/contact", isAuthenticated, async (req, res) => {
    try {
      const data = insertContactInfoSchema.parse(req.body);
      const info = await storage.updateContactInfo(data);
      res.json(info);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Branding routes
  app.get("/api/branding", async (req, res) => {
    const branding = await storage.getBranding();
    res.json(branding || { brandName: "Quickfixx", logoUrl: "" });
  });

  app.patch("/api/branding", isAuthenticated, async (req, res) => {
    try {
      const data = insertBrandingSchema.parse(req.body);
      const branding = await storage.updateBranding(data);
      res.json(branding);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // QR Code generation endpoint
  app.get("/api/qr/staff/:employeeId", async (req, res) => {
    try {
      const { employeeId } = req.params;
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const staffUrl = `${baseUrl}/staff/${employeeId}`;
      
      const qrCodeDataUrl = await QRCode.toDataURL(staffUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      res.json({ qrCode: qrCodeDataUrl, url: staffUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
