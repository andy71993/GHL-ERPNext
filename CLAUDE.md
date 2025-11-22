# GHL-ERPNext Integration

A GoHighLevel embedded app that provides HR, Payroll, and Accounting functionality powered by ERPNext.

## Project Overview

This project is an embedded application for GoHighLevel (GHL) that extends its capabilities with enterprise-grade HR, Payroll, and Accounting features from ERPNext.

### Target Users
- GHL Agency owners who need back-office functionality
- Eventually: GHL Marketplace as a SaaS product

### Current Status
**Development Phase** - Building for single GHL account testing before marketplace release.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GoHighLevel                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Embedded App (iframe)                       │    │
│  │          React + TypeScript + Tailwind                   │    │
│  └──────────────────────┬──────────────────────────────────┘    │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NestJS API Server                             │
│    ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌─────────────┐     │
│    │   GHL   │  │   HR    │  │ Payroll  │  │ Accounting  │     │
│    │ Module  │  │ Module  │  │  Module  │  │   Module    │     │
│    └────┬────┘  └────┬────┘  └────┬─────┘  └──────┬──────┘     │
└─────────┼────────────┼───────────┼────────────────┼─────────────┘
          │            │           │                │
          │            └───────────┴────────────────┘
          │                        │
          ▼                        ▼
┌─────────────────┐    ┌─────────────────────────────────────────┐
│   GHL API       │    │              ERPNext                     │
│   (External)    │    │    HR │ Payroll │ Accounting Modules    │
└─────────────────┘    │         (Frappe Cloud / Self-hosted)    │
                       └─────────────────────────────────────────┘
```

---

## Project Structure

```
GHL-ERPNext/
├── apps/
│   ├── api/                    # NestJS Backend API
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── modules/
│   │   │   │   ├── ghl/        # GoHighLevel integration
│   │   │   │   ├── erpnext/    # ERPNext API client
│   │   │   │   ├── hr/         # HR management
│   │   │   │   ├── payroll/    # Payroll management
│   │   │   │   ├── accounting/ # Accounting & Finance
│   │   │   │   └── health/     # Health checks
│   │   │   └── webhooks/       # GHL webhook handlers
│   │   └── package.json
│   │
│   └── web/                    # React Frontend
│       ├── src/
│       │   ├── components/     # Shared UI components
│       │   ├── pages/
│       │   │   ├── hr/         # HR Dashboard, Employees, etc.
│       │   │   ├── payroll/    # Payroll Dashboard
│       │   │   └── accounting/ # Accounting Dashboard
│       │   ├── services/       # API client
│       │   └── hooks/          # React Query hooks
│       └── package.json
│
├── scripts/
│   └── setup-erpnext.sh       # ERPNext Docker setup
│
├── docker-compose.yml          # Production Docker setup
├── docker-compose.dev.yml      # Development Docker setup
├── package.json                # Monorepo root
├── pnpm-workspace.yaml
├── .env.example
├── CLAUDE.md                   # This file
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI Components | Headless UI, Heroicons, Framer Motion |
| State Management | Zustand, TanStack Query |
| Charts | Recharts |
| Backend | NestJS, TypeScript |
| API | REST, Swagger/OpenAPI |
| ERP Backend | ERPNext (Frappe Cloud) |
| CRM Integration | GoHighLevel API |
| Database | MariaDB (via ERPNext) |
| Containerization | Docker |

---

## Key Modules

### 1. HR Module (`apps/api/src/modules/hr/`)
- **Employee Management**: CRUD for employees, sync from GHL users
- **Attendance**: Daily attendance tracking, bulk marking
- **Leave Management**: Leave applications, approvals, balances

### 2. Payroll Module (`apps/api/src/modules/payroll/`)
- **Salary Structures**: Define pay components
- **Salary Slips**: Generate and manage pay stubs
- **Payroll Entry**: Batch payroll processing

### 3. Accounting Module (`apps/api/src/modules/accounting/`)
- **Chart of Accounts**: Account hierarchy
- **Sales Invoices**: Customer billing
- **Purchase Invoices**: Expense tracking
- **Payment Entries**: Payment recording (syncs from GHL payments)
- **Journal Entries**: Manual adjustments

### 4. GHL Module (`apps/api/src/modules/ghl/`)
- **Contacts**: Sync to ERPNext customers/suppliers
- **Users**: Sync to ERPNext employees
- **Payments**: Sync to ERPNext payment entries
- **Location**: Maps to ERPNext company

---

## Data Sync Map

| GHL Entity | ERPNext Entity | Direction |
|------------|----------------|-----------|
| Location | Company | GHL → ERPNext |
| Users/Team | Employee | GHL → ERPNext |
| Contacts (Customers) | Customer | GHL → ERPNext |
| Contacts (Vendors) | Supplier | GHL → ERPNext |
| Payments Received | Payment Entry | GHL → ERPNext |
| Products | Item | Bidirectional |

---

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- GHL API Key
- ERPNext instance (local Docker or Frappe Cloud)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up ERPNext (Local Docker)

```bash
chmod +x scripts/setup-erpnext.sh
./scripts/setup-erpnext.sh
```

Or manually:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

Wait for ERPNext at http://localhost:8000 (admin/admin)

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# GHL
GHL_API_KEY=your_ghl_api_key
GHL_LOCATION_ID=your_location_id

# ERPNext
ERPNEXT_URL=http://localhost:8000
ERPNEXT_API_KEY=your_api_key
ERPNEXT_API_SECRET=your_api_secret
```

### 4. Start Development Servers

```bash
# Start both API and frontend
pnpm dev

# Or separately
pnpm dev:api    # Backend on http://localhost:3001
pnpm dev:web    # Frontend on http://localhost:5173
```

### 5. Set Up GHL Embed

1. Go to GHL → Settings → Custom Menu Links
2. Add new link:
   - Name: "HR & Payroll"
   - URL: `http://localhost:5173` (dev) or your production URL
   - Icon: Choose appropriate icon

---

## API Documentation

Swagger docs available at: `http://localhost:3001/docs`

### Key Endpoints

```
# Health
GET  /api/health
GET  /api/health/ready

# GHL Integration
GET  /api/ghl/status
GET  /api/ghl/contacts
GET  /api/ghl/users

# ERPNext Status
GET  /api/erpnext/status

# HR
GET  /api/hr/dashboard
GET  /api/hr/employees
POST /api/hr/employees
GET  /api/hr/attendance
POST /api/hr/attendance
GET  /api/hr/leaves
POST /api/hr/leaves
POST /api/hr/leaves/:id/approve

# Payroll
GET  /api/payroll/dashboard
GET  /api/payroll/salary-slips
POST /api/payroll/salary-slips
GET  /api/payroll/entries

# Accounting
GET  /api/accounting/dashboard
GET  /api/accounting/accounts
GET  /api/accounting/sales-invoices
GET  /api/accounting/payments

# Webhooks
POST /api/webhooks/ghl
```

---

## ERPNext Configuration

### Required ERPNext Apps
- **ERPNext** (core)
- **HRMS** (HR & Payroll modules)

### Custom Fields (Optional)
Add these to track GHL references:

**Employee DocType:**
- `ghl_user_id` (Data)
- `ghl_location_id` (Data)

**Customer DocType:**
- `ghl_contact_id` (Data)

### API User Setup
1. Go to ERPNext → Settings → Users
2. Select API user or create new
3. Go to "API Access" section
4. Generate API Key and Secret
5. Grant roles: HR Manager, Payroll Manager, Accounts Manager

---

## GHL Webhook Setup

For real-time sync, configure GHL webhooks to point to your API:

```
Webhook URL: https://your-api.com/api/webhooks/ghl

Events to subscribe:
- ContactCreated
- ContactUpdated
- UserCreated
- UserUpdated
- PaymentReceived
- AppointmentCreated
```

---

## Converting to GHL Marketplace App

When ready to publish to GHL Marketplace, follow these steps:

### 1. Register as GHL Marketplace Developer

1. Go to https://marketplace.gohighlevel.com/
2. Apply for developer access
3. Wait for approval (may take a few days)

### 2. Create Marketplace App

1. In GHL Developer Portal, create new app
2. Configure OAuth settings:
   - Redirect URI: `https://your-api.com/auth/ghl/callback`
   - Scopes needed:
     - `contacts.readonly`
     - `contacts.write`
     - `users.readonly`
     - `locations.readonly`
     - `payments.readonly`
     - `calendars.readonly`

3. Note your:
   - Client ID
   - Client Secret

### 3. Implement OAuth Flow

Update `apps/api/src/modules/ghl/`:

```typescript
// ghl-auth.service.ts
@Injectable()
export class GhlAuthService {
  private readonly clientId = process.env.GHL_CLIENT_ID;
  private readonly clientSecret = process.env.GHL_CLIENT_SECRET;
  private readonly redirectUri = process.env.GHL_REDIRECT_URI;

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'contacts.readonly users.readonly locations.readonly',
      state,
    });
    return `https://marketplace.gohighlevel.com/oauth/authorize?${params}`;
  }

  async exchangeCode(code: string): Promise<TokenResponse> {
    const response = await axios.post(
      'https://services.leadconnectorhq.com/oauth/token',
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      }
    );
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await axios.post(
      'https://services.leadconnectorhq.com/oauth/token',
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }
    );
    return response.data;
  }
}
```

### 4. Multi-Tenant Database

For SaaS, each GHL location needs isolated data. Options:

**Option A: ERPNext Multi-Company**
- 1 ERPNext company per GHL location
- Simpler, but shared ERPNext instance

**Option B: Separate ERPNext Sites**
- 1 ERPNext site per customer
- More isolation, but complex

**Option C: Custom Multi-Tenant Layer**
- Store tenant mapping in your API
- Route requests to appropriate ERPNext

### 5. Subscription & Billing

Implement Stripe subscription:

```typescript
// subscription.service.ts
@Injectable()
export class SubscriptionService {
  async createSubscription(locationId: string, planId: string) {
    // Create Stripe subscription
    // Store subscription in database
    // Provision ERPNext company
  }

  async cancelSubscription(locationId: string) {
    // Cancel Stripe subscription
    // Disable access
  }
}
```

### 6. App Listing Requirements

GHL Marketplace requires:
- App icon (512x512)
- Screenshots (1280x720)
- Description & features
- Pricing tiers
- Support contact
- Privacy policy URL
- Terms of service URL

### 7. Environment Variables for Production

```env
# OAuth
GHL_CLIENT_ID=your_client_id
GHL_CLIENT_SECRET=your_client_secret
GHL_REDIRECT_URI=https://your-app.com/auth/ghl/callback

# Database for tenant storage
DATABASE_URL=postgresql://user:pass@host:5432/ghl_erpnext

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# ERPNext (for multi-tenant, this might be dynamic)
ERPNEXT_URL=https://your-site.frappe.cloud
```

---

## Deployment

### Recommended Hosting

| Component | Recommended Platform | Alternative |
|-----------|---------------------|-------------|
| Frontend | Vercel | Netlify, Railway |
| API | Railway | Render, DigitalOcean |
| ERPNext | Frappe Cloud | Self-hosted |
| Database | Included in ERPNext | - |

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Environment Setup on Railway

Set all environment variables from `.env.example` in Railway dashboard.

---

## Common Tasks

### Adding a New ERPNext DocType Integration

1. Create service in appropriate module:
```typescript
// apps/api/src/modules/hr/services/new-doctype.service.ts
@Injectable()
export class NewDoctypeService {
  constructor(private erpnext: ErpnextService) {}

  async getAll(): Promise<any[]> {
    return this.erpnext.getList('New Doctype', { fields: ['name', ...] });
  }
}
```

2. Add to module providers
3. Create controller endpoints
4. Add frontend API calls and hooks

### Syncing GHL Data

```typescript
// To sync a GHL contact to ERPNext customer
await customerService.syncFromGhlContact(ghlContact, company);

// To sync a GHL user to ERPNext employee
await employeeService.syncFromGhlUser(ghlUser, company, locationId);
```

---

## Testing

### API Testing
```bash
cd apps/api
pnpm test
pnpm test:e2e
```

### Frontend Testing
```bash
cd apps/web
pnpm test
```

### Integration Testing
Use the Swagger docs at `/docs` to test API endpoints manually.

---

## Troubleshooting

### ERPNext Connection Failed
1. Check ERPNext URL in `.env`
2. Verify API credentials
3. Check if ERPNext is running: `curl http://localhost:8000/api/method/frappe.ping`

### GHL API Errors
1. Verify API key is valid
2. Check location ID is correct
3. Ensure API version header is set (Version: 2021-07-28)

### Docker Issues
```bash
# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Reset everything
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

---

## Production Checklist

Before deploying to production, implement these critical features:

### 1. Security

#### Webhook Signature Verification
```typescript
// apps/api/src/webhooks/webhooks.controller.ts
import * as crypto from 'crypto';

private verifyGhlSignature(payload: any, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.GHL_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

#### Rate Limiting
```bash
pnpm add @nestjs/throttler
```
```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,  // 1 minute
      limit: 100,  // 100 requests per minute
    }]),
  ],
})
```

#### CORS Configuration
```typescript
// main.ts - restrict to your domains
app.enableCors({
  origin: [
    'https://your-app.com',
    'https://app.gohighlevel.com',
  ],
  credentials: true,
});
```

#### Helmet Security Headers
```bash
pnpm add helmet
```
```typescript
import helmet from 'helmet';
app.use(helmet());
```

### 2. Message Queue (Reliable Webhook Processing)

```bash
pnpm add @nestjs/bullmq bullmq
```

```typescript
// webhooks/webhooks.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('ghl-webhooks')
export class WebhooksProcessor extends WorkerHost {
  async process(job: Job<GhlWebhookPayload>) {
    const { type, data } = job.data;

    switch (type) {
      case 'ContactCreated':
        await this.syncContact(data);
        break;
      // ... handle other events
    }
  }
}

// webhooks.controller.ts - queue instead of direct processing
@Post('ghl')
async handleWebhook(@Body() payload: GhlWebhookPayload) {
  await this.webhookQueue.add('process', payload, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  });
  return { received: true };
}
```

### 3. Database for Tenant Management

```bash
pnpm add @prisma/client prisma
```

```prisma
// prisma/schema.prisma
model Tenant {
  id              String   @id @default(uuid())
  ghlLocationId   String   @unique
  ghlAccessToken  String   // encrypted
  ghlRefreshToken String   // encrypted
  erpnextCompany  String
  erpnextUrl      String?  // if using separate ERPNext instances
  stripeCustomerId String?
  subscriptionStatus String @default("trial")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model WebhookLog {
  id        String   @id @default(uuid())
  tenantId  String
  eventType String
  payload   Json
  status    String   // pending, processed, failed
  error     String?
  createdAt DateTime @default(now())
}
```

### 4. Error Handling & Logging

```bash
pnpm add @nestjs/terminus winston nest-winston
```

```typescript
// common/filters/http-exception.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error({
      statusCode: status,
      path: request.url,
      method: request.method,
      message: exception instanceof Error ? exception.message : 'Unknown error',
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'An error occurred',
    });
  }
}
```

### 5. Monitoring & Observability

```typescript
// Health checks with detailed status
@Get('health/detailed')
async detailedHealth() {
  const [erpnext, ghl, redis, db] = await Promise.allSettled([
    this.erpnextService.checkConnection(),
    this.ghlService.checkConnection(),
    this.redis.ping(),
    this.prisma.$queryRaw`SELECT 1`,
  ]);

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      erpnext: erpnext.status === 'fulfilled' && erpnext.value,
      ghl: ghl.status === 'fulfilled' && ghl.value,
      redis: redis.status === 'fulfilled',
      database: db.status === 'fulfilled',
    },
  };
}
```

Consider adding:
- **Sentry** for error tracking
- **Datadog/New Relic** for APM
- **Prometheus + Grafana** for metrics

### 6. Token Refresh Handling

```typescript
// ghl.service.ts - auto-refresh expired tokens
async makeAuthenticatedRequest(tenantId: string, requestFn: () => Promise<any>) {
  try {
    return await requestFn();
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired, refresh it
      const tenant = await this.tenantService.get(tenantId);
      const newTokens = await this.authService.refreshToken(tenant.ghlRefreshToken);
      await this.tenantService.updateTokens(tenantId, newTokens);

      // Retry the request
      return await requestFn();
    }
    throw error;
  }
}
```

### 7. Environment Variables (Production)

```env
# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-app.com

# Security
JWT_SECRET=use-a-strong-random-secret-min-32-chars
ENCRYPTION_KEY=32-char-key-for-encrypting-tokens
GHL_WEBHOOK_SECRET=your-webhook-secret

# GHL OAuth (Marketplace)
GHL_CLIENT_ID=your_client_id
GHL_CLIENT_SECRET=your_client_secret
GHL_REDIRECT_URI=https://your-api.com/auth/ghl/callback

# ERPNext
ERPNEXT_URL=https://your-site.frappe.cloud
ERPNEXT_API_KEY=your_api_key
ERPNEXT_API_SECRET=your_api_secret

# Database (for tenant management)
DATABASE_URL=postgresql://user:pass@host:5432/ghl_erpnext

# Redis (for queues & caching)
REDIS_URL=redis://localhost:6379

# Stripe (billing)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID_BASIC=price_xxx
STRIPE_PRICE_ID_PRO=price_xxx

# Monitoring (optional)
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 8. Pre-Launch Checklist

- [ ] Webhook signature verification implemented
- [ ] Rate limiting configured
- [ ] CORS restricted to allowed origins
- [ ] Helmet security headers enabled
- [ ] Message queue for webhook processing
- [ ] Database migrations run
- [ ] Token refresh logic implemented
- [ ] Error tracking (Sentry) configured
- [ ] Health check endpoints working
- [ ] SSL/TLS configured
- [ ] Environment variables secured
- [ ] Backup strategy for database
- [ ] Monitoring/alerting set up
- [ ] Load testing completed
- [ ] Security audit completed

---

## Testing Guide

### Quick Test (No ERPNext Required)

Test the API structure and frontend without external dependencies:

```bash
# 1. Install dependencies
pnpm install

# 2. Start API (will show connection errors but endpoints work)
cd apps/api && pnpm dev

# 3. In another terminal, start frontend
cd apps/web && pnpm dev

# 4. Test health endpoint
curl http://localhost:3001/api/health

# 5. View Swagger docs
open http://localhost:3001/docs

# 6. View frontend
open http://localhost:5173
```

### Full Integration Test

```bash
# 1. Start ERPNext locally
./scripts/setup-erpnext.sh

# 2. Wait for ERPNext to be ready (check http://localhost:8000)

# 3. Configure .env with ERPNext credentials

# 4. Test ERPNext connection
curl http://localhost:3001/api/erpnext/status

# 5. Test GHL connection (requires valid API key)
curl http://localhost:3001/api/ghl/status

# 6. Test webhook endpoint
curl -X POST http://localhost:3001/api/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{"type": "ContactCreated", "id": "test123"}'
```

### Testing Webhooks Locally

Use ngrok to expose your local API:

```bash
# Install ngrok
brew install ngrok  # or download from ngrok.com

# Expose local API
ngrok http 3001

# Use the ngrok URL in GHL webhook settings
# https://xxxx.ngrok.io/api/webhooks/ghl
```

---

## Resources

- [ERPNext Documentation](https://docs.erpnext.com/)
- [ERPNext API Reference](https://frappeframework.com/docs/v14/user/en/api)
- [GHL API Documentation](https://highlevel.stoplight.io/)
- [GHL Marketplace Developer Guide](https://help.gohighlevel.com/support/solutions/articles/48001225571)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Query](https://tanstack.com/query/latest)

---

## License

MIT License - See LICENSE file for details.
