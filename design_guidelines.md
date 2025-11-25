# Quick Fixx Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from service marketplace leaders like Airbnb and Thumbtack, combined with the premium aesthetic of luxury service providers. This approach balances trust-building visual appeal with functional service booking.

**Core Principle**: Professional, premium service platform that builds trust through transparency while maintaining ease of use for Bangladesh's mobile-first market.

## Typography System

**Font Families**:
- Primary: 'Inter' (Google Fonts) - Clean, modern, excellent readability
- Accent: 'Playfair Display' (Google Fonts) - Elegant serif for premium touch on headings

**Hierarchy**:
- Hero Headline: 3xl-5xl, font-bold, Playfair Display
- Section Headings: 2xl-3xl, font-bold, Inter
- Service Titles: xl-2xl, font-semibold, Inter
- Body Text: base-lg, font-normal, Inter
- Captions/Meta: sm-base, font-medium, Inter
- CTA Buttons: base-lg, font-semibold, Inter

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm (p-4, m-8, gap-6, etc.)

**Container Strategy**:
- Full-width hero with inner max-w-7xl
- Content sections: max-w-6xl mx-auto
- Text content: max-w-4xl for readability
- Admin dashboard: max-w-screen-2xl

**Grid Systems**:
- Service cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Staff profiles: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Gallery: Masonry-style grid with varying heights
- Packages: grid-cols-1 lg:grid-cols-2 for comparison

## Component Library

### Navigation
- Fixed header with logo left, navigation center, contact CTAs right (WhatsApp + Call buttons)
- Mobile: Hamburger menu with full-screen overlay
- Admin: Sidebar navigation (collapsible on mobile)

### Hero Section
**Large hero image** showcasing technician at work or professional service delivery
- Height: 80vh on desktop, 60vh on mobile
- Content overlay with frosted glass effect container
- Headline + subheadline + dual CTA buttons (Book Now + View Services)
- Trust badges below: "Trusted | Fast | Affordable"

### Service Cards
- Card with service icon, title, short description, price range
- Hover elevation effect
- "Learn More" link and "Book Now" button
- Include time estimate and technician badge

### Staff Verification Cards (QR Scan Landing)
- Large staff photo (circular or rounded square)
- Employee details in structured layout: Name (2xl bold), ID number, Role, Specializations (tags), Join date
- Verification badge prominently displayed
- Quick Fixx branding reinforcement

### Booking Form
- Single-column layout with clear section breaks
- Input fields: Full-width with subtle borders, rounded corners
- Service selector: Dropdown with icons
- Time picker: Calendar widget
- Prominent submit button at bottom
- WhatsApp confirmation preview

### Before/After Gallery
- Two-column comparison layout or slider interaction
- Lightbox on click for full-size viewing
- Category filters above gallery
- 3-4 columns on desktop, 2 on tablet, 1 on mobile

### Testimonial Section
- Card-based layout with customer photo, quote, name, service type
- 3-column grid on desktop
- Star rating display
- Carousel for mobile

### Admin Dashboard
- Clean sidebar with icon + label navigation
- Data tables with search, filter, sort capabilities
- Modal overlays for editing (not new pages)
- Drag-and-drop for image uploads and reordering
- WYSIWYG editor for blog content
- QR code generator with download button for staff IDs

### Footer
- 4-column layout: About, Services, Contact, Social
- Newsletter signup form
- Social media icons (Facebook, Instagram, WhatsApp)
- Copyright and trust badges

## Page-Specific Layouts

### Homepage (8 sections)
1. Hero with large image and overlay content
2. Services Overview (3-4 column grid of service categories)
3. Why Choose Quick Fixx (icon features, 4-column)
4. Featured Packages (2-column comparison cards)
5. Before/After Gallery (masonry grid, 6-8 images)
6. Customer Reviews (3-column testimonial cards)
7. Staff Trust Section (4 staff members with photos)
8. Contact CTA (split layout: form left, contact info + map right)

### Service Pages
- Breadcrumb navigation
- Service hero (60vh with relevant image)
- Service details in tabs or accordion: Description, Process, Tools, Pricing, FAQs
- Related services sidebar
- Booking CTA sticky on scroll

### Staff Verification Page (QR Landing)
- Centered card layout (max-w-2xl)
- Large staff photo at top
- Details below in clean typography hierarchy
- Verified badge with checkmark
- Quick Fixx branding footer
- "Back to Homepage" link

### Admin Dashboard
- Sidebar navigation (220px wide)
- Top bar with search and user menu
- Content area with cards for metrics
- Tables and forms in clean white cards with shadows

## Images

**Hero Section**: Large, high-quality image of Quick Fixx technician installing CCTV camera or working on smart home setup. Professional, well-lit, showing competence and care. Should convey trust and expertise.

**Service Category Headers**: Relevant imagery for each service type (CCTV cameras, smart home devices, IT setup, quick fix tools).

**Before/After Gallery**: 6-8 comparison images showing transformation of spaces with CCTV installations, cable management improvements, smart home setups.

**Staff Photos**: Professional headshots or action shots of team members, used in both homepage trust section and QR verification pages.

**Testimonial Images**: Customer photos (if available) to increase authenticity.

## Animations

**Minimal and purposeful**:
- Hero text fade-in on load (0.6s)
- Scroll-triggered fade-in for sections (stagger by 0.1s)
- Card hover elevation (transform: translateY(-4px))
- Button hover scale (1.02)
- No parallax, no complex scroll animations

## Responsive Behavior

**Mobile-First Priorities**:
- Click-to-call and WhatsApp buttons prominent and sticky
- Simplified navigation (hamburger menu)
- Single-column layouts for all content
- Service cards stack vertically with full details
- Booking form optimized for mobile input
- Admin dashboard: collapsible sidebar, table horizontal scroll

**Breakpoints**:
- Mobile: base (up to 768px)
- Tablet: md (768px+)
- Desktop: lg (1024px+)
- Large Desktop: xl (1280px+)

## Accessibility & Performance

- Semantic HTML throughout
- ARIA labels for interactive elements
- Keyboard navigation support in admin dashboard
- Form validation with clear error messages
- Lazy loading for gallery images
- CDN-hosted fonts and icons (Font Awesome for service icons)
- Image optimization (WebP with fallbacks)