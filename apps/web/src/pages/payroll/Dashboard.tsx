import { motion } from 'framer-motion';
import {
  BanknotesIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const stats = [
  { name: 'Total Payroll', value: '$125,450', change: '+5.2%', icon: BanknotesIcon, color: 'bg-primary-500', bgColor: 'bg-primary-50', textColor: 'text-primary-600' },
  { name: 'Net Salaries', value: '$98,320', change: '+3.8%', icon: CurrencyDollarIcon, color: 'bg-success-500', bgColor: 'bg-success-50', textColor: 'text-success-600' },
  { name: 'Total Deductions', value: '$27,130', change: '-2.1%', icon: DocumentTextIcon, color: 'bg-warning-500', bgColor: 'bg-warning-50', textColor: 'text-warning-600' },
  { name: 'Pending Slips', value: '12', change: 'Draft', icon: CalendarIcon, color: 'bg-accent-500', bgColor: 'bg-accent-50', textColor: 'text-accent-600' },
];

const monthlyData = [
  { month: 'Jul', gross: 115000, net: 92000 },
  { month: 'Aug', gross: 118000, net: 94000 },
  { month: 'Sep', gross: 120000, net: 96000 },
  { month: 'Oct', gross: 122000, net: 97000 },
  { month: 'Nov', gross: 123000, net: 98000 },
  { month: 'Dec', gross: 125450, net: 98320 },
];

const recentSlips = [
  { id: 'SAL-2024-001', employee: 'Sarah Wilson', period: 'Jan 2024', gross: '$5,200', net: '$4,150', status: 'Paid' },
  { id: 'SAL-2024-002', employee: 'Mike Johnson', period: 'Jan 2024', gross: '$6,500', net: '$5,200', status: 'Paid' },
  { id: 'SAL-2024-003', employee: 'Emily Davis', period: 'Jan 2024', gross: '$5,800', net: '$4,640', status: 'Draft' },
  { id: 'SAL-2024-004', employee: 'James Brown', period: 'Jan 2024', gross: '$4,200', net: '$3,360', status: 'Draft' },
];

export function PayrollDashboard() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage salaries and compensation</p>
        </div>
        <button className="btn-primary">
          Run Payroll
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <span className="flex items-center text-sm font-medium text-success-600">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.name}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Payroll Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="gross" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Gross Pay" />
                <Bar dataKey="net" fill="#22c55e" radius={[4, 4, 0, 0]} name="Net Pay" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Comparison</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Line type="monotone" dataKey="gross" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9' }} />
                <Line type="monotone" dataKey="net" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Salary Slips */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Salary Slips</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Period</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Gross</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Net</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentSlips.map((slip) => (
                <tr key={slip.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-primary-600">{slip.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{slip.employee}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{slip.period}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{slip.gross}</td>
                  <td className="py-4 px-6 text-sm font-medium text-success-600">{slip.net}</td>
                  <td className="py-4 px-6">
                    <span className={`badge ${slip.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                      {slip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
