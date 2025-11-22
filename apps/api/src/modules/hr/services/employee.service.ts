import { Injectable } from '@nestjs/common';
import { ErpnextService } from '../../erpnext/erpnext.service';

export interface Employee {
  name: string;
  employee_name: string;
  first_name: string;
  last_name?: string;
  gender?: string;
  date_of_birth?: string;
  date_of_joining: string;
  status: 'Active' | 'Inactive' | 'Left';
  company: string;
  department?: string;
  designation?: string;
  employment_type?: string;
  cell_number?: string;
  personal_email?: string;
  company_email?: string;
  user_id?: string;
  image?: string;
  // GHL integration fields (custom)
  ghl_user_id?: string;
  ghl_location_id?: string;
}

export interface CreateEmployeeDto {
  first_name: string;
  last_name?: string;
  gender?: string;
  date_of_birth?: string;
  date_of_joining: string;
  company: string;
  department?: string;
  designation?: string;
  employment_type?: string;
  cell_number?: string;
  personal_email?: string;
  company_email?: string;
  ghl_user_id?: string;
  ghl_location_id?: string;
}

@Injectable()
export class EmployeeService {
  constructor(private erpnext: ErpnextService) {}

  /**
   * Get all employees
   */
  async getAll(
    company?: string,
    options?: {
      status?: string;
      department?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<Employee[]> {
    const filters: Record<string, any> = {};

    if (company) filters.company = company;
    if (options?.status) filters.status = options.status;
    if (options?.department) filters.department = options.department;

    return this.erpnext.getList<Employee>('Employee', {
      fields: [
        'name',
        'employee_name',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'date_of_joining',
        'status',
        'company',
        'department',
        'designation',
        'employment_type',
        'cell_number',
        'personal_email',
        'company_email',
        'user_id',
        'image',
      ],
      filters,
      orderBy: 'employee_name asc',
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    });
  }

  /**
   * Get a single employee by ID
   */
  async getById(employeeId: string): Promise<Employee> {
    return this.erpnext.getDoc<Employee>('Employee', employeeId);
  }

  /**
   * Create a new employee
   */
  async create(data: CreateEmployeeDto): Promise<Employee> {
    return this.erpnext.createDoc<Employee>('Employee', data);
  }

  /**
   * Update an employee
   */
  async update(employeeId: string, data: Partial<Employee>): Promise<Employee> {
    return this.erpnext.updateDoc<Employee>('Employee', employeeId, data);
  }

  /**
   * Delete an employee
   */
  async delete(employeeId: string): Promise<void> {
    await this.erpnext.deleteDoc('Employee', employeeId);
  }

  /**
   * Get employee count
   */
  async getCount(
    company?: string,
    filters?: Record<string, any>,
  ): Promise<number> {
    const allFilters: Record<string, any> = { ...filters };
    if (company) allFilters.company = company;

    return this.erpnext.getCount('Employee', allFilters);
  }

  /**
   * Search employees by name or email
   */
  async search(query: string, company?: string): Promise<Employee[]> {
    const filters: Record<string, any> = {};
    if (company) filters.company = company;

    // ERPNext uses SQL-like filters
    filters.employee_name = ['like', `%${query}%`];

    return this.erpnext.getList<Employee>('Employee', {
      fields: [
        'name',
        'employee_name',
        'department',
        'designation',
        'status',
        'image',
      ],
      filters,
      limit: 20,
    });
  }

  /**
   * Sync employee from GHL user
   */
  async syncFromGhlUser(
    ghlUser: { id: string; firstName: string; lastName: string; email: string },
    company: string,
    locationId: string,
  ): Promise<Employee> {
    // Check if employee already exists
    const existing = await this.erpnext.getList<Employee>('Employee', {
      filters: { ghl_user_id: ghlUser.id },
      limit: 1,
    });

    if (existing.length > 0) {
      // Update existing
      return this.update(existing[0].name, {
        first_name: ghlUser.firstName,
        last_name: ghlUser.lastName,
        company_email: ghlUser.email,
      });
    }

    // Create new
    return this.create({
      first_name: ghlUser.firstName,
      last_name: ghlUser.lastName,
      company_email: ghlUser.email,
      company,
      date_of_joining: new Date().toISOString().split('T')[0],
      ghl_user_id: ghlUser.id,
      ghl_location_id: locationId,
    });
  }
}
