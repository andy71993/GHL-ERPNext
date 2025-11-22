import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HRDashboard } from './pages/hr/Dashboard';
import { Employees } from './pages/hr/Employees';
import { Attendance } from './pages/hr/Attendance';
import { Leaves } from './pages/hr/Leaves';
import { PayrollDashboard } from './pages/payroll/Dashboard';
import { AccountingDashboard } from './pages/accounting/Dashboard';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default redirect to HR */}
          <Route index element={<Navigate to="/hr" replace />} />

          {/* HR Routes */}
          <Route path="hr">
            <Route index element={<HRDashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leaves" element={<Leaves />} />
          </Route>

          {/* Payroll Routes */}
          <Route path="payroll">
            <Route index element={<PayrollDashboard />} />
          </Route>

          {/* Accounting Routes */}
          <Route path="accounting">
            <Route index element={<AccountingDashboard />} />
          </Route>

          {/* Settings */}
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
