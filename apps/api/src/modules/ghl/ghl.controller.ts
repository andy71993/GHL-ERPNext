import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GhlService } from './ghl.service';

@ApiTags('ghl')
@Controller('ghl')
export class GhlController {
  constructor(private readonly ghlService: GhlService) {}

  @Get('status')
  @ApiOperation({ summary: 'Check GHL connection status' })
  @ApiResponse({ status: 200, description: 'Connection status' })
  async getStatus() {
    const isConnected = await this.ghlService.checkConnection();
    let location = null;

    if (isConnected) {
      location = await this.ghlService.getLocation();
    }

    return {
      connected: isConnected,
      locationId: this.ghlService.getLocationId(),
      locationName: location?.name,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('contacts')
  @ApiOperation({ summary: 'List GHL contacts' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of contacts' })
  async getContacts(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('query') query?: string,
  ) {
    return this.ghlService.getContacts({ limit, offset, query });
  }

  @Get('users')
  @ApiOperation({ summary: 'List GHL team members' })
  @ApiResponse({ status: 200, description: 'List of team members' })
  async getUsers() {
    const users = await this.ghlService.getUsers();
    return { users, total: users.length };
  }

  @Get('location')
  @ApiOperation({ summary: 'Get current location details' })
  @ApiResponse({ status: 200, description: 'Location details' })
  async getLocation() {
    return this.ghlService.getLocation();
  }
}
