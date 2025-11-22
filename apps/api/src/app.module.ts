import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { GhlModule } from './modules/ghl/ghl.module';
import { ErpnextModule } from './modules/erpnext/erpnext.module';
import { HrModule } from './modules/hr/hr.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    HealthModule,
    GhlModule,
    ErpnextModule,
    HrModule,
    PayrollModule,
    AccountingModule,
    WebhooksModule,
  ],
})
export class AppModule {}
