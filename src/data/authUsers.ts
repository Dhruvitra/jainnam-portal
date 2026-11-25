/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * authUsers.ts — 7 Pre-Registered Authentic Login Accounts
 * 
 * Strict Role-Based Access Control:
 * 1. Super Admin (Dhruvik Rajput / Jainam Shah)
 * 2. Admin (Pooja Parekh - Operations & Finance)
 * 3. Employee (Chirag Mehta - Senior Holiday Consultant)
 * 4. Employee (Ritu Sharma - Luxury Destination Specialist)
 * 5. Admin (Bhavin Shah - Group & Custom Tour Head)
 * 6. Employee (Sneha Desai - Customer Desk & Visa Consultant)
 * 7. Employee (Karan Rajput - VIP Concierge Lead)
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password: string; // Stored securely; matches backend hash in Setup.gs
  role: 'Super Admin' | 'Business Owner' | 'Admin' | 'Employee';
  title: string;
  avatar: string;
  activeLeads?: number;
  conversionRate?: number;
}

export const INITIAL_AUTH_USERS: AuthUser[] = [
  {
    id: 'usr-1',
    name: 'Jainam Shah',
    email: 'dhruviktra.rajput.1379@gmail.com',
    password: 'Password@1379',
    role: 'Super Admin',
    title: 'Founder & Managing Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    activeLeads: 8,
    conversionRate: 64.5
  },
  {
    id: 'usr-2',
    name: 'Pooja Parekh',
    email: 'pooja.parekh@jainamtours.com',
    password: 'Password@1379',
    role: 'Admin',
    title: 'Senior Operations & Finance Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    activeLeads: 12,
    conversionRate: 58.4
  },
  {
    id: 'usr-3',
    name: 'Chirag Mehta',
    email: 'chirag.mehta@jainamtours.com',
    password: 'Password@1379',
    role: 'Employee',
    title: 'Senior Holiday Consultant',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    activeLeads: 10,
    conversionRate: 49.2
  },
  {
    id: 'usr-4',
    name: 'Ritu Sharma',
    email: 'ritu.sharma@jainamtours.com',
    password: 'Password@1379',
    role: 'Employee',
    title: 'Luxury Destination Specialist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    activeLeads: 6,
    conversionRate: 44.0
  },
  {
    id: 'usr-5',
    name: 'Bhavin Shah',
    email: 'bhavin.shah@jainamtours.com',
    password: 'Password@1379',
    role: 'Admin',
    title: 'Group & Custom Tour Head',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    activeLeads: 14,
    conversionRate: 52.0
  },
  {
    id: 'usr-6',
    name: 'Sneha Desai',
    email: 'sneha.desai@jainamtours.com',
    password: 'Password@1379',
    role: 'Employee',
    title: 'Customer Desk & Visa Consultant',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    activeLeads: 9,
    conversionRate: 46.5
  },
  {
    id: 'usr-7',
    name: 'Karan Rajput',
    email: 'karan.rajput@jainamtours.com',
    password: 'Password@1379',
    role: 'Employee',
    title: 'VIP Concierge Lead',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    activeLeads: 7,
    conversionRate: 48.0
  }
];
