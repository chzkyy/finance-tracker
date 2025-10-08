# FinanceTracker - Personal Finance Management Application

[![Netlify Status](https://api.netlify.com/api/v1/badges/3dc99c32-31bd-4189-8b37-f235fe133242/deploy-status)](https://app.netlify.com/projects/financial-tracker-fe/deploys)

A modern, full-featured financial tracker built with React 18, TypeScript, and Tailwind CSS. Track your income, expenses, accounts, and generate insightful reports.

## 🚀 Features

- **Authentication**: Secure login and registration system
- **Dashboard**: Overview of financial stats with interactive charts
- **Accounts Management**: Create and manage multiple financial accounts (checking, savings, credit, etc.)
- **Categories**: Organize income and expenses with custom categories
- **Transactions**: Track all financial transactions with advanced filtering and pagination
- **Reports**: Visualize financial data with charts and detailed breakdowns
- **Settings**: Manage profile and application preferences

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **TanStack Query** - Powerful data fetching and caching
- **TanStack Router** - Type-safe routing
- **Axios** - HTTP client with interceptors
- **Zustand** - Lightweight state management
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **Recharts** - Beautiful charts and data visualization
- **shadcn/ui** - High-quality UI components

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd finance-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set your API base URL

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://finance-be.calestira.com
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler check
```

## 🏗️ Project Structure

```
src/
├── api/              # API client functions
│   ├── auth.ts
│   ├── accounts.ts
│   ├── categories.ts
│   ├── transactions.ts
│   └── dashboard.ts
├── components/       # Reusable components
│   ├── layout/
│   │   └── DashboardLayout.tsx
│   ├── ui/          # shadcn/ui components
│   └── ProtectedRoute.tsx
├── lib/             # Utilities and configurations
│   ├── axios.ts     # Axios instance with interceptors
│   └── utils.ts
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Accounts.tsx
│   ├── Categories.tsx
│   ├── Transactions.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── store/           # Zustand stores
│   └── authStore.ts
├── types/           # TypeScript types
│   └── api.ts
├── App.tsx          # Main app component
├── main.tsx         # App entry point
└── index.css        # Global styles
```

## 🔐 Authentication

The app uses Bearer token authentication:

1. Login/Register to receive JWT token
2. Token is stored in localStorage and Zustand store
3. Axios interceptor automatically adds token to all requests
4. Protected routes redirect to login if not authenticated
5. Automatic logout on 401 responses

## 🎨 Design System

The application uses a custom design system with:

- Professional financial color palette (blues, greens, reds)
- Semantic color tokens for consistency
- Success (green) for income/positive values
- Destructive (red) for expenses/negative values
- Primary (blue) for main actions
- Responsive design for all screen sizes

## 📊 Key Features

### Dashboard
- Financial overview with key metrics
- Monthly trend charts
- Category breakdowns
- Recent transactions

### Accounts
- Multiple account types (checking, savings, credit, investment, cash)
- Real-time balance tracking
- CRUD operations

### Categories
- Separate income and expense categories
- Custom categorization
- Easy management

### Transactions
- Advanced filtering (date range, account, category, type)
- Pagination
- Full CRUD operations
- Visual type indicators

### Reports
- Date range selection
- Multiple chart types (line, bar, pie)
- Category breakdowns with percentages
- Trend analysis

## 🔄 API Integration

The app integrates with a backend API (configurable via `VITE_API_BASE_URL`):

- RESTful endpoints
- JWT authentication
- Automatic token refresh
- Error handling and user feedback

## 🧪 Testing

```bash
# Run unit tests (when implemented)
npm run test

# Run e2e tests (when implemented)
npm run test:e2e
```

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🚢 Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains the production build
# Deploy to your preferred hosting service (Vercel, Netlify, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the charting library
- [TanStack](https://tanstack.com/) for Query and Router
- [Zustand](https://zustand-demo.pmnd.rs/) for state management

---

Built with ❤️ using modern web technologies
