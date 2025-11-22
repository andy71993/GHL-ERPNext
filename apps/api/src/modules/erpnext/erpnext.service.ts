import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ErpnextResponse<T = any> {
  data: T;
  message?: string;
}

export interface ErpnextListResponse<T = any> {
  data: T[];
}

export interface ErpnextDocType {
  doctype: string;
  name?: string;
  [key: string]: any;
}

@Injectable()
export class ErpnextService {
  private readonly logger = new Logger(ErpnextService.name);
  private client: AxiosInstance;

  constructor(private configService: ConfigService) {
    const baseURL = this.configService.get<string>('ERPNEXT_URL');
    const apiKey = this.configService.get<string>('ERPNEXT_API_KEY');
    const apiSecret = this.configService.get<string>('ERPNEXT_API_SECRET');

    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `token ${apiKey}:${apiSecret}`,
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.logger.error(
          `ERPNext API Error: ${error.message}`,
          error.response?.data,
        );
        throw new HttpException(
          {
            message: 'ERPNext API Error',
            details: error.response?.data || error.message,
          },
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      },
    );
  }

  /**
   * Get a single document by doctype and name
   */
  async getDoc<T = any>(doctype: string, name: string): Promise<T> {
    const response = await this.client.get<ErpnextResponse<T>>(
      `/api/resource/${doctype}/${encodeURIComponent(name)}`,
    );
    return response.data.data;
  }

  /**
   * List documents with optional filters
   */
  async getList<T = any>(
    doctype: string,
    options?: {
      fields?: string[];
      filters?: Record<string, any>;
      orderBy?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<T[]> {
    const params: Record<string, any> = {};

    if (options?.fields) {
      params.fields = JSON.stringify(options.fields);
    }
    if (options?.filters) {
      params.filters = JSON.stringify(options.filters);
    }
    if (options?.orderBy) {
      params.order_by = options.orderBy;
    }
    if (options?.limit) {
      params.limit_page_length = options.limit;
    }
    if (options?.offset) {
      params.limit_start = options.offset;
    }

    const response = await this.client.get<ErpnextListResponse<T>>(
      `/api/resource/${doctype}`,
      { params },
    );
    return response.data.data;
  }

  /**
   * Create a new document
   */
  async createDoc<T = any>(doctype: string, data: Partial<T>): Promise<T> {
    const response = await this.client.post<ErpnextResponse<T>>(
      `/api/resource/${doctype}`,
      data,
    );
    return response.data.data;
  }

  /**
   * Update an existing document
   */
  async updateDoc<T = any>(
    doctype: string,
    name: string,
    data: Partial<T>,
  ): Promise<T> {
    const response = await this.client.put<ErpnextResponse<T>>(
      `/api/resource/${doctype}/${encodeURIComponent(name)}`,
      data,
    );
    return response.data.data;
  }

  /**
   * Delete a document
   */
  async deleteDoc(doctype: string, name: string): Promise<void> {
    await this.client.delete(
      `/api/resource/${doctype}/${encodeURIComponent(name)}`,
    );
  }

  /**
   * Call a whitelisted ERPNext method
   */
  async call<T = any>(
    method: string,
    params?: Record<string, any>,
  ): Promise<T> {
    const response = await this.client.post<ErpnextResponse<T>>(
      `/api/method/${method}`,
      params,
    );
    return response.data.data ?? (response.data.message as T);
  }

  /**
   * Get count of documents
   */
  async getCount(
    doctype: string,
    filters?: Record<string, any>,
  ): Promise<number> {
    const response = await this.call<number>(
      'frappe.client.get_count',
      {
        doctype,
        filters: filters ? JSON.stringify(filters) : undefined,
      },
    );
    return response;
  }

  /**
   * Check connection to ERPNext
   */
  async checkConnection(): Promise<boolean> {
    try {
      await this.call('frappe.auth.get_logged_user');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get logged in user info
   */
  async getLoggedUser(): Promise<string> {
    return this.call<string>('frappe.auth.get_logged_user');
  }
}
