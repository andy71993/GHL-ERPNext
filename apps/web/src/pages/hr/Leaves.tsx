import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  CalendarDaysIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Mock data
const leaveRequests = [
  { id: 1, employee: 'Emily Davis', avatar: 'ED', type: 'Vacation', from: '2024-01-20', to: '2024-01-25', days: 5, reason: 'Family vacation', status: 'pending', appliedOn: '2024-01-10' },
  { id: 2, employee: 'Mike Johnson', avatar: 'MJ', type: 'Sick Leave', from: '2024-01-15', to: '2024-01-16', days: 2, reason: 'Medical appointment', status: 'approved', appliedOn: '2024-01-12' },
  { id: 3, employee: 'Sarah Wilson', avatar: 'SW', type: 'Personal', from: '2024-01-22', to: '2024-01-22', days: 1, reason: 'Personal matter', status: 'pending', appliedOn: '2024-01-11' },
  { id: 4, employee: 'James Brown', avatar: 'JB', type: 'Vacation', from: '2024-02-01', to: '2024-02-05', days: 5, reason: 'Annual leave', status: 'pending', appliedOn: '2024-01-08' },
  { id: 5, employee: 'Lisa Anderson', avatar: 'LA', type: 'Sick Leave', from: '2024-01-05', to: '2024-01-06', days: 2, reason: 'Not feeling well', status: 'rejected', appliedOn: '2024-01-04' },
];

const leaveTypes = [
  { name: 'Vacation', total: 20, used: 5, color: 'bg-primary-500' },
  { name: 'Sick Leave', total: 10, used: 2, color: 'bg-warning-500' },
  { name: 'Personal', total: 5, used: 1, color: 'bg-accent-500' },
  { name: 'Parental', total: 30, used: 0, color: 'bg-success-500' },
];

const statusColors: Record<string, string> = {
  pending: 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-danger',
};

export function Leaves() {
  const [filter, setFilter] = useState('all');

  const filteredRequests = filter === 'all'
    ? leaveRequests
    : leaveRequests.filter(r => r.status === filter);

  const stats = {
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length,
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1">Manage leave requests and balances</p>
        </div>
        <button className="btn-primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Request Leave
        </button>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveTypes.map((type) => (
          <div key={type.name} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">{type.name}</span>
              <span className={`w-3 h-3 rounded-full ${type.color}`}></span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{type.total - type.used}</p>
                <p className="text-xs text-gray-500">days remaining</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{type.used}/{type.total}</p>
                <p className="text-xs text-gray-400">used</p>
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${type.color} rounded-full transition-all`}
                style={{ width: `${(type.used / type.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              filter === status
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                status === 'pending' ? 'bg-warning-100 text-warning-600' :
                status === 'approved' ? 'bg-success-100 text-success-600' :
                'bg-danger-100 text-danger-600'
              }`}>
                {stats[status as keyof typeof stats]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Leave Requests */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Employee Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold">{request.avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{request.employee}</h3>
                  <p className="text-sm text-gray-500">Applied on {request.appliedOn}</p>
                </div>
              </div>

              {/* Leave Details */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2">
                  <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{request.type}</p>
                    <p className="text-xs text-gray-500">{request.from} to {request.to}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{request.days} days</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                </div>
                <span className={`badge ${statusColors[request.status]}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              {/* Actions */}
              {request.status === 'pending' && (
                <div className="flex items-center space-x-2">
                  <button className="btn-primary py-2 px-4">
                    <CheckIcon className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                  <button className="btn-secondary py-2 px-4">
                    <XMarkIcon className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </div>
              )}
            </div>

            {/* Reason */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Reason:</span> {request.reason}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
