import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ErpnextService } from './erpnext.service';
import { ErpnextController } from './erpnext.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [ErpnextController],
  providers: [ErpnextService],
  exports: [ErpnextService],
})
export class ErpnextModule {}
