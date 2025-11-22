import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

// Mock data
const employees = [
  { id: 'EMP-001', name: 'Sarah Wilson', email: 'sarah@company.com', phone: '+1 234 567 890', department: 'Sales', designation: 'Sales Manager', status: 'Active', avatar: 'SW', joinDate: '2023-03-15' },
  { id: 'EMP-002', name: 'Mike Johnson', email: 'mike@company.com', phone: '+1 234 567 891', department: 'Engineering', designation: 'Senior Developer', status: 'Active', avatar: 'MJ', joinDate: '2023-04-20' },
  { id: 'EMP-003', name: 'Emily Davis', email: 'emily@company.com', phone: '+1 234 567 892', department: 'Marketing', designation: 'Marketing Lead', status: 'On Leave', avatar: 'ED', joinDate: '2023-02-10' },
  { id: 'EMP-004', name: 'James Brown', email: 'james@company.com', phone: '+1 234 567 893', department: 'Support', designation: 'Support Agent', status: 'Active', avatar: 'JB', joinDate: '2023-06-01' },
  { id: 'EMP-005', name: 'Lisa Anderson', email: 'lisa@company.com', phone: '+1 234 567 894', department: 'HR', designation: 'HR Manager', status: 'Active', avatar: 'LA', joinDate: '2022-11-15' },
  { id: 'EMP-006', name: 'David Martinez', email: 'david@company.com', phone: '+1 234 567 895', department: 'Engineering', designation: 'Developer', status: 'Active', avatar: 'DM', joinDate: '2023-08-22' },
  { id: 'EMP-007', name: 'Jennifer Lee', email: 'jennifer@company.com', phone: '+1 234 567 896', department: 'Sales', designation: 'Account Executive', status: 'Inactive', avatar: 'JL', joinDate: '2023-01-10' },
  { id: 'EMP-008', name: 'Robert Taylor', email: 'robert@company.com', phone: '+1 234 567 897', department: 'Finance', designation: 'Accountant', status: 'Active', avatar: 'RT', joinDate: '2023-05-18' },
];

const departments = ['All', 'Sales', 'Engineering', 'Marketing', 'Support', 'HR', 'Finance'];
const statuses = ['All', 'Active', 'On Leave', 'Inactive'];

export function Employees() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 mt-1">Manage your team members</p>
        </div>
        <button className="btn-primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="input w-full lg:w-48"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input w-full lg:w-40"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        Showing {filteredEmployees.length} of {employees.length} employees
      </p>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              className="card-hover p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">{employee.avatar}</span>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                <p className="text-sm text-gray-500">{employee.designation}</p>
                <p className="text-xs text-gray-400 mt-1">{employee.department}</p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {employee.phone}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span
                  className={`badge ${
                    employee.status === 'Active'
                      ? 'badge-success'
                      : employee.status === 'On Leave'
                      ? 'badge-warning'
                      : 'badge-danger'
                  }`}
                >
                  {employee.status}
                </span>
                <span className="text-xs text-gray-400">{employee.id}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Contact</th>
                <th>Join Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{employee.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>{employee.department}</td>
                  <td>{employee.designation}</td>
                  <td>
                    <p className="text-sm">{employee.email}</p>
                    <p className="text-xs text-gray-500">{employee.phone}</p>
                  </td>
                  <td>{employee.joinDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        employee.status === 'Active'
                          ? 'badge-success'
                          : employee.status === 'On Leave'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
