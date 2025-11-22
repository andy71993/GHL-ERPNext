import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GhlService } from './ghl.service';
import { GhlController } from './ghl.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [GhlController],
  providers: [GhlService],
  exports: [GhlService],
})
export class GhlModule {}
