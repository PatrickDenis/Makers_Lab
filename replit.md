# Maker's Lab - Fabrication Shop Website

A modern, professional website for a precision fabrication shop showcasing services, portfolio, and accepting quote requests. Now with a complete admin dashboard for content management.

## Project Overview

**Built:** November 2024  
**Stack:** Fullstack JavaScript (React + Express + TypeScript)  
**Status:** Production-ready with admin dashboard and PostgreSQL database

## Features

### Completed
- ✅ Responsive homepage with hero section and smooth scroll navigation
- ✅ Services showcase highlighting laser cutting, CNC machining, 3D printing, welding, etc.
- ✅ Portfolio gallery with modal project views
- ✅ Equipment showcase with carousel and technical specifications
- ✅ Process timeline visualization (Consultation → Design → Fabrication → Delivery)
- ✅ Client testimonials section
- ✅ Working contact form for quote requests with validation
- ✅ Newsletter signup in footer with duplicate email prevention
- ✅ Mobile-responsive navigation with hamburger menu
- ✅ Professional design with consistent spacing and typography
- ✅ **PostgreSQL database with persistent storage**
- ✅ **Admin dashboard accessible from footer link**
- ✅ **Services CRUD operations (create, read, update, delete)**
- ✅ **Secure admin authentication with password protection**
- ✅ **PostgreSQL-backed session management**
- ✅ **Construction banner management (enable/disable, customizable content)**
- ✅ **Image upload functionality for admin dashboard:**
  - Services, Projects, Equipment sections support image uploads
  - Testimonials section supports avatar uploads
  - Reusable ImageUploader component with drag-and-drop
  - Object storage integration via Replit's built-in storage
- ✅ Toast notifications for user feedback
- ✅ Loading states during form submissions
- ✅ **Email notifications for quote requests via Microsoft SMTP**
  - Sends formatted HTML emails to info@makers-lab.net
  - Includes all form data with proper HTML escaping for security
  - Graceful fallback if SMTP not configured
- ✅ **Contact section content management:**
  - Editable section headings, descriptions, and CTA text
  - Dynamic contact info cards (Location, Phone, Email, Hours)
  - Full CRUD for contact cards with icon customization
  - Real-time updates reflected on homepage

### API Endpoints

**Contact Form:**
- `POST /api/contact` - Submit quote request
- `GET /api/contact` - Retrieve all contact submissions

**Newsletter:**
- `POST /api/newsletter` - Subscribe to newsletter
- `GET /api/newsletter` - Retrieve all newsletter signups

**Admin Authentication:**
- `POST /api/admin/login` - Admin login (password-based)
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/check` - Check admin session status

**Services Management (Admin Protected):**
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service (admin only)
- `PATCH /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

**Construction Banner:**
- `GET /api/construction-banner` - Get banner settings (public)
- `PUT /api/construction-banner` - Update banner settings (admin only)

**Image Upload (Admin Protected):**
- `POST /api/objects/upload` - Get presigned upload URL (admin only)
- `GET /objects/:objectPath` - Retrieve uploaded objects

**Contact Section Content Management:**
- `GET /api/contact-section` - Get contact section settings (public)
- `PUT /api/contact-section` - Update contact section settings (admin only)
- `GET /api/contact-cards` - Get all contact info cards (public)
- `POST /api/contact-cards` - Create new contact card (admin only)
- `PUT /api/contact-cards/:id` - Update contact card (admin only)
- `DELETE /api/contact-cards/:id` - Delete contact card (admin only)

## Technology Stack

### Frontend
- React 18 with TypeScript
- Wouter for routing
- Tailwind CSS for styling
- Shadcn UI components (Radix UI primitives)
- React Hook Form with Zod validation
- TanStack Query for API state management
- Lucide React icons

### Backend
- Express.js server
- PostgreSQL database with Drizzle ORM
- PostgreSQL-backed sessions using connect-pg-simple
- Zod schema validation
- RESTful API architecture
- Secure session management with httpOnly cookies

### Build Tools
- Vite for development and building
- TypeScript for type safety
- ESBuild for production builds

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── Equipment.tsx
│   │   │   ├── Process.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ui/        # Shadcn UI primitives
│   │   ├── pages/         # Page components
│   │   │   ├── Admin.tsx          # Admin login page
│   │   │   ├── AdminDashboard.tsx # Admin content management
│   │   │   └── Home.tsx           # Main landing page
│   │   └── lib/           # Utilities
├── server/                 # Backend Express server
│   ├── index.ts           # Express app setup with sessions
│   ├── routes.ts          # API route handlers
│   ├── storage.ts         # Database storage interface
│   ├── db.ts             # PostgreSQL connection & Drizzle setup
│   └── seed.ts           # Database seed data
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Drizzle schema definitions
├── attached_assets/        # Generated images
│   └── generated_images/
├── design_guidelines.md    # Design system documentation
└── RUN_LOCALLY.md         # Local setup instructions
```

## Design System

The design follows modern fabrication/maker aesthetic:
- **Colors:** Orange primary accent (#E85D04) with neutral grays
- **Typography:** Inter for headings/body, JetBrains Mono for technical specs
- **Spacing:** Consistent 4/6/8/12/16/24 units
- **Components:** Card-based layout with subtle shadows and hover effects

See `design_guidelines.md` for complete design specifications.

## Running the Application

```bash
npm run dev
```

The application runs on `http://localhost:5000`

## Data Storage

**Current:** PostgreSQL database with Drizzle ORM (production-ready)

All data is stored in a PostgreSQL database with persistent storage. Sessions are also stored in PostgreSQL using connect-pg-simple.

### Database Schema

**Services:**
```typescript
{
  id: number (auto-increment);
  title: string;
  description: string;
  icon: string;
  createdAt: Date;
}
```

**Contact Submissions:**
```typescript
{
  id: string (UUID);
  name: string;
  email: string;
  phone?: string | null;
  budget?: string | null;
  timeline?: string | null;
  description: string;
  createdAt: Date;
}
```

**Newsletter Signups:**
```typescript
{
  id: string (UUID);
  email: string;
  createdAt: Date;
}
```

**Sessions (managed by connect-pg-simple):**
```typescript
{
  sid: string;
  sess: json;
  expire: timestamp;
}
```

**Construction Banner (single row):**
```typescript
{
  id: string (UUID);
  enabled: boolean;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  message: string;
  updatedAt: Date;
}
```

**Contact Section (single row):**
```typescript
{
  id: string (UUID);
  heading: string;
  description: string;
  ctaText: string;
  responseNote: string;
  updatedAt: Date;
}
```

**Contact Cards:**
```typescript
{
  id: string (UUID);
  cardType: string;
  title: string;
  content: string;
  icon: string;
  order: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Admin Dashboard

The admin dashboard is accessible via the "Admin" link in the footer. Admin access is protected by password authentication.

### Admin Features
- ✅ Password-based authentication
- ✅ Secure session management (PostgreSQL-backed)
- ✅ Services management (add, edit, delete)
- ✅ Portfolio, Equipment, Process Steps, and Testimonials management
- ✅ Construction banner management (enable/disable, custom content)
- ✅ Contact section content management (heading, description, CTA, response note)
- ✅ Contact info cards management (Location, Phone, Email, Hours, custom cards)
- ✅ Real-time updates to the homepage
- ✅ Form validation with error handling
- ✅ Loading states for all operations

### Admin Access
1. Click "Admin" link in the footer
2. Enter admin password
3. Manage services from the dashboard
4. Changes are immediately reflected on the homepage

### Security Implementation
- **Required Environment Variables:** SESSION_SECRET and ADMIN_PASSWORD must be set
- **Session Management:** PostgreSQL-backed sessions with connect-pg-simple
- **Secure Cookies:** httpOnly, sameSite: 'lax', secure in production
- **Session Lifecycle:** Regeneration on login, destruction on logout
- **Route Protection:** All admin routes check session authentication
- **Input Validation:** Zod schemas validate all admin inputs

## Environment Variables

**Required for security (application will not start without these):**
- `SESSION_SECRET` - Secret key for session encryption
- `ADMIN_PASSWORD` - Password for admin dashboard access

**Optional (for email notifications):**
- `SMTP_USER` - SMTP email address (e.g., info@makers-lab.net)
- `SMTP_PASS` - SMTP password (configured for Microsoft Office 365)

**Automatically provided (database connection):**
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

**Object Storage (automatically configured):**
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID` - Bucket ID for object storage (replit-objstore-8bdc0b6e-8ee2-46cc-a89b-e19c03a75c03)
- `PRIVATE_OBJECT_DIR` - Directory for private uploads (/uploads)

## Object Storage

**Image Upload Flow:**
1. Admin uploads image via ObjectUploader component
2. Backend receives file via multer temporary storage
3. File is uploaded to Replit Object Storage via signed PUT URL
4. Original temporary file is deleted
5. Image URL `/objects/uploads/{uuid}` is stored in database

**Object Serving:**
- Images are served via `/objects/*` route
- ObjectStorageService handles retrieval from cloud storage
- Images persist across deployments (production-ready)

**Technical Details:**
- Uses `@replit/object-storage` package
- ObjectStorageService (server/objectStorage.ts) handles all operations
- Automatically prepends bucket ID to PRIVATE_OBJECT_DIR if not present
- Supports content-type detection and streaming downloads

## Future Enhancements

### Immediate Next Steps
1. Add image upload for project specifications
2. Add bulk actions for admin dashboard (delete multiple items)
3. Add search/filter functionality to admin dashboard lists

### Long-term Features
- User authentication for client portal
- Real-time quote calculator
- Project tracking system
- Payment integration (Stripe)
- Appointment booking for consultations
- Equipment availability calendar

## Testing

The application has been tested end-to-end with Playwright including:
- Contact form submission and validation
- Newsletter signup with duplicate prevention
- Admin authentication and session management
- Services CRUD operations through admin dashboard
- Construction banner enable/disable and content customization
- API endpoint responses and error handling
- Toast notifications for user feedback
- Form clearing after submission
- Database persistence and data integrity

## Production Deployment Notes

**Before deploying to production:**
1. ✅ Ensure SESSION_SECRET environment variable is set (required)
2. ✅ Ensure ADMIN_PASSWORD environment variable is set (required)
3. ⚠️ Monitor session table growth in PostgreSQL
4. ⚠️ Consider adding logging/alerting for authentication failures
5. ⚠️ Rotate SESSION_SECRET and ADMIN_PASSWORD periodically
6. ⚠️ Review and configure cookie.secure based on HTTPS availability

**Database Management:**
- Use `npm run db:push` to sync schema changes to database
- Sessions are automatically cleaned up by connect-pg-simple based on TTL
- Initial services data is seeded via `server/seed.ts`

## Notes

- All images are AI-generated for the prototype
- Contact information (phone, email, address) are placeholders
- Social media links are placeholder anchors
- The site is optimized for SEO with proper meta tags
- Admin dashboard uses same design system as main site
- Default admin password: "admin123" (set via ADMIN_PASSWORD environment variable)

## Contact

For questions or support, refer to the contact form on the live site or access the admin dashboard to view submissions.
