import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErpnextService } from './erpnext.service';

@ApiTags('erpnext')
@Controller('erpnext')
export class ErpnextController {
  constructor(private readonly erpnextService: ErpnextService) {}

  @Get('status')
  @ApiOperation({ summary: 'Check ERPNext connection status' })
  @ApiResponse({ status: 200, description: 'Connection status' })
  async getStatus() {
    const isConnected = await this.erpnextService.checkConnection();
    let user = null;

    if (isConnected) {
      user = await this.erpnextService.getLoggedUser();
    }

    return {
      connected: isConnected,
      user,
      timestamp: new Date().toISOString(),
    };
  }
}
