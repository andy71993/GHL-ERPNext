import { Injectable } from '@nestjs/common';
import { EmployeeService } from './services/employee.service';
import { AttendanceService } from './services/attendance.service';
import { LeaveService } from './services/leave.service';

@Injectable()
export class HrService {
  constructor(
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
  ) {}

  /**
   * Get HR dashboard summary data
   */
  async getDashboardSummary(company?: string) {
    const [
      totalEmployees,
      activeEmployees,
      todayAttendance,
      pendingLeaves,
    ] = await Promise.all([
      this.employeeService.getCount(company),
      this.employeeService.getCount(company, { status: 'Active' }),
      this.attendanceService.getTodayCount(company),
      this.leaveService.getPendingCount(company),
    ]);

    return {
      employees: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: totalEmployees - activeEmployees,
      },
      attendance: {
        today: todayAttendance,
        percentage: totalEmployees > 0
          ? Math.round((todayAttendance / activeEmployees) * 100)
          : 0,
      },
      leaves: {
        pending: pendingLeaves,
      },
    };
  }
}
