import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Mock data
const attendanceData = [
  { id: 1, name: 'Sarah Wilson', avatar: 'SW', mon: 'present', tue: 'present', wed: 'present', thu: 'present', fri: 'present' },
  { id: 2, name: 'Mike Johnson', avatar: 'MJ', mon: 'present', tue: 'present', wed: 'absent', thu: 'present', fri: 'present' },
  { id: 3, name: 'Emily Davis', avatar: 'ED', mon: 'present', tue: 'leave', wed: 'leave', thu: 'leave', fri: 'leave' },
  { id: 4, name: 'James Brown', avatar: 'JB', mon: 'present', tue: 'present', wed: 'present', thu: 'late', fri: 'present' },
  { id: 5, name: 'Lisa Anderson', avatar: 'LA', mon: 'present', tue: 'present', wed: 'present', thu: 'present', fri: 'wfh' },
  { id: 6, name: 'David Martinez', avatar: 'DM', mon: 'late', tue: 'present', wed: 'present', thu: 'present', fri: 'present' },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const statusConfig: Record<string, { icon: typeof CheckCircleIcon; color: string; bgColor: string; label: string }> = {
  present: { icon: CheckCircleIcon, color: 'text-success-500', bgColor: 'bg-success-50', label: 'Present' },
  absent: { icon: XCircleIcon, color: 'text-danger-500', bgColor: 'bg-danger-50', label: 'Absent' },
  leave: { icon: CalendarDaysIcon, color: 'text-warning-500', bgColor: 'bg-warning-50', label: 'On Leave' },
  late: { icon: ClockIcon, color: 'text-orange-500', bgColor: 'bg-orange-50', label: 'Late' },
  wfh: { icon: CheckCircleIcon, color: 'text-primary-500', bgColor: 'bg-primary-50', label: 'WFH' },
};

export function Attendance() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const getWeekDates = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);
    return weekDays.map((_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  const stats = {
    present: attendanceData.reduce((acc, emp) => acc + Object.values(emp).filter(v => v === 'present' || v === 'wfh').length, 0),
    absent: attendanceData.reduce((acc, emp) => acc + Object.values(emp).filter(v => v === 'absent').length, 0),
    leave: attendanceData.reduce((acc, emp) => acc + Object.values(emp).filter(v => v === 'leave').length, 0),
    late: attendanceData.reduce((acc, emp) => acc + Object.values(emp).filter(v => v === 'late').length, 0),
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
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 mt-1">Track employee attendance and working hours</p>
        </div>
        <button className="btn-primary">
          Mark Attendance
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center space-x-4">
          <div className="p-3 bg-success-50 rounded-xl">
            <CheckCircleIcon className="w-6 h-6 text-success-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
            <p className="text-sm text-gray-500">Present</p>
          </div>
        </div>
        <div className="card p-4 flex items-center space-x-4">
          <div className="p-3 bg-danger-50 rounded-xl">
            <XCircleIcon className="w-6 h-6 text-danger-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
            <p className="text-sm text-gray-500">Absent</p>
          </div>
        </div>
        <div className="card p-4 flex items-center space-x-4">
          <div className="p-3 bg-warning-50 rounded-xl">
            <CalendarDaysIcon className="w-6 h-6 text-warning-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.leave}</p>
            <p className="text-sm text-gray-500">On Leave</p>
          </div>
        </div>
        <div className="card p-4 flex items-center space-x-4">
          <div className="p-3 bg-orange-50 rounded-xl">
            <ClockIcon className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
            <p className="text-sm text-gray-500">Late</p>
          </div>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const prev = new Date(currentWeek);
              prev.setDate(prev.getDate() - 7);
              setCurrentWeek(prev);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
              {weekDates[4].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h2>
            <p className="text-sm text-gray-500">Week View</p>
          </div>
          <button
            onClick={() => {
              const next = new Date(currentWeek);
              next.setDate(next.getDate() + 7);
              setCurrentWeek(next);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 bg-gray-50">
                  Employee
                </th>
                {weekDays.map((day, i) => (
                  <th key={day} className="text-center py-4 px-4 text-sm font-semibold text-gray-900 bg-gray-50 min-w-[100px]">
                    <div>{day}</div>
                    <div className="text-xs font-normal text-gray-500">
                      {weekDates[i].getDate()}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceData.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{employee.avatar}</span>
                      </div>
                      <span className="font-medium text-gray-900">{employee.name}</span>
                    </div>
                  </td>
                  {(['mon', 'tue', 'wed', 'thu', 'fri'] as const).map((day) => {
                    const status = employee[day];
                    const config = statusConfig[status];
                    const Icon = config.icon;
                    return (
                      <td key={day} className="py-4 px-4 text-center">
                        <button
                          className={`inline-flex items-center justify-center p-2 rounded-lg transition-all hover:scale-110 ${config.bgColor}`}
                          title={config.label}
                        >
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className="flex items-center space-x-2 text-sm">
            <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
              <config.icon className={`w-4 h-4 ${config.color}`} />
            </div>
            <span className="text-gray-600">{config.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
