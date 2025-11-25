import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Staff users table (for staff login)
export const staffUsers = pgTable("staff_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStaffUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type InsertStaffUser = z.infer<typeof insertStaffUserSchema>;
export type StaffUser = typeof staffUsers.$inferSelect;
export type ChangePassword = z.infer<typeof changePasswordSchema>;

// Services table
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  imageUrls: text("image_urls").array().default(sql`ARRAY[]::text[]`),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Packages table
export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  originalPrice: integer("original_price").notNull(),
  discountedPrice: integer("discounted_price").notNull(),
  features: text("features").array().notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true,
});

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

// Staff table
export const staff = pgTable("staff", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: text("employee_id").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url").notNull(),
  expertise: text("expertise").array().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStaffSchema = createInsertSchema(staff).omit({
  id: true,
  createdAt: true,
});

export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Staff = typeof staff.$inferSelect;

// Gallery table
export const gallery = pgTable("gallery", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  beforeImageUrl: text("before_image_url"),
  afterImageUrl: text("after_image_url"),
  videoUrl: text("video_url"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGallerySchema = z.object({
  beforeImageUrl: z.string().optional().default(""),
  afterImageUrl: z.string().optional().default(""),
  videoUrl: z.string().optional().default(""),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean().default(true),
}).refine(
  (data) => data.beforeImageUrl || data.afterImageUrl || data.videoUrl,
  "At least one of: before image, after image, or video is required"
);

export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof gallery.$inferSelect;

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  serviceType: text("service_type").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  customerAddress: text("customer_address").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  serviceType: text("service_type").notNull(),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  details: text("details"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  status: true,
  createdAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Contact Information table
export const contactInfo = pgTable("contact_info", {
  id: varchar("id").primaryKey().default("1"),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  facebook: text("facebook").notNull(),
  instagram: text("instagram").notNull(),
  tiktok: text("tiktok").default(""),
  linkedin: text("linkedin").default(""),
  twitter: text("twitter").default(""),
  youtube: text("youtube").default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContactInfoSchema = z.object({
  phone: z.string().min(1, "Phone is required"),
  whatsapp: z.string().min(1, "WhatsApp is required"),
  email: z.string().email("Invalid email"),
  facebook: z.string().min(1, "Facebook URL is required"),
  instagram: z.string().min(1, "Instagram URL is required"),
  tiktok: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
  youtube: z.string().optional().default(""),
});

export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;

// Branding table
export const branding = pgTable("branding", {
  id: varchar("id").primaryKey().default("1"),
  brandName: text("brand_name").default("Quickfixx").notNull(),
  logoUrl: text("logo_url").default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBrandingSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  logoUrl: z.string().optional().default(""),
});

export type InsertBranding = z.infer<typeof insertBrandingSchema>;
export type Branding = typeof branding.$inferSelect;
