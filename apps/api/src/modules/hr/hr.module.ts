import { Module } from '@nestjs/common';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { EmployeeService } from './services/employee.service';
import { AttendanceService } from './services/attendance.service';
import { LeaveService } from './services/leave.service';

@Module({
  controllers: [HrController],
  providers: [HrService, EmployeeService, AttendanceService, LeaveService],
  exports: [HrService, EmployeeService, AttendanceService, LeaveService],
})
export class HrModule {}
