# MetroBNB Web Frontend

A modern Nuxt 3 frontend application for MetroBNB property management platform.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 📦 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `API_BASE_URL=https://your-api-domain.com`
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run generate  # For static deployment
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

- `API_BASE_URL` - Backend API URL
- `NUXT_DEVTOOLS` - Enable/disable dev tools

## 🏗️ Tech Stack

- **Framework**: Nuxt 3
- **UI Library**: Nuxt UI
- **Styling**: TailwindCSS
- **State Management**: Pinia
- **Language**: TypeScript

## 📁 Project Structure

```
├── components/          # Reusable Vue components
├── composables/         # Composable functions
├── pages/              # File-based routing
├── stores/             # Pinia stores
├── types/              # TypeScript definitions
└── assets/             # Static assets
```

## 🔗 API Integration

The app connects to MetroBNB backend API. See `composables/api.ts` for endpoint definitions.

## 📱 Features

- Partner management
- Booking tracking
- Expense management
- Invoice generation
- Dashboard analytics
- Responsive design