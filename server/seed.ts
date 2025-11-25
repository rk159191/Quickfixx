import { db } from "./db";
import { adminUsers, services, packages, staff, gallery, testimonials } from "@shared/schema";
import bcrypt from "bcryptjs";

// Use relative URLs for images that will be served by the frontend
const beforeCableUrl = "/attached_assets/generated_images/before_cable_management.png";
const afterCableUrl = "/attached_assets/generated_images/after_cable_management.png";
const beforeCctvUrl = "/attached_assets/generated_images/before_cctv_upgrade.png";
const afterCctvUrl = "/attached_assets/generated_images/after_cctv_upgrade.png";
const staff1Url = "/attached_assets/generated_images/staff_member_1.png";
const staff2Url = "/attached_assets/generated_images/staff_member_2.png";
const staff3Url = "/attached_assets/generated_images/staff_member_3.png";

async function seed() {
  console.log("Starting database seed...");

  // Create admin user
  console.log("Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.insert(adminUsers).values({
    username: "admin",
    password: hashedPassword,
  });

  // Create services
  console.log("Creating services...");
  await db.insert(services).values([
    {
      title: "CCTV Installation",
      description: "Professional security camera installation with remote viewing setup for complete peace of mind.",
      price: 25000,
      imageUrl: beforeCctvUrl,
      category: "Security",
      isActive: true,
    },
    {
      title: "Smart Home Setup",
      description: "Transform your home with smart devices, automated lighting, and voice control systems.",
      price: 15000,
      imageUrl: staff1Url,
      category: "Smart Home",
      isActive: true,
    },
    {
      title: "IT Support",
      description: "Business IT solutions including POS setup, network configuration, and computer troubleshooting.",
      price: 10000,
      imageUrl: staff2Url,
      category: "IT Support",
      isActive: true,
    },
    {
      title: "Quick Fix Service",
      description: "Fast on-call technician for electrical fixes, fan installation, and general home assistance.",
      price: 2500,
      imageUrl: staff3Url,
      category: "General",
      isActive: true,
    },
  ]);

  // Create packages
  console.log("Creating packages...");
  await db.insert(packages).values([
    {
      name: "CCTV Starter Pack",
      description: "Perfect for small homes or offices",
      originalPrice: 20000,
      discountedPrice: 15000,
      features: ["4 IP cameras installation", "DVR/NVR setup", "Basic cable management", "Remote viewing setup", "1 month warranty"],
      isPopular: false,
      isActive: true,
    },
    {
      name: "Home Security Full Pack",
      description: "Complete security solution for your home",
      originalPrice: 45000,
      discountedPrice: 35000,
      features: ["8 HD cameras installation", "16-channel NVR system", "Professional cable management", "Remote viewing via mobile app", "Motion detection alerts", "3 months warranty"],
      isPopular: true,
      isActive: true,
    },
    {
      name: "Business Premium Pack",
      description: "Enterprise-grade security for businesses",
      originalPrice: 80000,
      discountedPrice: 65000,
      features: ["16 professional cameras", "Network video recorder", "Cloud storage integration", "24/7 remote monitoring", "Advanced analytics", "1 year warranty", "Priority support"],
      isPopular: false,
      isActive: true,
    },
  ]);

  // Create staff
  console.log("Creating staff...");
  await db.insert(staff).values([
    {
      employeeId: "QF001",
      name: "Rakib Ahmed",
      role: "Lead Technician",
      bio: "Certified CCTV specialist with 8+ years of experience in security systems and smart home installations. Expert in network configuration and surveillance technology.",
      imageUrl: staff1Url,
      expertise: ["CCTV Installation", "Network Setup", "Smart Home Integration"],
      isActive: true,
    },
    {
      employeeId: "QF002",
      name: "Faisal Rahman",
      role: "IT Support Specialist",
      bio: "Skilled IT professional specializing in POS systems, computer troubleshooting, and business network solutions. 5+ years of technical support experience.",
      imageUrl: staff2Url,
      expertise: ["POS Systems", "Computer Repair", "Network Configuration"],
      isActive: true,
    },
    {
      employeeId: "QF003",
      name: "Kamal Hossain",
      role: "General Technician",
      bio: "Versatile technician handling electrical repairs, fan installations, and general home maintenance. Quick response time and customer-focused service.",
      imageUrl: staff3Url,
      expertise: ["Electrical Work", "Fan Installation", "General Repairs"],
      isActive: true,
    },
  ]);

  // Create gallery items
  console.log("Creating gallery items...");
  await db.insert(gallery).values([
    {
      beforeImageUrl: beforeCableUrl,
      afterImageUrl: afterCableUrl,
      title: "Cable Management Upgrade",
      description: "Professional cable organization for CCTV system",
      isActive: true,
    },
    {
      beforeImageUrl: beforeCctvUrl,
      afterImageUrl: afterCctvUrl,
      title: "Security System Modernization",
      description: "Complete CCTV system upgrade with HD cameras",
      isActive: true,
    },
    {
      beforeImageUrl: beforeCableUrl,
      afterImageUrl: afterCableUrl,
      title: "Office Network Setup",
      description: "Structured cabling for office network infrastructure",
      isActive: true,
    },
    {
      beforeImageUrl: beforeCctvUrl,
      afterImageUrl: afterCctvUrl,
      title: "Smart Home Integration",
      description: "Smart devices installation with centralized control",
      isActive: true,
    },
  ]);

  // Create testimonials
  console.log("Creating testimonials...");
  await db.insert(testimonials).values([
    {
      customerName: "Mahmud Hasan",
      rating: 5,
      comment: "Excellent CCTV installation service! The team was professional and completed the job quickly. Very satisfied with the quality of work.",
      serviceType: "CCTV Installation",
      isActive: true,
    },
    {
      customerName: "Sadia Akter",
      rating: 5,
      comment: "Quick Fixx transformed our home with smart devices. Everything works perfectly and the technician explained everything clearly.",
      serviceType: "Smart Home Setup",
      isActive: true,
    },
    {
      customerName: "Jahangir Alam",
      rating: 4,
      comment: "Great IT support for our business. They set up our POS system efficiently and trained our staff well.",
      serviceType: "IT Support",
      isActive: true,
    },
    {
      customerName: "Nusrat Jahan",
      rating: 5,
      comment: "Called them for an emergency electrical fix and they arrived within an hour. Professional and reasonably priced!",
      serviceType: "Quick Fix Service",
      isActive: true,
    },
    {
      customerName: "Tanvir Ahmed",
      rating: 5,
      comment: "The security full pack was worth every taka. High quality cameras and excellent installation. Highly recommended!",
      serviceType: "CCTV Installation",
      isActive: true,
    },
    {
      customerName: "Rupa Begum",
      rating: 4,
      comment: "Very helpful staff and good quality service. Will definitely use Quick Fixx again for future projects.",
      serviceType: "General",
      isActive: true,
    },
  ]);

  console.log("Database seed completed successfully!");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
