import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { HrService } from './hr.service';
import { EmployeeService, CreateEmployeeDto } from './services/employee.service';
import { AttendanceService, CreateAttendanceDto } from './services/attendance.service';
import { LeaveService, CreateLeaveApplicationDto } from './services/leave.service';

@ApiTags('hr')
@Controller('hr')
export class HrController {
  constructor(
    private readonly hrService: HrService,
    private readonly employeeService: EmployeeService,
    private readonly attendanceService: AttendanceService,
    private readonly leaveService: LeaveService,
  ) {}

  // ==================== DASHBOARD ====================

  @Get('dashboard')
  @ApiOperation({ summary: 'Get HR dashboard summary' })
  @ApiQuery({ name: 'company', required: false })
  @ApiResponse({ status: 200, description: 'Dashboard summary data' })
  async getDashboard(@Query('company') company?: string) {
    return this.hrService.getDashboardSummary(company);
  }

  // ==================== EMPLOYEES ====================

  @Get('employees')
  @ApiOperation({ summary: 'List all employees' })
  @ApiQuery({ name: 'company', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'department', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of employees' })
  async getEmployees(
    @Query('company') company?: string,
    @Query('status') status?: string,
    @Query('department') department?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const employees = await this.employeeService.getAll(company, {
      status,
      department,
      limit,
      offset,
    });
    return { employees, total: employees.length };
  }

  @Get('employees/search')
  @ApiOperation({ summary: 'Search employees' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'company', required: false })
  async searchEmployees(
    @Query('q') query: string,
    @Query('company') company?: string,
  ) {
    const employees = await this.employeeService.search(query, company);
    return { employees };
  }

  @Get('employees/:id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  async getEmployee(@Param('id') id: string) {
    return this.employeeService.getById(id);
  }

  @Post('employees')
  @ApiOperation({ summary: 'Create new employee' })
  async createEmployee(@Body() data: CreateEmployeeDto) {
    return this.employeeService.create(data);
  }

  @Put('employees/:id')
  @ApiOperation({ summary: 'Update employee' })
  async updateEmployee(@Param('id') id: string, @Body() data: any) {
    return this.employeeService.update(id, data);
  }

  @Delete('employees/:id')
  @ApiOperation({ summary: 'Delete employee' })
  async deleteEmployee(@Param('id') id: string) {
    await this.employeeService.delete(id);
    return { success: true };
  }

  // ==================== ATTENDANCE ====================

  @Get('attendance')
  @ApiOperation({ summary: 'List attendance records' })
  @ApiQuery({ name: 'company', required: false })
  @ApiQuery({ name: 'employee', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getAttendance(
    @Query('company') company?: string,
    @Query('employee') employee?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    const attendance = await this.attendanceService.getAll({
      company,
      employee,
      startDate,
      endDate,
      status,
    });
    return { attendance, total: attendance.length };
  }

  @Get('attendance/summary')
  @ApiOperation({ summary: 'Get attendance summary for date range' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'company', required: false })
  async getAttendanceSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('company') company?: string,
  ) {
    return this.attendanceService.getSummary(startDate, endDate, company);
  }

  @Get('attendance/:id')
  @ApiOperation({ summary: 'Get attendance by ID' })
  async getAttendanceById(@Param('id') id: string) {
    return this.attendanceService.getById(id);
  }

  @Post('attendance')
  @ApiOperation({ summary: 'Mark attendance' })
  async createAttendance(@Body() data: CreateAttendanceDto) {
    return this.attendanceService.create(data);
  }

  @Post('attendance/bulk')
  @ApiOperation({ summary: 'Bulk mark attendance' })
  async bulkCreateAttendance(@Body() data: CreateAttendanceDto[]) {
    const attendance = await this.attendanceService.bulkCreate(data);
    return { attendance, total: attendance.length };
  }

  @Put('attendance/:id')
  @ApiOperation({ summary: 'Update attendance' })
  async updateAttendance(@Param('id') id: string, @Body() data: any) {
    return this.attendanceService.update(id, data);
  }

  @Delete('attendance/:id')
  @ApiOperation({ summary: 'Delete attendance' })
  async deleteAttendance(@Param('id') id: string) {
    await this.attendanceService.delete(id);
    return { success: true };
  }

  // ==================== LEAVE ====================

  @Get('leaves')
  @ApiOperation({ summary: 'List leave applications' })
  @ApiQuery({ name: 'company', required: false })
  @ApiQuery({ name: 'employee', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getLeaves(
    @Query('company') company?: string,
    @Query('employee') employee?: string,
    @Query('status') status?: string,
  ) {
    const leaves = await this.leaveService.getAll({
      company,
      employee,
      status,
    });
    return { leaves, total: leaves.length };
  }

  @Get('leaves/types')
  @ApiOperation({ summary: 'Get leave types' })
  @ApiQuery({ name: 'company', required: false })
  async getLeaveTypes(@Query('company') company?: string) {
    return this.leaveService.getLeaveTypes(company);
  }

  @Get('leaves/:id')
  @ApiOperation({ summary: 'Get leave application by ID' })
  async getLeaveById(@Param('id') id: string) {
    return this.leaveService.getById(id);
  }

  @Post('leaves')
  @ApiOperation({ summary: 'Apply for leave' })
  async createLeave(@Body() data: CreateLeaveApplicationDto) {
    return this.leaveService.create(data);
  }

  @Put('leaves/:id')
  @ApiOperation({ summary: 'Update leave application' })
  async updateLeave(@Param('id') id: string, @Body() data: any) {
    return this.leaveService.update(id, data);
  }

  @Post('leaves/:id/approve')
  @ApiOperation({ summary: 'Approve leave application' })
  async approveLeave(@Param('id') id: string) {
    return this.leaveService.approve(id);
  }

  @Post('leaves/:id/reject')
  @ApiOperation({ summary: 'Reject leave application' })
  async rejectLeave(@Param('id') id: string) {
    return this.leaveService.reject(id);
  }

  @Delete('leaves/:id')
  @ApiOperation({ summary: 'Delete leave application' })
  async deleteLeave(@Param('id') id: string) {
    await this.leaveService.delete(id);
    return { success: true };
  }
}
