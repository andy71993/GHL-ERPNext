import { motion } from 'framer-motion';
import {
  Cog6ToothIcon,
  BuildingOfficeIcon,
  LinkIcon,
  BellIcon,
  ShieldCheckIcon,
  CloudIcon,
} from '@heroicons/react/24/outline';

const settingsSections = [
  {
    title: 'Company Settings',
    icon: BuildingOfficeIcon,
    description: 'Configure your company details and preferences',
    items: [
      { label: 'Company Name', value: 'Your Company LLC', type: 'text' },
      { label: 'Default Currency', value: 'USD', type: 'select' },
      { label: 'Fiscal Year Start', value: 'January', type: 'select' },
    ],
  },
  {
    title: 'GHL Integration',
    icon: LinkIcon,
    description: 'GoHighLevel connection settings',
    items: [
      { label: 'Location ID', value: 'loc_xxxxxxxxxxxxx', type: 'text' },
      { label: 'API Key', value: '••••••••••••••••', type: 'password' },
      { label: 'Auto-sync Users', value: true, type: 'toggle' },
    ],
  },
  {
    title: 'ERPNext Connection',
    icon: CloudIcon,
    description: 'ERPNext API configuration',
    items: [
      { label: 'ERPNext URL', value: 'https://your-site.frappe.cloud', type: 'text' },
      { label: 'API Key', value: '••••••••••••••••', type: 'password' },
      { label: 'API Secret', value: '••••••••••••••••', type: 'password' },
    ],
  },
];

export function Settings() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your application configuration</p>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <LinkIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">GoHighLevel</p>
              <p className="text-xs text-gray-500">Integration Status</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span className="text-sm text-success-600 font-medium">Connected</span>
          </div>
        </div>

        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success-50 rounded-lg">
              <CloudIcon className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">ERPNext</p>
              <p className="text-xs text-gray-500">Backend Status</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span className="text-sm text-success-600 font-medium">Connected</span>
          </div>
        </div>

        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning-50 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Webhooks</p>
              <p className="text-xs text-gray-500">Sync Status</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
            <span className="text-sm text-warning-600 font-medium">Partial</span>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, index) => (
          <motion.div
            key={section.title}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <section.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">{item.label}</label>
                  {item.type === 'toggle' ? (
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        item.value ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : (
                    <input
                      type={item.type}
                      defaultValue={item.value as string}
                      className="input max-w-xs text-sm"
                      readOnly
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button className="btn-secondary">Reset to Defaults</button>
        <button className="btn-primary">Save Changes</button>
      </div>
    </motion.div>
  );
}
