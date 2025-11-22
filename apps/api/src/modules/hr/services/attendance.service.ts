import { Injectable } from '@nestjs/common';
import { ErpnextService } from '../../erpnext/erpnext.service';

export interface Attendance {
  name: string;
  employee: string;
  employee_name: string;
  attendance_date: string;
  status: 'Present' | 'Absent' | 'On Leave' | 'Half Day' | 'Work From Home';
  in_time?: string;
  out_time?: string;
  working_hours?: number;
  late_entry?: boolean;
  early_exit?: boolean;
  company: string;
  department?: string;
}

export interface CreateAttendanceDto {
  employee: string;
  attendance_date: string;
  status: 'Present' | 'Absent' | 'On Leave' | 'Half Day' | 'Work From Home';
  in_time?: string;
  out_time?: string;
  company: string;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  onLeave: number;
  halfDay: number;
  workFromHome: number;
  total: number;
}

@Injectable()
export class AttendanceService {
  constructor(private erpnext: ErpnextService) {}

  /**
   * Get attendance records
   */
  async getAll(options?: {
    company?: string;
    employee?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Attendance[]> {
    const filters: Record<string, any> = {};

    if (options?.company) filters.company = options.company;
    if (options?.employee) filters.employee = options.employee;
    if (options?.status) filters.status = options.status;
    if (options?.startDate && options?.endDate) {
      filters.attendance_date = ['between', [options.startDate, options.endDate]];
    } else if (options?.startDate) {
      filters.attendance_date = ['>=', options.startDate];
    } else if (options?.endDate) {
      filters.attendance_date = ['<=', options.endDate];
    }

    return this.erpnext.getList<Attendance>('Attendance', {
      fields: [
        'name',
        'employee',
        'employee_name',
        'attendance_date',
        'status',
        'in_time',
        'out_time',
        'working_hours',
        'late_entry',
        'early_exit',
        'company',
        'department',
      ],
      filters,
      orderBy: 'attendance_date desc',
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    });
  }

  /**
   * Get attendance by ID
   */
  async getById(attendanceId: string): Promise<Attendance> {
    return this.erpnext.getDoc<Attendance>('Attendance', attendanceId);
  }

  /**
   * Mark attendance
   */
  async create(data: CreateAttendanceDto): Promise<Attendance> {
    return this.erpnext.createDoc<Attendance>('Attendance', data);
  }

  /**
   * Update attendance
   */
  async update(
    attendanceId: string,
    data: Partial<Attendance>,
  ): Promise<Attendance> {
    return this.erpnext.updateDoc<Attendance>('Attendance', attendanceId, data);
  }

  /**
   * Delete attendance
   */
  async delete(attendanceId: string): Promise<void> {
    await this.erpnext.deleteDoc('Attendance', attendanceId);
  }

  /**
   * Get today's attendance count
   */
  async getTodayCount(company?: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const filters: Record<string, any> = {
      attendance_date: today,
      status: 'Present',
    };
    if (company) filters.company = company;

    return this.erpnext.getCount('Attendance', filters);
  }

  /**
   * Get attendance summary for a date range
   */
  async getSummary(
    startDate: string,
    endDate: string,
    company?: string,
  ): Promise<AttendanceSummary> {
    const filters: Record<string, any> = {
      attendance_date: ['between', [startDate, endDate]],
    };
    if (company) filters.company = company;

    const [present, absent, onLeave, halfDay, workFromHome] = await Promise.all([
      this.erpnext.getCount('Attendance', { ...filters, status: 'Present' }),
      this.erpnext.getCount('Attendance', { ...filters, status: 'Absent' }),
      this.erpnext.getCount('Attendance', { ...filters, status: 'On Leave' }),
      this.erpnext.getCount('Attendance', { ...filters, status: 'Half Day' }),
      this.erpnext.getCount('Attendance', { ...filters, status: 'Work From Home' }),
    ]);

    return {
      present,
      absent,
      onLeave,
      halfDay,
      workFromHome,
      total: present + absent + onLeave + halfDay + workFromHome,
    };
  }

  /**
   * Bulk mark attendance
   */
  async bulkCreate(attendances: CreateAttendanceDto[]): Promise<Attendance[]> {
    return Promise.all(attendances.map((a) => this.create(a)));
  }
}
