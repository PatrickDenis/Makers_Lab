# Running Maker's Lab Locally

This guide will help you set up and run the Maker's Lab fabrication shop website on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd makers-lab
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React for the frontend
- Express for the backend
- Tailwind CSS for styling
- Shadcn UI components
- TanStack Query for API state management
- Zod for validation
- And other project dependencies

### 3. Environment Setup (Optional)

The application runs with minimal configuration. No environment variables are required for basic operation.

If you plan to extend the backend, create a `.env` file in the root directory:

```bash
# Example .env file
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

## Running the Development Server

### Start the Application

```bash
npm run dev
```

This command will:
- Start the Express backend server on port 5000
- Start the Vite development server for the React frontend
- Enable hot module replacement (HMR) for instant updates
- Set up API endpoints for contact forms and newsletter

### Access the Application

Once the server is running, open your browser and navigate to:

```
http://localhost:5000
```

You should see the Maker's Lab website with:
- Hero section with laser cutting imagery
- Services showcase
- Project portfolio gallery with modal views
- Equipment carousel with specifications
- Process timeline visualization
- Client testimonials
- Working contact form
- Newsletter signup in footer

## Available Scripts

### Development
```bash
npm run dev
```
Runs the app in development mode with hot reload.

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `dist` folder.

### Start Production Server
```bash
npm start
```
Runs the production build (requires running `npm run build` first).

## Project Structure

```
makers-lab/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── Equipment.tsx
│   │   │   ├── Process.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Contact.tsx   # Contact form with backend integration
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx    # Newsletter signup
│   │   │   └── ui/           # Shadcn UI primitives
│   │   ├── pages/            # Page components
│   │   │   └── Home.tsx
│   │   ├── lib/              # Utilities and helpers
│   │   ├── App.tsx           # Main app component
│   │   ├── index.css         # Global styles and Tailwind
│   │   └── main.tsx          # Application entry point
│   └── index.html            # HTML template
├── server/                    # Backend Express server
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API routes (contact, newsletter)
│   ├── storage.ts            # In-memory storage implementation
│   └── vite.ts               # Vite server integration
├── shared/                    # Shared types and schemas
│   └── schema.ts             # Zod schemas and TypeScript types
├── attached_assets/           # Generated images and assets
│   └── generated_images/
├── design_guidelines.md       # Design system documentation
├── replit.md                 # Project documentation
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Features

### Frontend (Fully Functional)
- ✅ Responsive navigation with mobile menu
- ✅ Hero section with CTA buttons and smooth scroll
- ✅ Services grid showcasing capabilities
- ✅ Portfolio gallery with modal views
- ✅ Equipment carousel with specifications
- ✅ Process timeline visualization
- ✅ Client testimonials section
- ✅ Contact form with validation
- ✅ Newsletter signup in footer
- ✅ Social media links
- ✅ Toast notifications for user feedback
- ✅ Loading states during form submissions

### Backend (Fully Functional)
- ✅ Express server setup
- ✅ RESTful API endpoints
- ✅ Contact form submission API
- ✅ Newsletter signup API with duplicate prevention
- ✅ In-memory storage (data persists during session)
- ✅ Request validation using Zod schemas
- ✅ Error handling and response formatting

## API Endpoints

The backend provides the following REST API endpoints:

### Contact Form
**POST** `/api/contact`
Submit a quote request with the following data:
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "(555) 123-4567",        // optional
  "budget": "1k-5k",                // optional
  "timeline": "1month",             // optional
  "description": "Project details"
}
```

Response:
```json
{
  "success": true,
  "message": "Quote request received successfully",
  "id": "uuid"
}
```

**GET** `/api/contact`
Retrieve all contact submissions:
```json
{
  "success": true,
  "submissions": [...]
}
```

### Newsletter
**POST** `/api/newsletter`
Subscribe to newsletter:
```json
{
  "email": "subscriber@example.com"
}
```

Response (success):
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

Response (duplicate):
```json
{
  "success": false,
  "message": "This email is already subscribed"
}
```

**GET** `/api/newsletter`
Retrieve all newsletter signups:
```json
{
  "success": true,
  "signups": [...]
}
```

## Data Storage

⚠️ **Important:** This application currently uses **in-memory storage**. This means:
- All data is stored temporarily in RAM during the server session
- Data will be **lost when the server restarts**
- Perfect for development, testing, and prototyping
- **Not suitable for production** without database integration

### Storage Schema

**Contact Submissions:**
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string | null;
  budget: string | null;
  timeline: string | null;
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

For production use, integrate a persistent database like PostgreSQL (already configured via Drizzle ORM schemas).

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v3
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query (React Query v5)
- **Icons**: Lucide React + React Icons (for logos)
- **Build Tool**: Vite
- **Backend**: Express.js with TypeScript
- **Validation**: Zod schemas
- **Type Safety**: TypeScript throughout
- **ORM Ready**: Drizzle ORM schemas defined

## Development Tips

### Hot Module Replacement
The development server supports HMR. Changes to your code will automatically reload in the browser without losing state.

### Form Testing
1. Fill out the contact form and click "Request Quote"
2. Check the browser console or Network tab to see the API request
3. Use `GET /api/contact` endpoint to verify submissions
4. Test newsletter signup with duplicate emails to see validation

### Styling Guidelines
Refer to `design_guidelines.md` for the complete design system including:
- Typography scales (Inter + JetBrains Mono)
- Color palette (Orange primary with neutral grays)
- Spacing system (consistent 4/6/8/12/16/24 units)
- Component patterns
- Dark mode support (configured but not activated)

### Adding New Pages
1. Create a new page component in `client/src/pages/`
2. Register the route in `client/src/App.tsx`
3. Add navigation links in `Navigation.tsx`

### Customizing Content
- **Colors & Branding**: Edit `client/src/index.css`
- **Component Content**: Modify files in `client/src/components/`
- **Images**: Replace images in `attached_assets/generated_images/`
- **Contact Information**: Update `Contact.tsx` and `Footer.tsx`

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, you can change it in `server/index.ts` or kill the process:

```bash
# On macOS/Linux
lsof -ti:5000 | xargs kill -9

# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Dependencies Not Installing
Clear your npm cache and try again:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
Ensure you're using Node.js v18 or higher:

```bash
node --version
```

### TypeScript Errors
Run type checking to see all errors:

```bash
npx tsc --noEmit
```

### API Not Working
1. Check that the server is running on port 5000
2. Open browser DevTools → Network tab to see API requests
3. Check server logs in the terminal for errors
4. Verify request payload matches expected schema

## Browser Compatibility

The site works best on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

The application has been tested end-to-end with:
- ✅ Contact form submission with all fields
- ✅ Contact form validation (required fields)
- ✅ Newsletter signup with success notification
- ✅ Newsletter duplicate email prevention
- ✅ API endpoint responses and data persistence
- ✅ Toast notifications for user feedback
- ✅ Form clearing after successful submission
- ✅ Mobile responsive behavior

## Future Enhancements

The application is production-ready for frontend display. To make it fully production-ready:

### Immediate Next Steps
1. **Database Integration**: Replace in-memory storage with PostgreSQL
2. **Email Notifications**: Send emails when quote requests are submitted
3. **Admin Dashboard**: Create backend admin panel to manage submissions
4. **Image Uploads**: Allow users to upload reference images with quotes

### Long-term Features
- User authentication for client portal
- Real-time quote calculator based on materials/dimensions
- Project tracking system for active jobs
- Payment integration (Stripe)
- Appointment booking for consultations
- Equipment availability calendar
- Client project galleries

## Deployment

For production deployment, consider:
- **Vercel** - Easy deployment for frontend + serverless backend
- **Netlify** - Similar to Vercel with excellent performance
- **Railway** - Full-stack deployment with database support
- **Replit** - Instant deployment with the "Publish" button
- **DigitalOcean/AWS/GCP** - Traditional cloud hosting

Remember to:
1. Set up a production database (PostgreSQL)
2. Configure environment variables
3. Enable HTTPS/SSL
4. Set up email service for notifications
5. Configure domain and DNS

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository or contact through the website.

---

**Built with precision, just like our fabrication work.**
