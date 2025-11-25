import { db } from "./db";
import {
  type AdminUser,
  type InsertAdminUser,
  adminUsers,
  type Service,
  type InsertService,
  services,
  type Package,
  type InsertPackage,
  packages,
  type Staff,
  type InsertStaff,
  staff,
  type Gallery,
  type InsertGallery,
  gallery,
  type Testimonial,
  type InsertTestimonial,
  testimonials,
  type Booking,
  type InsertBooking,
  bookings,
  type ContactInfo,
  type InsertContactInfo,
  contactInfo,
  type StaffUser,
  type InsertStaffUser,
  staffUsers,
  type Branding,
  type InsertBranding,
  branding,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Admin users
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminPassword(id: string, newPassword: string): Promise<AdminUser | undefined>;

  // Staff users
  getStaffUser(id: string): Promise<StaffUser | undefined>;
  getStaffUserByUsername(username: string): Promise<StaffUser | undefined>;
  createStaffUser(user: InsertStaffUser & { password: string }): Promise<StaffUser>;
  updateStaffUser(id: string, user: Partial<InsertStaffUser>): Promise<StaffUser | undefined>;
  deleteStaffUser(id: string): Promise<boolean>;
  getAllStaffUsers(): Promise<StaffUser[]>;

  // Services
  getAllServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Packages
  getAllPackages(): Promise<Package[]>;
  getActivePackages(): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<boolean>;

  // Staff
  getAllStaff(): Promise<Staff[]>;
  getActiveStaff(): Promise<Staff[]>;
  getStaff(id: string): Promise<Staff | undefined>;
  getStaffByEmployeeId(employeeId: string): Promise<Staff | undefined>;
  createStaff(member: InsertStaff): Promise<Staff>;
  updateStaff(id: string, member: Partial<InsertStaff>): Promise<Staff | undefined>;
  deleteStaff(id: string): Promise<boolean>;

  // Gallery
  getAllGallery(): Promise<Gallery[]>;
  getActiveGallery(): Promise<Gallery[]>;
  getGalleryItem(id: string): Promise<Gallery | undefined>;
  createGalleryItem(item: InsertGallery): Promise<Gallery>;
  updateGalleryItem(id: string, item: Partial<InsertGallery>): Promise<Gallery | undefined>;
  deleteGalleryItem(id: string): Promise<boolean>;

  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getActiveTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;

  // Bookings
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByPhone(phone: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  deleteBooking(id: string): Promise<boolean>;

  // Contact Info
  getContactInfo(): Promise<ContactInfo | undefined>;
  updateContactInfo(info: InsertContactInfo): Promise<ContactInfo>;

  // Branding
  getBranding(): Promise<Branding | undefined>;
  updateBranding(branding: InsertBranding): Promise<Branding>;
}

export class DbStorage implements IStorage {
  // Admin users
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [newUser] = await db.insert(adminUsers).values(user).returning();
    return newUser;
  }

  async updateAdminPassword(id: string, newPassword: string): Promise<AdminUser | undefined> {
    const [updated] = await db.update(adminUsers).set({ password: newPassword }).where(eq(adminUsers.id, id)).returning();
    return updated;
  }

  // Staff users
  async getStaffUser(id: string): Promise<StaffUser | undefined> {
    const [user] = await db.select().from(staffUsers).where(eq(staffUsers.id, id));
    return user;
  }

  async getStaffUserByUsername(username: string): Promise<StaffUser | undefined> {
    const [user] = await db.select().from(staffUsers).where(eq(staffUsers.username, username));
    return user;
  }

  async createStaffUser(user: InsertStaffUser & { password: string }): Promise<StaffUser> {
    const [newUser] = await db.insert(staffUsers).values(user).returning();
    return newUser;
  }

  async updateStaffUser(id: string, user: Partial<InsertStaffUser>): Promise<StaffUser | undefined> {
    const [updated] = await db.update(staffUsers).set(user).where(eq(staffUsers.id, id)).returning();
    return updated;
  }

  async deleteStaffUser(id: string): Promise<boolean> {
    const result = await db.delete(staffUsers).where(eq(staffUsers.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllStaffUsers(): Promise<StaffUser[]> {
    return db.select().from(staffUsers);
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    return db.select().from(services);
  }

  async getActiveServices(): Promise<Service[]> {
    return db.select().from(services).where(eq(services.isActive, true));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db.update(services).set(service).where(eq(services.id, id)).returning();
    return updated;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Packages
  async getAllPackages(): Promise<Package[]> {
    return db.select().from(packages);
  }

  async getActivePackages(): Promise<Package[]> {
    return db.select().from(packages).where(eq(packages.isActive, true));
  }

  async getPackage(id: string): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [newPackage] = await db.insert(packages).values(pkg).returning();
    return newPackage;
  }

  async updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | undefined> {
    const [updated] = await db.update(packages).set(pkg).where(eq(packages.id, id)).returning();
    return updated;
  }

  async deletePackage(id: string): Promise<boolean> {
    const result = await db.delete(packages).where(eq(packages.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Staff
  async getAllStaff(): Promise<Staff[]> {
    return db.select().from(staff);
  }

  async getActiveStaff(): Promise<Staff[]> {
    return db.select().from(staff).where(eq(staff.isActive, true));
  }

  async getStaff(id: string): Promise<Staff | undefined> {
    const [member] = await db.select().from(staff).where(eq(staff.id, id));
    return member;
  }

  async getStaffByEmployeeId(employeeId: string): Promise<Staff | undefined> {
    const [member] = await db.select().from(staff).where(eq(staff.employeeId, employeeId));
    return member;
  }

  async createStaff(member: InsertStaff): Promise<Staff> {
    const [newStaff] = await db.insert(staff).values(member).returning();
    return newStaff;
  }

  async updateStaff(id: string, member: Partial<InsertStaff>): Promise<Staff | undefined> {
    const [updated] = await db.update(staff).set(member).where(eq(staff.id, id)).returning();
    return updated;
  }

  async deleteStaff(id: string): Promise<boolean> {
    const result = await db.delete(staff).where(eq(staff.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Gallery
  async getAllGallery(): Promise<Gallery[]> {
    return db.select().from(gallery);
  }

  async getActiveGallery(): Promise<Gallery[]> {
    return db.select().from(gallery).where(eq(gallery.isActive, true));
  }

  async getGalleryItem(id: string): Promise<Gallery | undefined> {
    const [item] = await db.select().from(gallery).where(eq(gallery.id, id));
    return item;
  }

  async createGalleryItem(item: InsertGallery): Promise<Gallery> {
    const [newItem] = await db.insert(gallery).values(item).returning();
    return newItem;
  }

  async updateGalleryItem(id: string, item: Partial<InsertGallery>): Promise<Gallery | undefined> {
    const [updated] = await db.update(gallery).set(item).where(eq(gallery.id, id)).returning();
    return updated;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const result = await db.delete(gallery).where(eq(gallery.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials);
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials).where(eq(testimonials.isActive, true));
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updated] = await db.update(testimonials).set(testimonial).where(eq(testimonials.id, id)).returning();
    return updated;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Bookings
  async getAllBookings(): Promise<Booking[]> {
    return db.select().from(bookings);
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByPhone(phone: string): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.customerPhone, phone));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [updated] = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
    return updated;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const result = await db.delete(bookings).where(eq(bookings.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Contact Info
  async getContactInfo(): Promise<ContactInfo | undefined> {
    const [info] = await db.select().from(contactInfo).where(eq(contactInfo.id, "1"));
    return info;
  }

  async updateContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    const [updated] = await db
      .insert(contactInfo)
      .values({ id: "1", ...info })
      .onConflictDoUpdate({ target: contactInfo.id, set: info })
      .returning();
    return updated;
  }

  // Branding
  async getBranding(): Promise<Branding | undefined> {
    const [brandingData] = await db.select().from(branding).where(eq(branding.id, "1"));
    return brandingData;
  }

  async updateBranding(brandingData: InsertBranding): Promise<Branding> {
    const [updated] = await db
      .insert(branding)
      .values({ id: "1", ...brandingData })
      .onConflictDoUpdate({ target: branding.id, set: brandingData })
      .returning();
    return updated;
  }
}

export const storage = new DbStorage();
