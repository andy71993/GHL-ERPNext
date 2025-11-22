# GHL-ERPNext

> HR, Payroll & Accounting for GoHighLevel - Powered by ERPNext

A GoHighLevel embedded application that provides enterprise-grade HR, Payroll, and Accounting functionality using ERPNext as the backend engine.

## Features

### HR Management
- Employee directory with search and filters
- Attendance tracking with visual calendar
- Leave management with approval workflow
- Sync team members from GHL automatically

### Payroll
- Salary structure configuration
- Generate salary slips
- Batch payroll processing
- Pay stub generation

### Accounting
- Chart of accounts
- Sales & purchase invoices
- Payment tracking (syncs from GHL payments)
- Financial reports (P&L, Balance Sheet)

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker (for local ERPNext)
- GHL account with API access

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/ghl-erpnext.git
cd ghl-erpnext

# Install dependencies
pnpm install

# Set up ERPNext (Docker)
./scripts/setup-erpnext.sh

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development
pnpm dev
```

### Access

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/docs
- **ERPNext**: http://localhost:8000 (admin/admin)

## Documentation

See [CLAUDE.md](./CLAUDE.md) for comprehensive documentation including:
- Architecture overview
- API reference
- ERPNext configuration
- GHL Marketplace conversion guide
- Deployment instructions

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: NestJS, TypeScript
- **ERP Engine**: ERPNext (Frappe Cloud)
- **CRM**: GoHighLevel API
- **Containerization**: Docker

## Project Structure

```
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React frontend
├── scripts/          # Setup scripts
├── docker-compose.yml
├── CLAUDE.md         # Full documentation
└── README.md
```

## Screenshots

*(Add screenshots of your dashboards here)*

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
