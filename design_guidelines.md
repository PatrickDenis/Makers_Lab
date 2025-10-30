# Maker's Lab Fabrication Shop - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern maker spaces (MakerBot, Shapeways), creative portfolios (Behance showcases), and industrial design leaders. The aesthetic balances precision engineering with creative innovation—professional yet approachable, technical yet inspiring.

**Core Principle**: Showcase craftsmanship through bold visuals and clean, structured layouts that reflect the precision of fabrication work.

## Typography

**Font Stack (Google Fonts)**:
- **Primary (Headings)**: Inter (700, 600) - Modern, geometric, reflects precision
- **Secondary (Body)**: Inter (400, 500) - Same family for cohesion
- **Accent (Technical specs)**: JetBrains Mono (400) - Monospace for technical details, measurements

**Hierarchy**:
- Hero headline: text-5xl lg:text-7xl font-bold
- Section headers: text-3xl lg:text-5xl font-bold
- Subsections: text-2xl lg:text-3xl font-semibold
- Body: text-base lg:text-lg
- Technical specs/captions: text-sm font-mono

## Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16, 20, 24** for consistent rhythm
- Component internal spacing: p-4 to p-6
- Section padding: py-16 lg:py-24
- Content gaps: gap-6 to gap-12
- Container max-width: max-w-7xl

## Page Structure & Sections

### 1. Hero Section (80vh)
Large background image of fabrication equipment in action or completed project showcase
- Split layout: Left-aligned headline + CTA, right side lets image breathe
- Headline emphasizing capabilities ("Precision Fabrication Meets Creative Vision")
- Primary CTA: "Request a Quote" + Secondary: "View Portfolio"
- Overlay gradient for text readability
- Trust indicator: "Serving makers since [year] • 500+ Projects Completed"

### 2. Services/Capabilities Grid (3-column desktop, stacked mobile)
Each service card includes:
- Icon representing service (laser cutting, CNC, 3D printing, welding, assembly)
- Service name as header
- 2-3 line description
- "Learn More" link
- Subtle hover elevation effect
Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8

### 3. Featured Projects Gallery (Masonry/Staggered Grid)
Portfolio showcase with 6-8 projects
- Large project cards with high-quality images
- Project title overlay on hover
- Categories/tags visible (Industrial, Art, Prototype, etc.)
- Click to view project details in modal or dedicated page
- Grid: Alternating sizes for visual interest

### 4. Equipment & Capabilities Showcase
Two-column split (desktop):
- Left: Carousel of equipment photos (laser cutter, CNC mill, 3D printers)
- Right: Specs list with technical details, materials supported, precision tolerances
- On mobile: Stack vertically

### 5. Process Timeline
Horizontal step-by-step flow (4 steps):
- Consultation → Design → Fabrication → Delivery
- Each step with icon, title, brief description
- Connected by line/arrows
- Mobile: Vertical stack

### 6. Testimonials (2-column desktop)
Client quotes with:
- Quote text
- Client name, company, project type
- Optional: Project photo thumbnail
- Alternating layout prevents monotony

### 7. Contact/Quote Request
Two-column layout:
- Left: Form (Name, Email, Project Description, Budget Range, Timeline)
- Right: Contact details, shop hours, location map placeholder, response time expectation
- Mobile: Stack vertically

### 8. Footer (Rich)
Multi-column layout:
- Services quick links
- Social media (Instagram showcase of work)
- Newsletter signup ("Get fabrication tips & project inspiration")
- Business info, certifications, partner logos

## Component Library

**Navigation**: 
Sticky header with logo left, horizontal menu right, mobile hamburger
- Transparent over hero, solid white on scroll
- Links: Home, Services, Portfolio, About, Contact
- CTA button: "Get Quote" always visible

**Cards (Project/Service)**:
- Rounded corners (rounded-lg)
- Subtle shadow (shadow-md)
- Hover: shadow-xl transition
- Image: aspect-square or aspect-video
- Text padding: p-6

**Buttons**:
- Primary: Solid background, white text, rounded-lg, px-8 py-4
- Secondary: Outline style, transparent background
- Blur background when over images
- All buttons have built-in hover states

**Forms**:
- Input fields: border-2, rounded-lg, p-4
- Labels: text-sm font-medium above fields
- Focus state: border color change
- Required field indicators

**Image Treatments**:
- Hero: Full-bleed background with gradient overlay
- Gallery: High-quality project photos, consistent aspect ratios
- Equipment: Product-style photography, clean backgrounds
- Hover: Subtle zoom effect (scale-105)

## Icons

**Library**: Heroicons (CDN)
- Use outline style for navigation, menus
- Use solid style for CTAs, features
- Consistent size: h-6 w-6 for UI, h-12 w-12 for feature icons

## Images

**Critical Image Placements**:

1. **Hero Background**: Large, dramatic shot of fabrication in action (laser cutting sparks, CNC in operation, or stunning completed project). Full-width, 80vh height.

2. **Services Section**: Icon-based (no photos), use Heroicons for tools/equipment representations

3. **Project Gallery**: 6-8 high-quality project photos showing variety (industrial parts, artistic pieces, prototypes). Images should be sharp, well-lit, professional product photography style.

4. **Equipment Showcase**: 3-4 photos of key machines (laser cutter, CNC mill, 3D printer array). Clean, well-lit equipment photography.

5. **About Section**: Optional team photo or workshop overview shot showing workspace

6. **Testimonial Section**: Small circular client/project thumbnails if available

**Image Style**: High-contrast, sharp focus, industrial aesthetic. Mix of action shots (fabrication in progress) and clean product photography (finished pieces). All images should convey precision and professionalism.

## Animations

Minimal, purposeful only:
- Smooth scroll behavior
- Fade-in on scroll for sections (subtle)
- Hero CTA pulse/glow effect (very subtle)
- Card hover transitions (shadow, scale)
- NO complex scroll-triggered animations, parallax, or excessive motion

## Accessibility

- Semantic HTML throughout
- Alt text for all images describing projects/equipment
- Proper heading hierarchy (h1 → h2 → h3)
- Form labels properly associated
- Focus indicators visible on keyboard navigation
- Sufficient color contrast for all text