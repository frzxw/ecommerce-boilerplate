# E-commerce Boilerplate

A full-stack e-commerce starter built with Next.js, NestJS, Prisma and PostgreSQL: a storefront, a REST API that
covers the whole order flow, and Docker for everything.

## What is included

**API** (NestJS 11, 16 Prisma models, OpenAPI docs via Swagger):

| Area | Modules |
| --- | --- |
| Catalogue | products, categories, reviews, wishlist |
| Buying | cart, coupons, promotions, orders, payments |
| Delivery | addresses, locations, shipping, shipments |
| Accounts | auth (JWT with Passport, bcrypt), users |
| Content | articles |

Requests are validated with class-validator and rate-limited with the NestJS throttler. Seed data comes from Faker.

**Storefront** (Next.js 16, Tailwind CSS 4): home, product list and detail, checkout with a success page, account,
login and register, a journal (blog) with article pages, about, contact, and policy pages (privacy, terms, shipping and
returns, size guide).

## Tech Stack

### Frontend
- **Next.js 16** - React framework
- **Tailwind CSS 4** - Utility-first CSS
- **TypeScript** - Type safety

### Backend
- **NestJS 11** - Node.js framework
- **Prisma 7** - Database ORM
- **PostgreSQL 15** - Database

### DevOps
- **Docker & Docker Compose** - Containerization
- **ESLint** - Code linting

## Project Structure

```
ecommerce-boilerplate/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend API
├── specs/             # Project specifications and documentation
├── agents/            # AI agent definitions
├── docker-compose.yml # Docker services orchestration
└── setup.ps1         # Automated setup script
```

## Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- [Node.js 20+](https://nodejs.org/) (for local development)
- [Git](https://git-scm.com/)

### Automated Setup (Recommended)

Run the setup script in PowerShell:

```powershell
.\setup.ps1
```

This script will:
- Check Docker status
- Create environment files
- Start PostgreSQL database
- Install backend dependencies
- Generate Prisma client
- Run database migrations

### Manual Setup

1. **Create environment files**
   ```bash
   # Backend
   copy backend\.env.example backend\.env
   
   # Frontend
   copy frontend\.env.example frontend\.env
   ```

2. **Start database only**
   ```bash
   docker-compose up -d db
   ```

3. **Setup Prisma (from backend folder)**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   cd ..
   ```

4. **Start all services**
   ```bash
   docker-compose up --build
   ```

## Development

### Start All Services with Docker
```bash
docker-compose up
```

### Start Individual Services Locally

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Documentation (Swagger):** http://localhost:3001/api
- **Database:** localhost:5432
  - User: `postgres`
  - Password: `postgres`
  - Database: `ecommerce`

## Database Management

### View Data with Prisma Studio
```bash
cd backend
npx prisma studio
```

### Create New Migration
```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

### Reset Database (Development Only)
```bash
cd backend
npx prisma migrate reset
```

## Docker Commands

### Build and Start
```bash
docker-compose up --build
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes (Clean Slate)
```bash
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db
```

## Database Schema

The boilerplate includes a comprehensive e-commerce schema:

- **Users** - User accounts with roles (CUSTOMER/ADMIN/SELLER)
- **Addresses** - User shipping addresses
- **Categories** - Hierarchical product categories
- **Products** - Product catalog with variants
- **Product Variants** - SKU, price, stock for product variations
- **Articles** - Blog/Content management
- **Cart** - Shopping cart functionality
- **Orders** - Order management
- **Payments** - Payment tracking (Stripe/Midtrans)
- **Shipments** - Shipping tracking

See `backend/prisma/schema.prisma` for the complete schema.

## Project Documentation

Detailed documentation available in the `specs/` folder:

- `product-requirements.md` - Product requirements and features
- `tech-stacks.md` - Technology stack details
- `database-api-specifications.md` - API and database design
- `infrastructure-guide.md` - Infrastructure setup
- `ci-cd-plan.md` - CI/CD pipeline configuration
- `style-guide.md` - Code style guidelines
- `non-functional-requirements.md` - Performance, security, etc.
- `checklists.md` - Development checklists

## Troubleshooting

### "package.json not found" Error
- Ensure you're running `docker-compose` from the project root
- Verify `frontend/package.json` and `backend/package.json` exist

### Prisma Migration Errors
- Ensure database is running: `docker-compose up -d db`
- Wait a few seconds for database to initialize
- Run migrations: `cd backend && npx prisma migrate deploy`

### Port Already in Use
- Frontend (3000), Backend (3001), or Database (5432) ports may be in use
- Stop conflicting services or change ports in `docker-compose.yml`

### Docker Build Fails
- Clear Docker cache: `docker system prune -a`
- Rebuild: `docker-compose build --no-cache`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT
