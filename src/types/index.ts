export type PageId =
  | 'dashboard'
  | 'inbox'
  | 'customers'
  | 'leads'
  | 'packages'
  | 'builder'
  | 'quotations'
  | 'bookings'
  | 'followups'
  | 'campaigns'
  | 'knowledge'
  | 'ai-settings'
  | 'whatsapp-numbers'
  | 'whatsapp-status'
  | 'integrations'
  | 'reports'
  | 'team'
  | 'business-settings'
  | 'profile'
  | 'logout';

export type LeadStatus = 'New Enquiry' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Confirmed' | 'Lost';
export type BookingStatus = 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Refunded';

export interface WhatsAppNumber {
  id: string;
  phoneNumber: string;
  name: string;
  countryCode: string;
  status: 'connected' | 'qr_pending' | 'disconnected';
  isDefault: boolean;
  avatar?: string;
  conversationsCount: number;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  whatsappNumber: string;
  email: string;
  destination: string;
  travelDate: string;
  travellers: number;
  budget: number;
  currency?: string;
  leadStatus: LeadStatus;
  lastConversation: string;
  assignedEmployee: string;
  notes?: string;
  interests?: string[];
  totalBookings?: number;
}

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  hotel?: string;
}

export interface TourPackage {
  id: string;
  name: string;
  destination: string;
  country: string;
  duration: string;
  nights: number;
  pricePerPerson: number;
  childPrice: number;
  groupPrice: number;
  currency?: string;
  hotelCategory: number; // 3, 4, 5 star
  hotelDetails: string;
  transportation: string;
  meals: string;
  inclusions: string[];
  exclusions: string[];
  dailyItinerary: DayItinerary[];
  highlights: string[];
  bestSeason: string;
  availableDates: string[];
  images: string[];
  pdfBrochureUrl?: string;
  terms: string;
  isActive: boolean;
  featured?: boolean;
}

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'ai';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  mediaType?: 'image' | 'pdf' | 'audio';
  isAI?: boolean;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  whatsappNumber: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  whatsappAccountId: string;
  isAiActive: boolean;
  leadStatus: LeadStatus;
  destination: string;
  budget: number;
  currency?: string;
  travelDates: string;
  travellers: number;
  messages: Message[];
  internalNotes: string;
  tags: string[];
}

export interface Booking {
  id: string;
  bookingRef: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  packageId: string;
  packageName: string;
  destination: string;
  travelDates: string;
  travellers: number;
  totalAmount: number;
  paidAmount: number;
  currency?: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  bookingDate: string;
  assignedAgent: string;
}

export interface FollowUp {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  destination: string;
  dueDate: string;
  dueTime: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
  assignedTo: string;
}

export interface Campaign {
  id: string;
  title: string;
  targetAudience: string;
  recipientsCount: number;
  deliveredCount: number;
  readRate: number;
  responseRate: number;
  status: 'Scheduled' | 'Sent' | 'Draft';
  scheduledDate: string;
  templateSnippet: string;
}

export interface KnowledgeItem {
  id: string;
  category: 'Visa' | 'Destinations' | 'Cancellation' | 'Payment' | 'General';
  question: string;
  answer: string;
  keywords: string[];
  confidenceScore: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  activeLeads: number;
  conversionRate: number;
  status?: 'Active' | 'Away' | 'Offline';
}

export interface CustomPackageQuotation {
  quotationRef?: string;
  destination: string;
  departureCity: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  hotelCategory: number;
  transportType: string;
  mealPlan: string;
  sightseeing: string[];
  specialRequests: string;
  days: DayItinerary[];
  hotelCost: number;
  transportCost: number;
  activityCost: number;
  serviceTax: number;
  marginPercent: number;
  totalEstimatedPrice: number;
  pricePerPerson: number;
  clientName?: string;
  clientPhone?: string;
}
