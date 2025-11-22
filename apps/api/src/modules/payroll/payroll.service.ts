import { Injectable } from '@nestjs/common';
import { ErpnextService } from '../erpnext/erpnext.service';

export interface SalaryStructure {
  name: string;
  company: string;
  is_active: boolean;
  payroll_frequency: string;
  earnings: SalaryComponent[];
  deductions: SalaryComponent[];
}

export interface SalaryComponent {
  salary_component: string;
  amount?: number;
  formula?: string;
  amount_based_on_formula?: boolean;
}

export interface SalarySlip {
  name: string;
  employee: string;
  employee_name: string;
  company: string;
  posting_date: string;
  start_date: string;
  end_date: string;
  salary_structure: string;
  gross_pay: number;
  total_deduction: number;
  net_pay: number;
  status: 'Draft' | 'Submitted' | 'Cancelled';
  earnings: any[];
  deductions: any[];
}

export interface PayrollEntry {
  name: string;
  company: string;
  posting_date: string;
  payroll_frequency: string;
  start_date: string;
  end_date: string;
  status: 'Draft' | 'Submitted' | 'Cancelled';
  employees: any[];
}

@Injectable()
export class PayrollService {
  constructor(private erpnext: ErpnextService) {}

  // ==================== SALARY STRUCTURE ====================

  async getSalaryStructures(company?: string): Promise<SalaryStructure[]> {
    const filters: Record<string, any> = { is_active: 1 };
    if (company) filters.company = company;

    return this.erpnext.getList<SalaryStructure>('Salary Structure', {
      fields: ['name', 'company', 'is_active', 'payroll_frequency'],
      filters,
    });
  }

  async getSalaryStructure(name: string): Promise<SalaryStructure> {
    return this.erpnext.getDoc<SalaryStructure>('Salary Structure', name);
  }

  async createSalaryStructure(data: Partial<SalaryStructure>): Promise<SalaryStructure> {
    return this.erpnext.createDoc<SalaryStructure>('Salary Structure', data);
  }

  // ==================== SALARY SLIP ====================

  async getSalarySlips(options?: {
    company?: string;
    employee?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<SalarySlip[]> {
    const filters: Record<string, any> = {};

    if (options?.company) filters.company = options.company;
    if (options?.employee) filters.employee = options.employee;
    if (options?.status) filters.status = options.status;
    if (options?.startDate) filters.start_date = ['>=', options.startDate];
    if (options?.endDate) filters.end_date = ['<=', options.endDate];

    return this.erpnext.getList<SalarySlip>('Salary Slip', {
      fields: [
        'name',
        'employee',
        'employee_name',
        'company',
        'posting_date',
        'start_date',
        'end_date',
        'salary_structure',
        'gross_pay',
        'total_deduction',
        'net_pay',
        'status',
      ],
      filters,
      orderBy: 'posting_date desc',
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    });
  }

  async getSalarySlip(name: string): Promise<SalarySlip> {
    return this.erpnext.getDoc<SalarySlip>('Salary Slip', name);
  }

  async createSalarySlip(data: {
    employee: string;
    company: string;
    start_date: string;
    end_date: string;
    salary_structure?: string;
  }): Promise<SalarySlip> {
    return this.erpnext.createDoc<SalarySlip>('Salary Slip', data);
  }

  async submitSalarySlip(name: string): Promise<SalarySlip> {
    return this.erpnext.call('frappe.client.submit', {
      doctype: 'Salary Slip',
      name,
    });
  }

  // ==================== PAYROLL ENTRY ====================

  async getPayrollEntries(options?: {
    company?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<PayrollEntry[]> {
    const filters: Record<string, any> = {};

    if (options?.company) filters.company = options.company;
    if (options?.status) filters.status = options.status;

    return this.erpnext.getList<PayrollEntry>('Payroll Entry', {
      fields: [
        'name',
        'company',
        'posting_date',
        'payroll_frequency',
        'start_date',
        'end_date',
        'status',
      ],
      filters,
      orderBy: 'posting_date desc',
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    });
  }

  async getPayrollEntry(name: string): Promise<PayrollEntry> {
    return this.erpnext.getDoc<PayrollEntry>('Payroll Entry', name);
  }

  async createPayrollEntry(data: {
    company: string;
    start_date: string;
    end_date: string;
    payroll_frequency: string;
  }): Promise<PayrollEntry> {
    return this.erpnext.createDoc<PayrollEntry>('Payroll Entry', data);
  }

  async getPayrollEmployees(
    payrollEntryName: string,
  ): Promise<any[]> {
    return this.erpnext.call(
      'hrms.payroll.doctype.payroll_entry.payroll_entry.get_emp_list',
      { payroll_entry: payrollEntryName },
    );
  }

  // ==================== DASHBOARD ====================

  async getDashboardSummary(company?: string) {
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      .toISOString().split('T')[0];
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
      .toISOString().split('T')[0];

    const filters: Record<string, any> = {
      start_date: ['>=', startOfMonth],
      end_date: ['<=', endOfMonth],
    };
    if (company) filters.company = company;

    const [slipsCount, totalGross, totalNet] = await Promise.all([
      this.erpnext.getCount('Salary Slip', filters),
      this.getSalarySlips({ company, startDate: startOfMonth, endDate: endOfMonth }),
      this.erpnext.getCount('Payroll Entry', { company, status: 'Draft' }),
    ]);

    const slips = totalGross;
    const grossPay = slips.reduce((sum, slip) => sum + (slip.gross_pay || 0), 0);
    const netPay = slips.reduce((sum, slip) => sum + (slip.net_pay || 0), 0);

    return {
      currentMonth: {
        salarySlips: slipsCount,
        grossPay,
        netPay,
        deductions: grossPay - netPay,
      },
      pendingPayrolls: totalNet,
    };
  }
}
