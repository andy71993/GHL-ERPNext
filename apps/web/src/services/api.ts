import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== HR API ====================

export const hrApi = {
  // Dashboard
  getDashboard: (company?: string) =>
    api.get('/hr/dashboard', { params: { company } }),

  // Employees
  getEmployees: (params?: { company?: string; status?: string; department?: string }) =>
    api.get('/hr/employees', { params }),

  getEmployee: (id: string) =>
    api.get(`/hr/employees/${id}`),

  createEmployee: (data: any) =>
    api.post('/hr/employees', data),

  updateEmployee: (id: string, data: any) =>
    api.put(`/hr/employees/${id}`, data),

  deleteEmployee: (id: string) =>
    api.delete(`/hr/employees/${id}`),

  // Attendance
  getAttendance: (params?: { company?: string; employee?: string; startDate?: string; endDate?: string }) =>
    api.get('/hr/attendance', { params }),

  markAttendance: (data: any) =>
    api.post('/hr/attendance', data),

  bulkMarkAttendance: (data: any[]) =>
    api.post('/hr/attendance/bulk', data),

  // Leaves
  getLeaves: (params?: { company?: string; employee?: string; status?: string }) =>
    api.get('/hr/leaves', { params }),

  applyLeave: (data: any) =>
    api.post('/hr/leaves', data),

  approveLeave: (id: string) =>
    api.post(`/hr/leaves/${id}/approve`),

  rejectLeave: (id: string) =>
    api.post(`/hr/leaves/${id}/reject`),
};

// ==================== PAYROLL API ====================

export const payrollApi = {
  getDashboard: (company?: string) =>
    api.get('/payroll/dashboard', { params: { company } }),

  getSalaryStructures: (company?: string) =>
    api.get('/payroll/salary-structures', { params: { company } }),

  getSalarySlips: (params?: { company?: string; employee?: string; status?: string }) =>
    api.get('/payroll/salary-slips', { params }),

  createSalarySlip: (data: any) =>
    api.post('/payroll/salary-slips', data),

  submitSalarySlip: (name: string) =>
    api.post(`/payroll/salary-slips/${name}/submit`),

  getPayrollEntries: (params?: { company?: string; status?: string }) =>
    api.get('/payroll/entries', { params }),

  createPayrollEntry: (data: any) =>
    api.post('/payroll/entries', data),
};

// ==================== ACCOUNTING API ====================

export const accountingApi = {
  getDashboard: (company?: string) =>
    api.get('/accounting/dashboard', { params: { company } }),

  getAccounts: (company?: string) =>
    api.get('/accounting/accounts', { params: { company } }),

  getSalesInvoices: (params?: { company?: string; customer?: string; status?: string }) =>
    api.get('/accounting/sales-invoices', { params }),

  createSalesInvoice: (data: any) =>
    api.post('/accounting/sales-invoices', data),

  getPurchaseInvoices: (params?: { company?: string; supplier?: string }) =>
    api.get('/accounting/purchase-invoices', { params }),

  getPayments: (params?: { company?: string; partyType?: string; party?: string }) =>
    api.get('/accounting/payments', { params }),

  createPayment: (data: any) =>
    api.post('/accounting/payments', data),

  getCustomers: (company?: string) =>
    api.get('/accounting/customers', { params: { company } }),

  getSuppliers: () =>
    api.get('/accounting/suppliers'),
};

// ==================== GHL API ====================

export const ghlApi = {
  getStatus: () =>
    api.get('/ghl/status'),

  getContacts: (params?: { limit?: number; offset?: number; query?: string }) =>
    api.get('/ghl/contacts', { params }),

  getUsers: () =>
    api.get('/ghl/users'),

  getLocation: () =>
    api.get('/ghl/location'),
};

// ==================== ERPNEXT API ====================

export const erpnextApi = {
  getStatus: () =>
    api.get('/erpnext/status'),
};

// ==================== HEALTH API ====================

export const healthApi = {
  check: () =>
    api.get('/health'),

  ready: () =>
    api.get('/health/ready'),
};
