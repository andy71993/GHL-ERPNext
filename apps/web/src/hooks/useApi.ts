import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hrApi, payrollApi, accountingApi, ghlApi, erpnextApi, healthApi } from '../services/api';
import toast from 'react-hot-toast';

// ==================== HR HOOKS ====================

export function useHrDashboard(company?: string) {
  return useQuery({
    queryKey: ['hr', 'dashboard', company],
    queryFn: () => hrApi.getDashboard(company).then((res) => res.data),
  });
}

export function useEmployees(params?: { company?: string; status?: string; department?: string }) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => hrApi.getEmployees(params).then((res) => res.data),
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => hrApi.getEmployee(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => hrApi.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => hrApi.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update employee');
    },
  });
}

export function useAttendance(params?: { company?: string; employee?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: () => hrApi.getAttendance(params).then((res) => res.data),
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => hrApi.markAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance marked');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    },
  });
}

export function useLeaves(params?: { company?: string; employee?: string; status?: string }) {
  return useQuery({
    queryKey: ['leaves', params],
    queryFn: () => hrApi.getLeaves(params).then((res) => res.data),
  });
}

export function useApplyLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => hrApi.applyLeave(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success('Leave application submitted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to apply for leave');
    },
  });
}

export function useApproveLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hrApi.approveLeave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success('Leave approved');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve leave');
    },
  });
}

export function useRejectLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hrApi.rejectLeave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success('Leave rejected');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject leave');
    },
  });
}

// ==================== PAYROLL HOOKS ====================

export function usePayrollDashboard(company?: string) {
  return useQuery({
    queryKey: ['payroll', 'dashboard', company],
    queryFn: () => payrollApi.getDashboard(company).then((res) => res.data),
  });
}

export function useSalarySlips(params?: { company?: string; employee?: string; status?: string }) {
  return useQuery({
    queryKey: ['salary-slips', params],
    queryFn: () => payrollApi.getSalarySlips(params).then((res) => res.data),
  });
}

// ==================== ACCOUNTING HOOKS ====================

export function useAccountingDashboard(company?: string) {
  return useQuery({
    queryKey: ['accounting', 'dashboard', company],
    queryFn: () => accountingApi.getDashboard(company).then((res) => res.data),
  });
}

export function useSalesInvoices(params?: { company?: string; customer?: string; status?: string }) {
  return useQuery({
    queryKey: ['sales-invoices', params],
    queryFn: () => accountingApi.getSalesInvoices(params).then((res) => res.data),
  });
}

// ==================== CONNECTION HOOKS ====================

export function useGhlStatus() {
  return useQuery({
    queryKey: ['ghl', 'status'],
    queryFn: () => ghlApi.getStatus().then((res) => res.data),
    refetchInterval: 60000, // Check every minute
  });
}

export function useErpnextStatus() {
  return useQuery({
    queryKey: ['erpnext', 'status'],
    queryFn: () => erpnextApi.getStatus().then((res) => res.data),
    refetchInterval: 60000,
  });
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => healthApi.ready().then((res) => res.data),
    refetchInterval: 30000,
  });
}
