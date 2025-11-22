import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AccountingService } from './accounting.service';

@ApiTags('accounting')
@Controller('accounting')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get accounting dashboard summary' })
  @ApiQuery({ name: 'company', required: false })
  async getDashboard(@Query('company') company?: string) {
    return this.accountingService.getDashboardSummary(company);
  }

  // ==================== CHART OF ACCOUNTS ====================

  @Get('accounts')
  @ApiOperation({ summary: 'Get chart of accounts' })
  @ApiQuery({ name: 'company', required: false })
  async getAccounts(@Query('company') company?: string) {
    const accounts = await this.accountingService.getAccounts(company);
    return { accounts, total: accounts.length };
  }

  @Get('accounts/:name')
  @ApiOperation({ summary: 'Get account by name' })
  async getAccount(@Param('name') name: string) {
    return this.accountingService.getAccount(name);
  }

  @Get('accounts/:name/balance')
  @ApiOperation({ summary: 'Get account balance' })
  @ApiQuery({ name: 'company', required: true })
  @ApiQuery({ name: 'date', required: false })
  async getAccountBalance(
    @Param('name') name: string,
    @Query('company') company: string,
    @Query('date') date?: string,
  ) {
    const balance = await this.accountingService.getAccountBalance(name, company, date);
    return { account: name, balance };
  }

  // ==================== JOURNAL ENTRIES ====================

  @Get('journal-entries')
  @ApiOperation({ summary: 'List journal entries' })
  @ApiQuery({ name: 'company', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getJournalEntries(
    @Query('company') company?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const entries = await this.accountingService.getJournalEntries({
      company,
      startDate,
      endDate,
    });
    return { entries, total: entries.length };
  }

  @Get('journal-entries/:name')
  @ApiOperation({ summary: 'Get journal entry by name' })
  async getJournalEntry(@Param('name') name: string) {
    return this.accountingService.getJournalEntry(name);
  }

  @Post('journal-entries')
  @ApiOperation({ summary: 'Create journal entry' })
  async createJournalEntry(@Body() data: any) {
    return this.accountingService.createJournalEntry(data);
  }

  // ==================== SALES INVOICES ====================

  @Get('sales-invoices')
  @ApiOperation({ summary: 'List sales invoices' })
  @ApiQuery({ name: 'company', required: false })
  @ApiQuery({ name: 'customer', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getSalesInvoices(
    @Query('company') company?: string,
    @Query('customer') customer?: string,
    @Query('status') status?: string,
  ) {
    const invoices = await this.accountingService.getSalesInvoices({
      company,
      customer,
      status,
    });
    return { invoices, total: invoices.length };
  }

  @Get('sales-invoices/:name')
  @ApiOperation({ summary: 'Get sales invoice by name' })
  async getSalesInvoice(@Param('name') name: string) {
    return this.accountingService.getSalesInvoice(name);
  }

  @Post('sales-invoices')
  @ApiOperation({ summary: 'Create sales invoice' })
  async createSalesInvoice(@Body() data: any) {
    return this.accountingService.createSalesInvoice(data);
  }

  // ==================== PURCHASE INVOICES ====================

  @Get('purchase-invoices')
  @ApiOperation({ summary: 'List purchase invoices' })
  @ApiQuery({ name: 'company', required: false })
  @ApiQuery({ name: 'supplier', required: false })
  async getPurchaseInvoices(
    @Query('company') company?: string,
    @Query('supplier') supplier?: string,
  ) {
    const invoices = await this.accountingService.getPurchaseInvoices({
      company,
      supplier,
    });
    return { invoices, total: invoices.length };
  }

  @Get('purchase-invoices/:name')
  @ApiOperation({ summary: 'Get purchase invoice by name' })
  async getPurchaseInvoice(@Param('name') name: string) {
    return this.accountingService.getPurchaseInvoice(name);
  }

  @Post('purchase-invoices')
  @ApiOperation({ summary: 'Create purchase invoice' })
  async createPurchaseInvoice(@Body() data: any) {
    return this.accountingService.createPurchaseInvoice(data);
  }

  // ==================== PAYMENT ENTRIES ====================

  @Get('payments')
  @ApiOperation({ summary: 'List payment entries' })
  @ApiQuery({ name: 'company', required: false })
  @ApiQuery({ name: 'partyType', required: false })
  @ApiQuery({ name: 'party', required: false })
  @ApiQuery({ name: 'paymentType', required: false })
  async getPayments(
    @Query('company') company?: string,
    @Query('partyType') partyType?: string,
    @Query('party') party?: string,
    @Query('paymentType') paymentType?: string,
  ) {
    const payments = await this.accountingService.getPaymentEntries({
      company,
      partyType,
      party,
      paymentType,
    });
    return { payments, total: payments.length };
  }

  @Get('payments/:name')
  @ApiOperation({ summary: 'Get payment entry by name' })
  async getPayment(@Param('name') name: string) {
    return this.accountingService.getPaymentEntry(name);
  }

  @Post('payments')
  @ApiOperation({ summary: 'Create payment entry' })
  async createPayment(@Body() data: any) {
    return this.accountingService.createPaymentEntry(data);
  }

  // ==================== CUSTOMERS & SUPPLIERS ====================

  @Get('customers')
  @ApiOperation({ summary: 'List customers' })
  @ApiQuery({ name: 'company', required: false })
  async getCustomers(@Query('company') company?: string) {
    const customers = await this.accountingService.getCustomers(company);
    return { customers, total: customers.length };
  }

  @Get('suppliers')
  @ApiOperation({ summary: 'List suppliers' })
  async getSuppliers() {
    const suppliers = await this.accountingService.getSuppliers();
    return { suppliers, total: suppliers.length };
  }
}
