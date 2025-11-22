import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const navigation = [
  {
    name: 'HR',
    items: [
      { name: 'Dashboard', href: '/hr', icon: HomeIcon },
      { name: 'Employees', href: '/hr/employees', icon: UsersIcon },
      { name: 'Attendance', href: '/hr/attendance', icon: CalendarDaysIcon },
      { name: 'Leave Management', href: '/hr/leaves', icon: DocumentTextIcon },
    ],
  },
  {
    name: 'Payroll',
    items: [
      { name: 'Dashboard', href: '/payroll', icon: BanknotesIcon },
      { name: 'Salary Slips', href: '/payroll/slips', icon: ClipboardDocumentListIcon },
      { name: 'Run Payroll', href: '/payroll/run', icon: CurrencyDollarIcon },
    ],
  },
  {
    name: 'Accounting',
    items: [
      { name: 'Dashboard', href: '/accounting', icon: ChartBarIcon },
      { name: 'Invoices', href: '/accounting/invoices', icon: ReceiptPercentIcon },
      { name: 'Payments', href: '/accounting/payments', icon: BanknotesIcon },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/hr' || href === '/payroll' || href === '/accounting') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">GE</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">GHL-ERPNext</h1>
            <p className="text-xs text-gray-500">HR, Payroll & Accounting</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navigation.map((group) => (
          <div key={group.name}>
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {group.name}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={clsx(
                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={clsx(
                      'w-5 h-5 mr-3 transition-colors',
                      isActive(item.href) ? 'text-primary-600' : 'text-gray-400'
                    )}
                  />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-gray-200">
        <NavLink
          to="/settings"
          className={clsx(
            'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
            location.pathname === '/settings'
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <Cog6ToothIcon className="w-5 h-5 mr-3 text-gray-400" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
