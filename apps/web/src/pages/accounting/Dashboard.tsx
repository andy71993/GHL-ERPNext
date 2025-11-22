import { motion } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const stats = [
  { name: 'Total Revenue', value: '$245,680', change: '+12.5%', changeType: 'increase', icon: ArrowTrendingUpIcon, bgColor: 'bg-success-50', textColor: 'text-success-600' },
  { name: 'Total Expenses', value: '$82,340', change: '+3.2%', changeType: 'increase', icon: ArrowTrendingDownIcon, bgColor: 'bg-danger-50', textColor: 'text-danger-600' },
  { name: 'Net Profit', value: '$163,340', change: '+18.7%', changeType: 'increase', icon: WalletIcon, bgColor: 'bg-primary-50', textColor: 'text-primary-600' },
  { name: 'Outstanding', value: '$24,500', change: '8 invoices', changeType: 'neutral', icon: ReceiptPercentIcon, bgColor: 'bg-warning-50', textColor: 'text-warning-600' },
];

const cashFlowData = [
  { month: 'Jul', inflow: 38000, outflow: 12000 },
  { month: 'Aug', inflow: 42000, outflow: 14000 },
  { month: 'Sep', inflow: 45000, outflow: 13000 },
  { month: 'Oct', inflow: 48000, outflow: 15000 },
  { month: 'Nov', inflow: 52000, outflow: 14500 },
  { month: 'Dec', inflow: 55000, outflow: 16000 },
];

const expenseCategories = [
  { name: 'Salaries', value: 45000, color: '#0ea5e9' },
  { name: 'Operations', value: 15000, color: '#d946ef' },
  { name: 'Marketing', value: 8000, color: '#22c55e' },
  { name: 'Software', value: 6000, color: '#f59e0b' },
  { name: 'Others', value: 8340, color: '#6366f1' },
];

const recentTransactions = [
  { id: 'TXN-001', type: 'receive', party: 'Acme Corp', amount: '+$12,500', date: '2024-01-15', method: 'Bank Transfer' },
  { id: 'TXN-002', type: 'pay', party: 'Cloud Services', amount: '-$2,400', date: '2024-01-14', method: 'Credit Card' },
  { id: 'TXN-003', type: 'receive', party: 'TechStart Inc', amount: '+$8,750', date: '2024-01-13', method: 'Wire Transfer' },
  { id: 'TXN-004', type: 'pay', party: 'Office Supplies', amount: '-$450', date: '2024-01-12', method: 'Debit Card' },
  { id: 'TXN-005', type: 'receive', party: 'GlobalTech', amount: '+$15,000', date: '2024-01-11', method: 'Bank Transfer' },
];

const pendingInvoices = [
  { id: 'INV-001', customer: 'Acme Corp', amount: '$5,200', due: '2024-01-20', status: 'overdue' },
  { id: 'INV-002', customer: 'TechStart Inc', amount: '$8,500', due: '2024-01-25', status: 'due soon' },
  { id: 'INV-003', customer: 'GlobalTech', amount: '$10,800', due: '2024-02-01', status: 'pending' },
];

export function AccountingDashboard() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounting Dashboard</h1>
          <p className="text-gray-500 mt-1">Financial overview and transactions</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <ReceiptPercentIcon className="w-4 h-4 mr-2" />
            New Invoice
          </button>
          <button className="btn-primary">
            <BanknotesIcon className="w-4 h-4 mr-2" />
            Record Payment
          </button>
        </div>
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
              {stat.changeType === 'increase' && (
                <span className="flex items-center text-sm font-medium text-success-600">
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
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
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <motion.div
          className="lg:col-span-2 card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Cash Flow</h2>
              <p className="text-sm text-gray-500">Income vs Expenses</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Income</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-danger-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="inflow" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorInflow)" />
                <Area type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorOutflow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Expense Breakdown</h2>
          <p className="text-sm text-gray-500 mb-4">This month</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {expenseCategories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="font-medium text-gray-900">${cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${txn.type === 'receive' ? 'bg-success-50' : 'bg-danger-50'}`}>
                    {txn.type === 'receive' ? (
                      <ArrowTrendingUpIcon className="w-5 h-5 text-success-600" />
                    ) : (
                      <CreditCardIcon className="w-5 h-5 text-danger-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{txn.party}</p>
                    <p className="text-xs text-gray-500">{txn.method} • {txn.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${txn.type === 'receive' ? 'text-success-600' : 'text-danger-600'}`}>
                  {txn.amount}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pending Invoices */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pending Invoices</h2>
              <span className="badge badge-warning">{pendingInvoices.length} pending</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingInvoices.map((invoice) => (
              <div key={invoice.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary-600">{invoice.id}</span>
                  <span className={`badge ${
                    invoice.status === 'overdue' ? 'badge-danger' :
                    invoice.status === 'due soon' ? 'badge-warning' : 'badge-primary'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">{invoice.customer}</p>
                    <p className="text-xs text-gray-500">Due: {invoice.due}</p>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{invoice.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
