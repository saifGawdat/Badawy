# Badawi Portfolio & Medical Management System

A high-end, premium medical portfolio and admin dashboard for plastic surgery clinics. Built with Next.js 15, TypeScript, and Prisma.

## 🌟 Key Features

- **Premium UI/UX**: Designed with smooth animations (Framer Motion) and high-end aesthetics.
- **Dynamic Content**: Manage Hero slides, About section, Blog, and Before/After galleries via a secure admin dashboard.
- **Multi-Language Support**: Full support for English and Arabic (RTL) across the entire platform.
- **Appointment Management**: Integrated system for handling patient appointment requests.
- **Optimized Media**: Client-side image compression and Cloudinary integration for lightning-fast performance.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Badawy/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env` and fill in your credentials.
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database**:
   Generate the Prisma client and push the schema to your database.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **(Optional) Seed Data**:
   Populate your database with initial sample data.
   ```bash
   npx prisma db seed
   ```

6. **Run Development Server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org) (App Router, Turbopack)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com), [Framer Motion](https://www.framer.com/motion/)
- **Database / ORM**: [Prisma](https://www.prisma.io), [PostgreSQL](https://www.postgresql.org)
- **Media**: [Cloudinary](https://cloudinary.com)
- **Icons**: [Lucide React](https://lucide.dev)

## 📁 Architecture

- `src/app/api`: Serverless API routes with centralized error handling and auth HOCs. See [API Documentation](docs/api.md) for details.
- `src/components/sections`: Landing page modular sections.
- `src/components/ui`: Reusable high-end UI components (Glass cards, Sidebars, etc.).
- `src/context`: Auth, Language, and Global state management.
- `src/lib`: Core utilities (Prisma client, Cloudinary helper, compression logic).

## 📄 License

This project is private and for internal use only.
