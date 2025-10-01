# GoMake Web - Complete Architecture Overview

## Project Purpose
GoMake Web is a comprehensive manufacturing management web application with a unified communication hub (FrontDesk) that integrates multiple messaging providers (Gmail, WhatsApp, Internal messaging) into a single interface.

## Core Tech Stack
- **Framework**: Next.js 13.5.4 with Pages Router (NOT App Router)
- **Language**: TypeScript 5.4.3 (non-strict mode)
- **State Management**: Recoil 0.7.7
- **UI Libraries**: 
  - Material-UI v5.16.6 (primary)
  - Ant Design 5.20.3
  - PrimeReact 10.8.2
  - Fluent UI 8.114.0
- **Real-time Communication**: 
  - Socket.IO Client 4.8.1
  - Microsoft SignalR 8.0.0
- **Data Fetching**: Axios 1.3.4 with custom hooks
- **Styling**: styled-components 6.0.4, Emotion 11.13.0
- **Testing**: Jest 29.5.0 + React Testing Library 14.0.0
- **Development**: Node.js with npm

## Directory Structure & Architecture
```
src/
├── pages/                    # Next.js Pages Router entries (.page.tsx)
├── pages-components/         # Page-specific components (not reused)
├── components/               # Reusable UI primitives (no domain logic)
├── widgets/                  # Feature-level composed UI (uses components)
├── layouts/                  # Page/app shells and structure
├── providers/                 # Global contexts (theme, auth, i18n, SignalR)
├── hooks/                    # Reusable behavior (state/effects, data hooks)
│   ├── socket-io/           # Socket.IO specific hooks
│   ├── frontdesk/           # FrontDesk communication hooks
│   └── shared-customer-admin/ # Shared customer management
├── store/                    # Recoil atoms/selectors (cross-page state)
├── services/                 # IO: API clients, side effects
│   ├── api-service/         # Endpoint definitions
│   ├── websocket/          # Socket.IO and SignalR services
│   ├── api-request.ts      # Axios config & interceptors
│   └── storage-data.ts     # Local storage utilities
├── lib/                      # Domain utilities/algorithms (pure)
├── utils/                    # Small generic helpers
├── interfaces/               # Shared TS interfaces/types
├── enums/                    # Shared enums
├── languages/                # i18n resources & setup
├── icons/                    # SVG/icon components
├── styles/                   # Global styles/tokens
└── shared/                   # Cross-feature constants/assets
```

## Key Features & Modules
- **Manufacturing Management**: Products, materials, machines, orders, quotes
- **FrontDesk Communication Hub**: Unified messaging (Gmail, WhatsApp, Internal)
- **Real-time Updates**: Socket.IO for messaging, SignalR for other real-time features
- **Authentication**: OAuth for external providers, JWT for internal
- **Financial Management**: Invoices, payments, reports, accounting
- **Production Tracking**: Jobs, production floor, machine monitoring
- **Customer Management**: Clients, suppliers, partners
- **Reporting**: Comprehensive business intelligence and analytics

## Configuration
- **Import Alias**: `@/` → `./src/` (always prefer alias)
- **Page Extensions**: `.page.tsx`, `.page.ts`, `.page.jsx`, `.page.js`
- **Environment**: Multiple server configurations (API, ERP, Messaging, Calculation)
- **Build**: Standalone output with bundle analyzer support

## Development Guidelines
- **New Route/Page**: `src/pages/**.page.tsx` (+ page-specific components in `pages-components/`)
- **Reusable UI**: `components/`
- **Feature UI Composition**: `widgets/`
- **Global State**: `store/` (Recoil). Local view state stays in component
- **HTTP/Side Effects**: `services/` (never import UI from services)
- **Pure Domain Logic**: `lib/`. Small generic helpers → `utils/`
- **Contexts/Providers**: `providers/`