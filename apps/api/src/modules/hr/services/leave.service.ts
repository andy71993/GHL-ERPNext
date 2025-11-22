import { Injectable } from '@nestjs/common';
import { ErpnextService } from '../../erpnext/erpnext.service';

export interface LeaveApplication {
  name: string;
  employee: string;
  employee_name: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  total_leave_days: number;
  description?: string;
  status: 'Open' | 'Approved' | 'Rejected' | 'Cancelled';
  leave_approver?: string;
  company: string;
  department?: string;
  posting_date: string;
}

export interface CreateLeaveApplicationDto {
  employee: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  description?: string;
  company: string;
  half_day?: boolean;
  half_day_date?: string;
}

export interface LeaveBalance {
  leave_type: string;
  total_leaves: number;
  leaves_taken: number;
  leaves_pending: number;
  leaves_available: number;
}

@Injectable()
export class LeaveService {
  constructor(private erpnext: ErpnextService) {}

  /**
   * Get leave applications
   */
  async getAll(options?: {
    company?: string;
    employee?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<LeaveApplication[]> {
    const filters: Record<string, any> = {};

    if (options?.company) filters.company = options.company;
    if (options?.employee) filters.employee = options.employee;
    if (options?.status) filters.status = options.status;
    if (options?.fromDate) filters.from_date = ['>=', options.fromDate];
    if (options?.toDate) filters.to_date = ['<=', options.toDate];

    return this.erpnext.getList<LeaveApplication>('Leave Application', {
      fields: [
        'name',
        'employee',
        'employee_name',
        'leave_type',
        'from_date',
        'to_date',
        'total_leave_days',
        'description',
        'status',
        'leave_approver',
        'company',
        'department',
        'posting_date',
      ],
      filters,
      orderBy: 'posting_date desc',
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    });
  }

  /**
   * Get leave application by ID
   */
  async getById(leaveId: string): Promise<LeaveApplication> {
    return this.erpnext.getDoc<LeaveApplication>('Leave Application', leaveId);
  }

  /**
   * Create leave application
   */
  async create(data: CreateLeaveApplicationDto): Promise<LeaveApplication> {
    return this.erpnext.createDoc<LeaveApplication>('Leave Application', {
      ...data,
      status: 'Open',
      posting_date: new Date().toISOString().split('T')[0],
    });
  }

  /**
   * Update leave application
   */
  async update(
    leaveId: string,
    data: Partial<LeaveApplication>,
  ): Promise<LeaveApplication> {
    return this.erpnext.updateDoc<LeaveApplication>(
      'Leave Application',
      leaveId,
      data,
    );
  }

  /**
   * Approve leave application
   */
  async approve(leaveId: string): Promise<LeaveApplication> {
    return this.update(leaveId, { status: 'Approved' });
  }

  /**
   * Reject leave application
   */
  async reject(leaveId: string): Promise<LeaveApplication> {
    return this.update(leaveId, { status: 'Rejected' });
  }

  /**
   * Cancel leave application
   */
  async cancel(leaveId: string): Promise<LeaveApplication> {
    return this.update(leaveId, { status: 'Cancelled' });
  }

  /**
   * Delete leave application
   */
  async delete(leaveId: string): Promise<void> {
    await this.erpnext.deleteDoc('Leave Application', leaveId);
  }

  /**
   * Get pending leave count
   */
  async getPendingCount(company?: string): Promise<number> {
    const filters: Record<string, any> = { status: 'Open' };
    if (company) filters.company = company;

    return this.erpnext.getCount('Leave Application', filters);
  }

  /**
   * Get leave balance for an employee
   */
  async getBalance(employee: string): Promise<LeaveBalance[]> {
    // Call ERPNext's leave balance API
    const result = await this.erpnext.call<any[]>(
      'hrms.hr.doctype.leave_application.leave_application.get_leave_balance_on',
      {
        employee,
        date: new Date().toISOString().split('T')[0],
      },
    );
    return result || [];
  }

  /**
   * Get leave types
   */
  async getLeaveTypes(company?: string): Promise<any[]> {
    const filters: Record<string, any> = {};
    if (company) filters.company = company;

    return this.erpnext.getList('Leave Type', {
      fields: ['name', 'leave_type_name', 'max_leaves_allowed', 'is_carry_forward'],
      filters,
    });
  }
}
