# Maker's Lab - Fabrication Shop Website

A modern, professional website for a precision fabrication shop showcasing services, portfolio, and accepting quote requests.

## Project Overview

**Built:** November 2024  
**Stack:** Fullstack JavaScript (React + Express + TypeScript)  
**Status:** Fully functional MVP with working contact forms and newsletter signup

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
- ✅ All form data persists in-memory storage
- ✅ Toast notifications for user feedback
- ✅ Loading states during form submissions

### API Endpoints

**Contact Form:**
- `POST /api/contact` - Submit quote request
- `GET /api/contact` - Retrieve all contact submissions

**Newsletter:**
- `POST /api/newsletter` - Subscribe to newsletter
- `GET /api/newsletter` - Retrieve all newsletter signups

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
- In-memory storage (MemStorage)
- Zod schema validation
- RESTful API architecture

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
│   │   └── lib/           # Utilities
├── server/                 # Backend Express server
│   ├── index.ts
│   ├── routes.ts          # API route handlers
│   └── storage.ts         # In-memory data storage
├── shared/                 # Shared types and schemas
│   └── schema.ts
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

**Current:** In-memory storage (data is lost on server restart)

Contact submissions and newsletter signups are stored in memory using the MemStorage class. This is suitable for prototyping but should be replaced with a persistent database (PostgreSQL) for production use.

### Storage Schema

**Contact Submissions:**
```typescript
{
  id: string;
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
  id: string;
  email: string;
  createdAt: Date;
}
```

## Future Enhancements

### Immediate Next Steps
1. Add PostgreSQL database for persistent storage
2. Implement email notifications for new quote requests
3. Create admin dashboard to view/manage submissions
4. Add image upload for project specifications

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
- API endpoint responses
- Toast notifications
- Form clearing after submission

## Notes

- All images are AI-generated for the prototype
- Contact information (phone, email, address) are placeholders
- Social media links are placeholder anchors
- The site is optimized for SEO with proper meta tags

## Contact

For questions or support, refer to the contact form on the live site or check the API endpoints to retrieve submissions.
