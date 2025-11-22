import { Injectable } from '@nestjs/common';
import { ErpnextService } from '../erpnext/erpnext.service';

export interface Account {
  name: string;
  account_name: string;
  account_type?: string;
  root_type: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
  is_group: boolean;
  parent_account?: string;
  company: string;
  balance?: number;
}

export interface JournalEntry {
  name: string;
  posting_date: string;
  company: string;
  voucher_type: string;
  total_debit: number;
  total_credit: number;
  accounts: JournalEntryAccount[];
  user_remark?: string;
  docstatus: 0 | 1 | 2; // 0=Draft, 1=Submitted, 2=Cancelled
}

export interface JournalEntryAccount {
  account: string;
  debit_in_account_currency: number;
  credit_in_account_currency: number;
  party_type?: string;
  party?: string;
}

export interface SalesInvoice {
  name: string;
  customer: string;
  customer_name: string;
  posting_date: string;
  due_date: string;
  company: string;
  grand_total: number;
  outstanding_amount: number;
  status: string;
  items: any[];
}

export interface PurchaseInvoice {
  name: string;
  supplier: string;
  supplier_name: string;
  posting_date: string;
  due_date: string;
  company: string;
  grand_total: number;
  outstanding_amount: number;
  status: string;
  items: any[];
}

export interface PaymentEntry {
  name: string;
  payment_type: 'Receive' | 'Pay' | 'Internal Transfer';
  party_type: string;
  party: string;
  party_name?: string;
  posting_date: string;
  company: string;
  paid_amount: number;
  received_amount: number;
  reference_no?: string;
  reference_date?: string;
  mode_of_payment?: string;
  status: string;
}

@Injectable()
export class AccountingService {
  constructor(private erpnext: ErpnextService) {}

  // ==================== CHART OF ACCOUNTS ====================

  async getAccounts(company?: string): Promise<Account[]> {
    const filters: Record<string, any> = {};
    if (company) filters.company = company;

    return this.erpnext.getList<Account>('Account', {
      fields: [
        'name',
        'account_name',
        'account_type',
        'root_type',
        'is_group',
        'parent_account',
        'company',
      ],
      filters,
      orderBy: 'name asc',
      limit: 500,
    });
  }

  async getAccount(name: string): Promise<Account> {
    return this.erpnext.getDoc<Account>('Account', name);
  }

  async getAccountBalance(
    account: string,
    company: string,
    date?: string,
  ): Promise<number> {
    const result = await this.erpnext.call<{ balance: number }>(
      'erpnext.accounts.utils.get_balance_on',
      {
        account,
        company,
        date: date || new Date().toISOString().split('T')[0],
      },
    );
    return result?.balance || 0;
  }

  // ==================== JOURNAL ENTRIES ====================

  async getJournalEntries(options?: {
    company?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<JournalEntry[]> {
    const filters: Record<string, any> = {};

    if (options?.company) filters.company = options.company;
    if (options?.startDate) filters.posting_date = ['>=', options.startDate];
    if (options?.endDate) {
      if (filters.posting_date) {
        filters.posting_date = ['between', [options.startDate, options.endDate]];
      } else {
        filters.posting_date = ['<=', options.endDate];
      }
    }

    return this.erpnext.getList<JournalEntry>('Journal Entry', {
      fields: [
        'name',
        'posting_date',
        'company',
        'voucher_type',
        'total_debit',
        'total_credit',
        'user_remark',
        'docstatus',
      ],
      filters,
      orderBy: 'posting_date desc',
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    });
  }

  async getJournalEntry(name: string): Promise<JournalEntry> {
    return this.erpnext.getDoc<JournalEntry>('Journal Entry', name);
  }

  async createJournalEntry(data: {
    company: string;
    posting_date: string;
    accounts: JournalEntryAccount[];
    user_remark?: string;
  }): Promise<JournalEntry> {
    return this.erpnext.createDoc<JournalEntry>('Journal Entry', {
      ...data,
      voucher_type: 'Journal Entry',
    });
  }

  // ==================== SALES INVOICES ====================

  async getSalesInvoices(options?: {
    company?: string;
    customer?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<SalesInvoice[]> {
    const filters: Record<string, any> = {};

    if (options?.company) filters.company = options.company;
    if (options?.customer) filters.customer = options.customer;
    if (options?.status) filters.status = options.status;
    if (options?.startDate && options?.endDate) {
      filters.posting_date = ['between', [options.startDate, options.endDate]];
    }

    return this.erpnext.getList<SalesInvoice>('Sales Invoice', {
      fields: [
        'name',
        'customer',
        'customer_name',
        'posting_date',
        'due_date',
        'company',
        'grand_total',
        'outstanding_amount',
        'status',
      ],
      filters,
      orderBy: 'posting_date desc',
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    });
  }

  async getSalesInvoice(name: string): Promise<SalesInvoice> {
    return this.erpnext.getDoc<SalesInvoice>('Sales Invoice', name);
  }

  async createSalesInvoice(data: Partial<SalesInvoice>): Promise<SalesInvoice> {
    return this.erpnext.createDoc<SalesInvoice>('Sales Invoice', data);
  }

  // ==================== PURCHASE INVOICES ====================

  async getPurchaseInvoices(options?: {
    company?: string;
    supplier?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<PurchaseInvoice[]> {
    const filters: Record<string, any> = {};

    if (options?.company) filters.company = options.company;
    if (options?.supplier) filters.supplier = options.supplier;
    if (options?.status) filters.status = options.status;

    return this.erpnext.getList<PurchaseInvoice>('Purchase Invoice', {
      fields: [
        'name',
        'supplier',
        'supplier_name',
        'posting_date',
        'due_date',
        'company',
        'grand_total',
        'outstanding_amount',
        'status',
      ],
      filters,
      orderBy: 'posting_date desc',
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    });
  }

  async getPurchaseInvoice(name: string): Promise<PurchaseInvoice> {
    return this.erpnext.getDoc<PurchaseInvoice>('Purchase Invoice', name);
  }

  async createPurchaseInvoice(data: Partial<PurchaseInvoice>): Promise<PurchaseInvoice> {
    return this.erpnext.createDoc<PurchaseInvoice>('Purchase Invoice', data);
  }

  // ==================== PAYMENT ENTRIES ====================

  async getPaymentEntries(options?: {
    company?: string;
    partyType?: string;
    party?: string;
    paymentType?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaymentEntry[]> {
    const filters: Record<string, any> = {};

    if (options?.company) filters.company = options.company;
    if (options?.partyType) filters.party_type = options.partyType;
    if (options?.party) filters.party = options.party;
    if (options?.paymentType) filters.payment_type = options.paymentType;
    if (options?.startDate && options?.endDate) {
      filters.posting_date = ['between', [options.startDate, options.endDate]];
    }

    return this.erpnext.getList<PaymentEntry>('Payment Entry', {
      fields: [
        'name',
        'payment_type',
        'party_type',
        'party',
        'party_name',
        'posting_date',
        'company',
        'paid_amount',
        'received_amount',
        'reference_no',
        'reference_date',
        'mode_of_payment',
        'status',
      ],
      filters,
      orderBy: 'posting_date desc',
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    });
  }

  async getPaymentEntry(name: string): Promise<PaymentEntry> {
    return this.erpnext.getDoc<PaymentEntry>('Payment Entry', name);
  }

  async createPaymentEntry(data: Partial<PaymentEntry>): Promise<PaymentEntry> {
    return this.erpnext.createDoc<PaymentEntry>('Payment Entry', data);
  }

  // ==================== CUSTOMERS & SUPPLIERS ====================

  async getCustomers(company?: string): Promise<any[]> {
    const filters: Record<string, any> = {};
    // Customers aren't directly tied to company in ERPNext

    return this.erpnext.getList('Customer', {
      fields: ['name', 'customer_name', 'customer_type', 'customer_group', 'territory'],
      filters,
      limit: 500,
    });
  }

  async getSuppliers(company?: string): Promise<any[]> {
    return this.erpnext.getList('Supplier', {
      fields: ['name', 'supplier_name', 'supplier_type', 'supplier_group', 'country'],
      limit: 500,
    });
  }

  // ==================== DASHBOARD ====================

  async getDashboardSummary(company?: string) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString().split('T')[0];
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString().split('T')[0];

    const filters: Record<string, any> = {};
    if (company) filters.company = company;

    const [
      salesInvoices,
      purchaseInvoices,
      payments,
      unpaidInvoices,
    ] = await Promise.all([
      this.getSalesInvoices({ company, startDate: startOfMonth, endDate: endOfMonth }),
      this.getPurchaseInvoices({ company }),
      this.getPaymentEntries({ company, startDate: startOfMonth, endDate: endOfMonth }),
      this.erpnext.getCount('Sales Invoice', { ...filters, outstanding_amount: ['>', 0] }),
    ]);

    const totalRevenue = salesInvoices.reduce((sum, inv) => sum + (inv.grand_total || 0), 0);
    const totalExpenses = purchaseInvoices
      .filter((inv) => inv.posting_date >= startOfMonth && inv.posting_date <= endOfMonth)
      .reduce((sum, inv) => sum + (inv.grand_total || 0), 0);
    const totalReceived = payments
      .filter((p) => p.payment_type === 'Receive')
      .reduce((sum, p) => sum + (p.received_amount || 0), 0);
    const totalPaid = payments
      .filter((p) => p.payment_type === 'Pay')
      .reduce((sum, p) => sum + (p.paid_amount || 0), 0);

    return {
      currentMonth: {
        revenue: totalRevenue,
        expenses: totalExpenses,
        profit: totalRevenue - totalExpenses,
        received: totalReceived,
        paid: totalPaid,
        cashFlow: totalReceived - totalPaid,
      },
      invoices: {
        total: salesInvoices.length,
        unpaid: unpaidInvoices,
      },
    };
  }
}
