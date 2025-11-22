import { motion } from 'framer-motion';
import {
  UsersIcon,
  UserPlusIcon,
  CalendarDaysIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data - replace with API calls
const stats = [
  {
    name: 'Total Employees',
    value: '48',
    change: '+3',
    changeType: 'increase',
    icon: UsersIcon,
    color: 'bg-primary-500',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-600',
  },
  {
    name: 'Present Today',
    value: '42',
    change: '87.5%',
    changeType: 'neutral',
    icon: CalendarDaysIcon,
    color: 'bg-success-500',
    bgColor: 'bg-success-50',
    textColor: 'text-success-600',
  },
  {
    name: 'On Leave',
    value: '4',
    change: '2 pending',
    changeType: 'neutral',
    icon: ClockIcon,
    color: 'bg-warning-500',
    bgColor: 'bg-warning-50',
    textColor: 'text-warning-600',
  },
  {
    name: 'New This Month',
    value: '3',
    change: '+50%',
    changeType: 'increase',
    icon: UserPlusIcon,
    color: 'bg-accent-500',
    bgColor: 'bg-accent-50',
    textColor: 'text-accent-600',
  },
];

const attendanceData = [
  { day: 'Mon', present: 45, absent: 3 },
  { day: 'Tue', present: 44, absent: 4 },
  { day: 'Wed', present: 46, absent: 2 },
  { day: 'Thu', present: 43, absent: 5 },
  { day: 'Fri', present: 42, absent: 6 },
  { day: 'Sat', present: 20, absent: 0 },
  { day: 'Sun', present: 0, absent: 0 },
];

const departmentData = [
  { name: 'Sales', value: 15, color: '#0ea5e9' },
  { name: 'Marketing', value: 8, color: '#d946ef' },
  { name: 'Engineering', value: 12, color: '#22c55e' },
  { name: 'Support', value: 8, color: '#f59e0b' },
  { name: 'Admin', value: 5, color: '#6366f1' },
];

const recentEmployees = [
  { id: 1, name: 'Sarah Wilson', role: 'Sales Manager', department: 'Sales', status: 'Active', avatar: 'SW', joinDate: '2024-01-15' },
  { id: 2, name: 'Mike Johnson', role: 'Developer', department: 'Engineering', status: 'Active', avatar: 'MJ', joinDate: '2024-01-12' },
  { id: 3, name: 'Emily Davis', role: 'Marketing Lead', department: 'Marketing', status: 'On Leave', avatar: 'ED', joinDate: '2024-01-10' },
  { id: 4, name: 'James Brown', role: 'Support Agent', department: 'Support', status: 'Active', avatar: 'JB', joinDate: '2024-01-08' },
  { id: 5, name: 'Lisa Anderson', role: 'HR Manager', department: 'Admin', status: 'Active', avatar: 'LA', joinDate: '2024-01-05' },
];

const pendingLeaves = [
  { id: 1, employee: 'Alex Turner', type: 'Vacation', days: 5, from: '2024-01-20', to: '2024-01-25' },
  { id: 2, employee: 'Rachel Green', type: 'Sick Leave', days: 2, from: '2024-01-18', to: '2024-01-19' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function HRDashboard() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your team.</p>
        </div>
        <button className="btn-primary">
          <UserPlusIcon className="w-4 h-4 mr-2" />
          Add Employee
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            className="card p-6 hover:shadow-soft-lg transition-all duration-300"
            whileHover={{ y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              {stat.changeType === 'increase' && (
                <span className="flex items-center text-sm font-medium text-success-600">
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
              )}
              {stat.changeType === 'decrease' && (
                <span className="flex items-center text-sm font-medium text-danger-600">
                  <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
              )}
              {stat.changeType === 'neutral' && (
                <span className="text-sm font-medium text-gray-500">{stat.change}</span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.name}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Weekly Attendance</h2>
              <p className="text-sm text-gray-500">Employee presence this week</p>
            </div>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="present"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPresent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Department Distribution */}
        <motion.div variants={itemVariants} className="card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">By Department</h2>
            <p className="text-sm text-gray-500">Employee distribution</p>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {departmentData.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-gray-600">{dept.name}</span>
                </div>
                <span className="font-medium text-gray-900">{dept.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <motion.div variants={itemVariants} className="card">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Employees</h2>
                <p className="text-sm text-gray-500">Latest additions to the team</p>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentEmployees.map((employee) => (
              <div
                key={employee.id}
                className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{employee.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.role} • {employee.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`badge ${
                      employee.status === 'Active' ? 'badge-success' : 'badge-warning'
                    }`}
                  >
                    {employee.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">Joined {employee.joinDate}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pending Leave Requests */}
        <motion.div variants={itemVariants} className="card">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Pending Leave Requests</h2>
                <p className="text-sm text-gray-500">Requests awaiting approval</p>
              </div>
              <span className="badge badge-warning">{pendingLeaves.length} pending</span>
            </div>
          </div>
          {pendingLeaves.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {pendingLeaves.map((leave) => (
                <div key={leave.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs font-medium">
                          {leave.employee.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{leave.employee}</p>
                        <p className="text-xs text-gray-500">{leave.type} • {leave.days} days</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{leave.from} - {leave.to}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 btn-primary text-xs py-1.5">
                      Approve
                    </button>
                    <button className="flex-1 btn-secondary text-xs py-1.5">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CalendarDaysIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No pending requests</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
