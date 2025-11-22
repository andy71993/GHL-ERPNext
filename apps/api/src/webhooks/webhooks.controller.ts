import { Controller, Post, Body, Headers, HttpCode, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { WebhooksService, GhlWebhookPayload } from './webhooks.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('ghl')
  @HttpCode(200)
  @ApiOperation({ summary: 'Receive GHL webhooks' })
  @ApiHeader({ name: 'x-ghl-signature', required: false })
  async handleGhlWebhook(
    @Body() payload: GhlWebhookPayload,
    @Headers('x-ghl-signature') signature?: string,
  ) {
    this.logger.log(`Received GHL webhook: ${payload.type}`);

    // TODO: Verify webhook signature for security
    // if (signature) {
    //   const isValid = this.verifySignature(payload, signature);
    //   if (!isValid) {
    //     throw new UnauthorizedException('Invalid webhook signature');
    //   }
    // }

    // Process webhook asynchronously
    this.webhooksService.processWebhook(payload).catch((error) => {
      this.logger.error(`Webhook processing failed: ${error.message}`);
    });

    // Return immediately to acknowledge receipt
    return { received: true };
  }

  @Post('test')
  @HttpCode(200)
  @ApiOperation({ summary: 'Test webhook endpoint' })
  async testWebhook(@Body() payload: any) {
    this.logger.log(`Test webhook received: ${JSON.stringify(payload)}`);
    return { received: true, payload };
  }
}
