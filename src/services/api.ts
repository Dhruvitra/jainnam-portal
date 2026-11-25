/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * api.ts — Frontend API Client Adapter for Google Apps Script Backend
 * 
 * Communicates with the Google Apps Script Web App endpoint via JSON POST requests.
 * If no backend URL is set, gracefully falls back to local authenticated state.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || '';
const TOKEN_KEY = 'jainam_crm_session_token';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  public getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  public isConnectedToBackend(): boolean {
    return Boolean(BACKEND_URL && BACKEND_URL.startsWith('http'));
  }

  /**
   * Main request method
   */
  public async request<T = any>(action: string, data: any = {}): Promise<ApiResponse<T>> {
    if (!this.isConnectedToBackend()) {
      // Offline / Local Simulation Mode
      return {
        success: true,
        data: undefined,
        code: 200
      };
    }

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // Preferred for GAS CORS preflight avoidance
        },
        body: JSON.stringify({
          action,
          token: this.getToken(),
          data
        })
      });

      const json: ApiResponse<T> = await response.json();
      return json;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error connecting to backend service.',
        code: 500
      };
    }
  }

  // --- AUTH ---
  public async authStatus() {
    return this.request('authStatus');
  }

  public async authCreateOwner(ownerData: { name: string; businessName: string; email: string; password: string; phone?: string }) {
    const res = await this.request('authCreateOwner', ownerData);
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  public async authLogin(email: string, password: string) {
    const res = await this.request('authLogin', { email, password });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  public async authLogout() {
    const res = await this.request('authLogout');
    this.setToken(null);
    return res;
  }

  public async authMe() {
    return this.request('authMe');
  }

  public async changePassword(oldPassword: string, newPassword: string) {
    return this.request('changePassword', { oldPassword, newPassword });
  }

  public async forgotPassword(email: string) {
    return this.request('forgotPassword', { email });
  }

  // --- DASHBOARD & ANALYTICS ---
  public async getDashboard() {
    return this.request('getDashboard');
  }

  public async getAnalytics() {
    return this.request('getAnalytics');
  }

  public async getRecentActivity() {
    return this.request('getRecentActivity');
  }

  // --- CUSTOMERS ---
  public async getCustomers(filters?: any, pagination?: { page: number; limit: number }) {
    return this.request('getCustomers', { filters, pagination });
  }

  public async getCustomer(customerId: string) {
    return this.request('getCustomer', { customerId });
  }

  public async createCustomer(customerData: any) {
    return this.request('createCustomer', customerData);
  }

  public async updateCustomer(customerId: string, updates: any) {
    return this.request('updateCustomer', { customerId, updates });
  }

  public async deleteCustomer(customerId: string) {
    return this.request('deleteCustomer', { customerId });
  }

  // --- PACKAGES ---
  public async getPackages(filters?: any) {
    return this.request('getPackages', { filters });
  }

  public async getPackage(packageId: string) {
    return this.request('getPackage', { packageId });
  }

  public async createPackage(packageData: any) {
    return this.request('createPackage', packageData);
  }

  public async updatePackage(packageId: string, updates: any) {
    return this.request('updatePackage', { packageId, updates });
  }

  public async deletePackage(packageId: string) {
    return this.request('deletePackage', { packageId });
  }

  public async duplicatePackage(packageId: string) {
    return this.request('duplicatePackage', { packageId });
  }

  public async uploadPackageBrochure(packageId: string, base64Data: string, filename?: string) {
    return this.request('uploadPackageBrochure', { packageId, base64Data, filename });
  }

  // --- MESSAGES ---
  public async getMessages(customerId: string) {
    return this.request('getMessages', { customerId });
  }

  public async getConversation(customerId: string) {
    return this.request('getConversation', { customerId });
  }

  public async saveMessage(messageData: any) {
    return this.request('saveMessage', messageData);
  }

  public async createOutboxMessage(outboxData: any) {
    return this.request('createOutboxMessage', outboxData);
  }

  // --- QUOTATIONS ---
  public async calculateQuotation(quoteData: any) {
    return this.request('calculateQuotation', quoteData);
  }

  public async createQuotation(quoteData: any) {
    return this.request('createQuotation', quoteData);
  }

  public async getQuotations(customerId?: string) {
    return this.request('getQuotations', { customerId });
  }

  public async generateQuotationPDF(quotationId: string) {
    return this.request('generateQuotationPDF', { quotationId });
  }

  // --- LEADS & PIPELINE ---
  public async getLeads(filters?: any) {
    return this.request('getLeads', { filters });
  }

  public async convertLeadToBooking(leadId: string, bookingData: any) {
    return this.request('convertLeadToBooking', { leadId, bookingData });
  }

  // --- BOOKINGS & PAYMENTS ---
  public async createBooking(bookingData: any) {
    return this.request('createBooking', bookingData);
  }

  public async getBookings(filters?: any) {
    return this.request('getBookings', { filters });
  }

  public async updateBooking(bookingId: string, updates: any) {
    return this.request('updateBooking', { bookingId, updates });
  }

  public async updatePaymentStatus(bookingId: string, paidAmount: number, paymentStatus?: string) {
    return this.request('updatePaymentStatus', { bookingId, paidAmount, paymentStatus });
  }

  public async getPayments(bookingId?: string) {
    return this.request('getPayments', { bookingId });
  }

  public async recordPayment(paymentData: { bookingId: string; amount: number; paymentMethod?: string; transactionRef?: string; receiptUrl?: string; notes?: string }) {
    return this.request('recordPayment', paymentData);
  }

  // --- AI ASSISTANT & META DISPATCH ---
  public async matchPackage(query: string) {
    return this.request('matchPackage', { query });
  }

  public async generateAiReply(customerName: string, query: string) {
    return this.request('generateAiReply', { customerName, query });
  }

  public async sendWhatsAppMessage(numberId: string, recipientPhone: string, text: string, mediaUrl?: string, templateData?: any) {
    return this.request('sendWhatsAppMessage', { numberId, recipientPhone, text, mediaUrl, templateData });
  }

  public async verifyMetaConnection() {
    return this.request('verifyMetaConnection');
  }

  public async updateMetaCredentials(credentials: { accessToken?: string; phoneId?: string; wabaId?: string; verifyToken?: string; graphVersion?: string }) {
    return this.request('updateMetaCredentials', credentials);
  }

  public async checkServiceWindow(customerId: string) {
    return this.request('checkServiceWindow', { customerId });
  }

  public async getApprovedTemplates() {
    return this.request('getApprovedTemplates');
  }

  // --- WHATSAPP NUMBERS ---
  public async getWhatsAppNumbers() {
    return this.request('getWhatsAppNumbers');
  }

  public async addWhatsAppNumber(numberData: any) {
    return this.request('addWhatsAppNumber', numberData);
  }

  public async selectDefaultNumber(numberId: string) {
    return this.request('selectDefaultNumber', { numberId });
  }

  // --- SETTINGS ---
  public async getSettings() {
    return this.request('getSettings');
  }

  public async updateSettings(settings: Record<string, string>) {
    return this.request('updateSettings', { settings });
  }

  // --- REPORTS ---
  public async getLeadReport() {
    return this.request('getLeadReport');
  }

  public async getBookingReport() {
    return this.request('getBookingReport');
  }

  public async getRevenueReport() {
    return this.request('getRevenueReport');
  }
}

export const api = new ApiClient();
