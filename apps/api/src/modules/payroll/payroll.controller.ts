import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';

@ApiTags('payroll')
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get payroll dashboard summary' })
  @ApiQuery({ name: 'company', required: false })
  async getDashboard(@Query('company') company?: string) {
    return this.payrollService.getDashboardSummary(company);
  }

  // ==================== SALARY STRUCTURES ====================

  @Get('salary-structures')
  @ApiOperation({ summary: 'List salary structures' })
  @ApiQuery({ name: 'company', required: false })
  async getSalaryStructures(@Query('company') company?: string) {
    const structures = await this.payrollService.getSalaryStructures(company);
    return { structures, total: structures.length };
  }

  @Get('salary-structures/:name')
  @ApiOperation({ summary: 'Get salary structure by name' })
  async getSalaryStructure(@Param('name') name: string) {
    return this.payrollService.getSalaryStructure(name);
  }

  @Post('salary-structures')
  @ApiOperation({ summary: 'Create salary structure' })
  async createSalaryStructure(@Body() data: any) {
    return this.payrollService.createSalaryStructure(data);
  }

  // ==================== SALARY SLIPS ====================

  @Get('salary-slips')
  @ApiOperation({ summary: 'List salary slips' })
  @ApiQuery({ name: 'company', required: false })
  @ApiQuery({ name: 'employee', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getSalarySlips(
    @Query('company') company?: string,
    @Query('employee') employee?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const slips = await this.payrollService.getSalarySlips({
      company,
      employee,
      status,
      startDate,
      endDate,
    });
    return { slips, total: slips.length };
  }

  @Get('salary-slips/:name')
  @ApiOperation({ summary: 'Get salary slip by name' })
  async getSalarySlip(@Param('name') name: string) {
    return this.payrollService.getSalarySlip(name);
  }

  @Post('salary-slips')
  @ApiOperation({ summary: 'Create salary slip' })
  async createSalarySlip(@Body() data: any) {
    return this.payrollService.createSalarySlip(data);
  }

  @Post('salary-slips/:name/submit')
  @ApiOperation({ summary: 'Submit salary slip' })
  async submitSalarySlip(@Param('name') name: string) {
    return this.payrollService.submitSalarySlip(name);
  }

  // ==================== PAYROLL ENTRIES ====================

  @Get('entries')
  @ApiOperation({ summary: 'List payroll entries' })
  @ApiQuery({ name: 'company', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getPayrollEntries(
    @Query('company') company?: string,
    @Query('status') status?: string,
  ) {
    const entries = await this.payrollService.getPayrollEntries({
      company,
      status,
    });
    return { entries, total: entries.length };
  }

  @Get('entries/:name')
  @ApiOperation({ summary: 'Get payroll entry by name' })
  async getPayrollEntry(@Param('name') name: string) {
    return this.payrollService.getPayrollEntry(name);
  }

  @Post('entries')
  @ApiOperation({ summary: 'Create payroll entry' })
  async createPayrollEntry(@Body() data: any) {
    return this.payrollService.createPayrollEntry(data);
  }

  @Get('entries/:name/employees')
  @ApiOperation({ summary: 'Get employees for payroll entry' })
  async getPayrollEmployees(@Param('name') name: string) {
    return this.payrollService.getPayrollEmployees(name);
  }
}
