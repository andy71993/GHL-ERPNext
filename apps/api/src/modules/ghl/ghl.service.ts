import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';

export interface GhlContact {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  tags?: string[];
  customFields?: Array<{ id: string; value: any }>;
  dateAdded?: string;
  dateUpdated?: string;
}

export interface GhlUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  permissions: any;
}

export interface GhlLocation {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone?: string;
}

@Injectable()
export class GhlService {
  private readonly logger = new Logger(GhlService.name);
  private client: AxiosInstance;
  private locationId: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GHL_API_KEY');
    this.locationId = this.configService.get<string>('GHL_LOCATION_ID') || '';

    this.client = axios.create({
      baseURL: 'https://services.leadconnectorhq.com',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Version: '2021-07-28',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.logger.error(
          `GHL API Error: ${error.message}`,
          error.response?.data,
        );
        throw new HttpException(
          {
            message: 'GHL API Error',
            details: error.response?.data || error.message,
          },
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      },
    );
  }

  /**
   * Set location ID for multi-tenant operations
   */
  setLocationId(locationId: string) {
    this.locationId = locationId;
  }

  /**
   * Get location ID
   */
  getLocationId(): string {
    return this.locationId;
  }

  // ==================== CONTACTS ====================

  /**
   * Get a single contact by ID
   */
  async getContact(contactId: string): Promise<GhlContact> {
    const response = await this.client.get(`/contacts/${contactId}`);
    return response.data.contact;
  }

  /**
   * List contacts with optional filters
   */
  async getContacts(options?: {
    limit?: number;
    offset?: number;
    query?: string;
  }): Promise<{ contacts: GhlContact[]; total: number }> {
    const params: Record<string, any> = {
      locationId: this.locationId,
      limit: options?.limit || 20,
      skip: options?.offset || 0,
    };

    if (options?.query) {
      params.query = options.query;
    }

    const response = await this.client.get('/contacts/', { params });
    return {
      contacts: response.data.contacts || [],
      total: response.data.total || 0,
    };
  }

  /**
   * Create a new contact
   */
  async createContact(data: Partial<GhlContact>): Promise<GhlContact> {
    const response = await this.client.post('/contacts/', {
      ...data,
      locationId: this.locationId,
    });
    return response.data.contact;
  }

  /**
   * Update a contact
   */
  async updateContact(
    contactId: string,
    data: Partial<GhlContact>,
  ): Promise<GhlContact> {
    const response = await this.client.put(`/contacts/${contactId}`, data);
    return response.data.contact;
  }

  // ==================== USERS/TEAM ====================

  /**
   * Get users (team members) for a location
   */
  async getUsers(): Promise<GhlUser[]> {
    const response = await this.client.get('/users/', {
      params: { locationId: this.locationId },
    });
    return response.data.users || [];
  }

  /**
   * Get a single user by ID
   */
  async getUser(userId: string): Promise<GhlUser> {
    const response = await this.client.get(`/users/${userId}`);
    return response.data;
  }

  // ==================== LOCATION ====================

  /**
   * Get location details
   */
  async getLocation(locationId?: string): Promise<GhlLocation> {
    const id = locationId || this.locationId;
    const response = await this.client.get(`/locations/${id}`);
    return response.data.location;
  }

  // ==================== CALENDARS ====================

  /**
   * Get calendars for the location
   */
  async getCalendars(): Promise<any[]> {
    const response = await this.client.get('/calendars/', {
      params: { locationId: this.locationId },
    });
    return response.data.calendars || [];
  }

  /**
   * Get appointments for a calendar
   */
  async getAppointments(
    calendarId: string,
    startDate: string,
    endDate: string,
  ): Promise<any[]> {
    const response = await this.client.get(`/calendars/${calendarId}/events`, {
      params: {
        locationId: this.locationId,
        startTime: startDate,
        endTime: endDate,
      },
    });
    return response.data.events || [];
  }

  // ==================== PAYMENTS ====================

  /**
   * Get transactions/payments
   */
  async getTransactions(options?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const params: Record<string, any> = {
      locationId: this.locationId,
      limit: options?.limit || 20,
      offset: options?.offset || 0,
    };

    if (options?.startDate) params.startAt = options.startDate;
    if (options?.endDate) params.endAt = options.endDate;

    const response = await this.client.get('/payments/transactions', { params });
    return response.data.transactions || [];
  }

  // ==================== CONNECTION CHECK ====================

  /**
   * Check connection to GHL
   */
  async checkConnection(): Promise<boolean> {
    try {
      await this.getLocation();
      return true;
    } catch {
      return false;
    }
  }
}
