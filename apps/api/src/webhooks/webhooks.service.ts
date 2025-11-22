import { Injectable, Logger } from '@nestjs/common';
import { EmployeeService } from '../modules/hr/services/employee.service';
import { AccountingService } from '../modules/accounting/accounting.service';

export interface GhlWebhookPayload {
  type: string;
  locationId: string;
  id?: string;
  [key: string]: any;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private employeeService: EmployeeService,
  ) {}

  /**
   * Process incoming GHL webhook
   */
  async processWebhook(payload: GhlWebhookPayload): Promise<void> {
    this.logger.log(`Processing webhook: ${payload.type}`);

    switch (payload.type) {
      // User/Team webhooks
      case 'UserCreated':
        await this.handleUserCreated(payload);
        break;
      case 'UserUpdated':
        await this.handleUserUpdated(payload);
        break;
      case 'UserDeleted':
        await this.handleUserDeleted(payload);
        break;

      // Contact webhooks
      case 'ContactCreated':
        await this.handleContactCreated(payload);
        break;
      case 'ContactUpdated':
        await this.handleContactUpdated(payload);
        break;

      // Payment webhooks
      case 'PaymentReceived':
        await this.handlePaymentReceived(payload);
        break;

      // Appointment webhooks
      case 'AppointmentCreated':
        await this.handleAppointmentCreated(payload);
        break;

      default:
        this.logger.warn(`Unhandled webhook type: ${payload.type}`);
    }
  }

  /**
   * Handle new GHL user → Create ERPNext employee
   */
  private async handleUserCreated(payload: GhlWebhookPayload): Promise<void> {
    this.logger.log(`Creating employee for GHL user: ${payload.id}`);

    // Extract user data from webhook
    const userData = {
      id: payload.id || payload.userId,
      firstName: payload.firstName || payload.first_name || '',
      lastName: payload.lastName || payload.last_name || '',
      email: payload.email || '',
    };

    // TODO: Get company name from location mapping
    const company = 'Your Company'; // This should come from config/mapping

    try {
      await this.employeeService.syncFromGhlUser(
        userData,
        company,
        payload.locationId,
      );
      this.logger.log(`Employee created for GHL user: ${userData.email}`);
    } catch (error) {
      this.logger.error(`Failed to create employee: ${error}`);
    }
  }

  /**
   * Handle GHL user update → Update ERPNext employee
   */
  private async handleUserUpdated(payload: GhlWebhookPayload): Promise<void> {
    this.logger.log(`Updating employee for GHL user: ${payload.id}`);
    // Similar to handleUserCreated but updates existing
  }

  /**
   * Handle GHL user deletion → Deactivate ERPNext employee
   */
  private async handleUserDeleted(payload: GhlWebhookPayload): Promise<void> {
    this.logger.log(`Deactivating employee for GHL user: ${payload.id}`);
    // Mark employee as inactive in ERPNext
  }

  /**
   * Handle new GHL contact → Create ERPNext customer
   */
  private async handleContactCreated(payload: GhlWebhookPayload): Promise<void> {
    this.logger.log(`Creating customer for GHL contact: ${payload.id}`);
    // Create customer in ERPNext
  }

  /**
   * Handle GHL contact update → Update ERPNext customer
   */
  private async handleContactUpdated(payload: GhlWebhookPayload): Promise<void> {
    this.logger.log(`Updating customer for GHL contact: ${payload.id}`);
  }

  /**
   * Handle payment received in GHL → Create ERPNext payment entry
   */
  private async handlePaymentReceived(payload: GhlWebhookPayload): Promise<void> {
    this.logger.log(`Recording payment from GHL: ${payload.id}`);
    // Create payment entry in ERPNext
  }

  /**
   * Handle GHL appointment → Track for attendance/timesheet
   */
  private async handleAppointmentCreated(payload: GhlWebhookPayload): Promise<void> {
    this.logger.log(`Processing appointment: ${payload.id}`);
    // Can be used for attendance or timesheet tracking
  }
}
