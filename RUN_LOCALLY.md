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
- And other project dependencies

### 3. Environment Setup (Optional)

If you plan to add backend functionality later, create a `.env` file in the root directory:

```bash
# Example .env file
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

For now, the application runs entirely on the frontend with in-memory storage, so environment variables are optional.

## Running the Development Server

### Start the Application

```bash
npm run dev
```

This command will:
- Start the Express backend server
- Start the Vite development server for the React frontend
- Both servers run on the same port (default: 5000)

### Access the Application

Once the server is running, open your browser and navigate to:

```
http://localhost:5000
```

You should see the Maker's Lab website with:
- Hero section with laser cutting imagery
- Services showcase
- Project portfolio gallery
- Equipment carousel
- Process timeline
- Client testimonials
- Contact form

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

### Type Check
```bash
npm run check
```
Runs TypeScript type checking without emitting files.

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
│   │   │   ├── Contact.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
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
│   ├── routes.ts             # API routes
│   └── storage.ts            # In-memory storage
├── shared/                    # Shared types and schemas
│   └── schema.ts
├── attached_assets/           # Generated images and assets
│   └── generated_images/
├── design_guidelines.md       # Design system documentation
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Features

The current implementation includes:

### Frontend (Fully Functional)
- ✅ Responsive navigation with mobile menu
- ✅ Hero section with CTA buttons
- ✅ Services grid showcasing capabilities
- ✅ Portfolio gallery with modal views
- ✅ Equipment carousel with specifications
- ✅ Process timeline visualization
- ✅ Client testimonials section
- ✅ Contact form with validation
- ✅ Newsletter signup in footer
- ✅ Social media links
- ✅ Smooth scroll navigation

### Backend (Ready for Enhancement)
- ✅ Express server setup
- ✅ In-memory storage interface
- 🔲 Contact form submission API (future)
- 🔲 Newsletter signup API (future)
- 🔲 Quote request management (future)

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v3
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React + React Icons
- **Build Tool**: Vite
- **Backend**: Express.js
- **Type Safety**: TypeScript throughout

## Development Tips

### Hot Reload
The development server supports hot module replacement (HMR). Changes to your code will automatically reload in the browser.

### Component Examples
Each component has an example file in `client/src/components/examples/` for isolated development and testing.

### Styling Guidelines
Refer to `design_guidelines.md` for the complete design system including:
- Typography scales
- Color palette
- Spacing system
- Component patterns
- Accessibility guidelines

### Adding New Pages
1. Create a new page component in `client/src/pages/`
2. Register the route in `client/src/App.tsx`
3. Add navigation links in `Navigation.tsx`

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, you can change it in the Vite configuration or kill the process using that port:

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

## Future Enhancements

The application is currently a high-fidelity frontend prototype. Future development could include:

- Backend API endpoints for form submissions
- Database integration (PostgreSQL via Drizzle ORM)
- Email notifications for quote requests
- Admin dashboard for project management
- Image upload functionality
- Real-time quote calculator
- User authentication for client portal
- Payment integration (Stripe)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Built with precision, just like our fabrication work.**
