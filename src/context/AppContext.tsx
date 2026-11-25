import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageId,
  WhatsAppNumber,
  Customer,
  TourPackage,
  Conversation,
  Booking,
  FollowUp,
  Campaign,
  KnowledgeItem,
  TeamMember,
  Message
} from '../types';
import {
  INITIAL_NUMBERS,
  INITIAL_PACKAGES,
  INITIAL_CUSTOMERS,
  INITIAL_CONVERSATIONS,
  INITIAL_BOOKINGS,
  INITIAL_FOLLOWUPS,
  INITIAL_CAMPAIGNS,
  INITIAL_KNOWLEDGE_BASE,
  INITIAL_TEAM_MEMBERS
} from '../data/mockData';
import { AuthUser, INITIAL_AUTH_USERS } from '../data/authUsers';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  isAuthenticated: boolean;
  validUsers: AuthUser[];
  inviteMember: (data: { name: string; email: string; role: 'Admin' | 'Employee'; title: string; password: string }) => { success: boolean; error?: string };
  currentUser: {
    id?: string;
    name: string;
    email: string;
    businessName: string;
    tagline: string;
    role: string;
    avatar: string;
  };
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  
  isAiActive: boolean;
  setIsAiActive: (active: boolean) => void;
  
  whatsappNumbers: WhatsAppNumber[];
  selectedNumberId: string;
  setSelectedNumberId: (id: string) => void;
  selectedNumber: WhatsAppNumber;
  addWhatsAppNumber: (num: Omit<WhatsAppNumber, 'id' | 'conversationsCount'>) => void;
  setDefaultWhatsAppNumber: (id: string) => void;
  
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (cust: Customer | null) => void;
  addCustomer: (cust: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  convertLeadToBooking: (customerId: string, totalAmount?: number, notes?: string) => void;
  
  packages: TourPackage[];
  addPackage: (pkg: TourPackage) => void;
  updatePackage: (id: string, updates: Partial<TourPackage>) => void;
  deletePackage: (id: string) => void;
  duplicatePackage: (id: string) => void;
  
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  activeConversation: Conversation | undefined;
  sendMessage: (convId: string, text: string, sender: 'agent' | 'ai', mediaType?: 'image' | 'pdf' | 'audio', mediaUrl?: string) => void;
  generateAiResponse: (convId: string) => void;
  toggleConversationAi: (convId: string) => void;
  toggleConversationTakeover: (convId: string) => void;
  
  bookings: Booking[];
  addBooking: (b: Omit<Booking, 'id' | 'bookingRef' | 'bookingDate'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  recordBookingPayment: (bookingId: string, amount: number) => void;
  
  followups: FollowUp[];
  toggleFollowUpComplete: (id: string) => void;
  addFollowUp: (f: Omit<FollowUp, 'id' | 'isCompleted'>) => void;

  campaigns: Campaign[];
  addCampaign: (c: Omit<Campaign, 'id' | 'deliveredCount' | 'readRate' | 'responseRate'>) => void;

  knowledgeBase: KnowledgeItem[];
  addKnowledgeItem: (item: Omit<KnowledgeItem, 'id'>) => void;
  
  teamMembers: TeamMember[];
  
  toasts: ToastItem[];
  addToast: (title: string, message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
  
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isAddNumberModalOpen: boolean;
  setIsAddNumberModalOpen: (open: boolean) => void;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (open: boolean) => void;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getSaved<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      return JSON.parse(saved) as T;
    }
  } catch (e) {}
  return fallback;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedSession = localStorage.getItem('jainam_crm_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        return !!(parsed && parsed.email);
      }
    } catch (e) {}
    return false;
  });

  const [validUsers, setValidUsers] = useState<AuthUser[]>(() =>
    getSaved('jainam_crm_users', INITIAL_AUTH_USERS)
  );

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem('jainam_crm_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.email) return parsed;
      }
    } catch (e) {}
    return {
      id: 'usr-1',
      name: 'Jainam Shah',
      email: 'dhruviktra.rajput.1379@gmail.com',
      businessName: 'JAINAM TOURS AND TRAVELS',
      tagline: 'By Travellers, for Travellers',
      role: 'Founder & Managing Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    };
  });

  // Restore authenticated session on load
  useEffect(() => {
    const savedSession = localStorage.getItem('jainam_crm_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
          setIsAuthenticated(true);
        }
      } catch (e) {
        localStorage.removeItem('jainam_crm_session');
      }
    }
  }, []);

  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [isAiActive, setIsAiActive] = useState<boolean>(true);
  
  const [whatsappNumbers, setWhatsappNumbers] = useState<WhatsAppNumber[]>(() =>
    getSaved('jainam_crm_numbers', INITIAL_NUMBERS)
  );
  const [selectedNumberId, setSelectedNumberId] = useState<string>('num-1');
  
  const [customers, setCustomers] = useState<Customer[]>(() =>
    getSaved('jainam_crm_customers', INITIAL_CUSTOMERS)
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [packages, setPackages] = useState<TourPackage[]>(() =>
    getSaved('jainam_crm_packages', INITIAL_PACKAGES)
  );

  const [conversations, setConversations] = useState<Conversation[]>(() =>
    getSaved('jainam_crm_conversations', INITIAL_CONVERSATIONS)
  );
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');

  const [bookings, setBookings] = useState<Booking[]>(() =>
    getSaved('jainam_crm_bookings', INITIAL_BOOKINGS)
  );

  const [followups, setFollowups] = useState<FollowUp[]>(() =>
    getSaved('jainam_crm_followups', INITIAL_FOLLOWUPS)
  );

  const [campaigns, setCampaigns] = useState<Campaign[]>(() =>
    getSaved('jainam_crm_campaigns', INITIAL_CAMPAIGNS)
  );

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>(() =>
    getSaved('jainam_crm_kb', INITIAL_KNOWLEDGE_BASE)
  );

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    getSaved('jainam_crm_team', INITIAL_TEAM_MEMBERS)
  );
  
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAddNumberModalOpen, setIsAddNumberModalOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Sync state to localStorage on changes
  useEffect(() => { localStorage.setItem('jainam_crm_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('jainam_crm_packages', JSON.stringify(packages)); }, [packages]);
  useEffect(() => { localStorage.setItem('jainam_crm_conversations', JSON.stringify(conversations)); }, [conversations]);
  useEffect(() => { localStorage.setItem('jainam_crm_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('jainam_crm_followups', JSON.stringify(followups)); }, [followups]);
  useEffect(() => { localStorage.setItem('jainam_crm_campaigns', JSON.stringify(campaigns)); }, [campaigns]);
  useEffect(() => { localStorage.setItem('jainam_crm_kb', JSON.stringify(knowledgeBase)); }, [knowledgeBase]);
  useEffect(() => { localStorage.setItem('jainam_crm_numbers', JSON.stringify(whatsappNumbers)); }, [whatsappNumbers]);

  const selectedNumber = whatsappNumbers.find(n => n.id === selectedNumberId) || whatsappNumbers[0];
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const addToast = (title: string, message: string, type: ToastItem['type'] = 'success') => {
    const id = 'toast-' + Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPass = String(pass || '').trim();

    const matchedUser = validUsers.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
    );

    if (matchedUser) {
      const userProfile = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        businessName: 'JAINAM TOURS AND TRAVELS',
        tagline: 'By Travellers, for Travellers',
        role: matchedUser.title || matchedUser.role,
        avatar: matchedUser.avatar
      };
      setCurrentUser(userProfile);
      setIsAuthenticated(true);
      localStorage.setItem('jainam_crm_session', JSON.stringify(userProfile));
      addToast('Welcome Back', `Signed in as ${matchedUser.name} (${matchedUser.role})`, 'success');
      return true;
    }

    return false;
  };

  const inviteMember = (data: { name: string; email: string; role: 'Admin' | 'Employee'; title: string; password: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (validUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'A staff account with this email address already exists.' };
    }

    const newId = 'usr-' + (validUsers.length + 1);
    const newUser: AuthUser = {
      id: newId,
      name: data.name,
      email: cleanEmail,
      password: data.password,
      role: data.role,
      title: data.title,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      activeLeads: 0,
      conversionRate: 0
    };

    const updatedUsers = [...validUsers, newUser];
    setValidUsers(updatedUsers);
    localStorage.setItem('jainam_crm_users', JSON.stringify(updatedUsers));

    const newTeamMember: TeamMember = {
      id: 'team-' + newId,
      name: data.name,
      email: cleanEmail,
      role: data.title,
      avatar: newUser.avatar,
      activeLeads: 0,
      conversionRate: 0,
      status: 'Active'
    };

    const updatedTeam = [...teamMembers, newTeamMember];
    setTeamMembers(updatedTeam);
    localStorage.setItem('jainam_crm_team', JSON.stringify(updatedTeam));

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsLogoutModalOpen(false);
    localStorage.removeItem('jainam_crm_session');
    setActivePage('dashboard');
    addToast('Signed Out', 'You have been safely signed out.', 'info');
  };

  const addWhatsAppNumber = (numData: Omit<WhatsAppNumber, 'id' | 'conversationsCount'>) => {
    const newId = 'num-' + (whatsappNumbers.length + 1);
    const newNumber: WhatsAppNumber = {
      ...numData,
      id: newId,
      conversationsCount: 0
    };
    if (newNumber.isDefault) {
      setWhatsappNumbers(prev => prev.map(n => ({ ...n, isDefault: false })).concat(newNumber));
    } else {
      setWhatsappNumbers(prev => [...prev, newNumber]);
    }
    setSelectedNumberId(newId);
    addToast('Line Connected', `${newNumber.name} (${newNumber.phoneNumber}) is now active.`, 'success');
  };

  const setDefaultWhatsAppNumber = (id: string) => {
    setWhatsappNumbers(prev => prev.map(n => ({
      ...n,
      isDefault: n.id === id
    })));
    addToast('Default Updated', 'Primary business number set.', 'info');
  };

  const addCustomer = (custData: Omit<Customer, 'id'>) => {
    const newId = 'cust-' + (customers.length + 1);
    const newCustomer: Customer = {
      ...custData,
      id: newId
    };
    setCustomers(prev => [newCustomer, ...prev]);
    addToast('Customer Saved', `${newCustomer.name} added to client records.`, 'success');
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    if (selectedCustomer?.id === id) {
      setSelectedCustomer(prev => prev ? { ...prev, ...updates } : null);
    }
    addToast('Details Updated', 'Customer record updated successfully.', 'info');
  };

  const deleteCustomer = (id: string) => {
    const target = customers.find(c => c.id === id);
    setCustomers(prev => prev.filter(c => c.id !== id));
    if (selectedCustomer?.id === id) {
      setSelectedCustomer(null);
    }
    addToast('Record Removed', `Customer "${target?.name || id}" deleted.`, 'warning');
  };

  const convertLeadToBooking = (customerId: string, totalAmount?: number, notes?: string) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    const amount = totalAmount || cust.budget || 50000;
    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      bookingRef: 'JTT-' + Math.floor(10000 + Math.random() * 90000),
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.whatsappNumber,
      packageId: 'pkg-custom',
      packageName: `${cust.destination || 'Custom'} Tour Package`,
      destination: cust.destination || 'Domestic',
      travelDates: cust.travelDate || 'Upcoming Season',
      travellers: cust.travellers || 2,
      totalAmount: amount,
      paidAmount: 0,
      currency: cust.currency || 'INR',
      paymentStatus: 'Pending',
      bookingStatus: 'Confirmed',
      bookingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      assignedAgent: cust.assignedEmployee || currentUser.name
    };

    setBookings(prev => [newBooking, ...prev]);
    updateCustomer(customerId, { leadStatus: 'Confirmed', totalBookings: (cust.totalBookings || 0) + 1 });
    addToast('Lead Converted!', `Booking ${newBooking.bookingRef} created for ${cust.name}.`, 'success');
  };

  const addPackage = (pkg: TourPackage) => {
    setPackages(prev => [pkg, ...prev]);
    addToast('Package Published', `"${pkg.name}" is now live in the catalog.`, 'success');
  };

  const updatePackage = (id: string, updates: Partial<TourPackage>) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addToast('Package Saved', 'Tour package details updated.', 'info');
  };

  const deletePackage = (id: string) => {
    const pkg = packages.find(p => p.id === id);
    setPackages(prev => prev.filter(p => p.id !== id));
    addToast('Package Removed', `"${pkg?.name || 'Package'}" deleted.`, 'warning');
  };

  const duplicatePackage = (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;
    const duplicated: TourPackage = {
      ...pkg,
      id: 'pkg-' + Date.now(),
      name: `${pkg.name} (Copy)`,
      isActive: false
    };
    setPackages(prev => [duplicated, ...prev]);
    addToast('Package Duplicated', `Duplicate created for "${pkg.name}".`, 'info');
  };

  const sendMessage = (
    convId: string,
    text: string,
    sender: 'agent' | 'ai',
    mediaType?: 'image' | 'pdf' | 'audio',
    mediaUrl?: string
  ) => {
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
      isAI: sender === 'ai',
      mediaType,
      mediaUrl
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          lastMessage: text || (mediaType ? `[${mediaType.toUpperCase()} file]` : 'Attachment'),
          time: 'Just now',
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));
  };

  const generateAiResponse = (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;

    let responseDraft = `Jai Jinendra ${conv.customerName.split(' ')[0]} ji! 🙏 Yes, we assure you that 100% pure vegetarian and Jain dining (strictly without onion & garlic) will be arranged throughout your stay. Would you like me to share our customized quotation brochure with you?`;
    
    if (conv.destination.toLowerCase().includes('kashmir')) {
      responseDraft = `Jai Jinendra ${conv.customerName.split(' ')[0]} ji! 🙏 Yes, absolutely. We arrange specialized Jain food on the Dal Lake heritage houseboat as well as at our partner hotels in Gulmarg & Pahalgam. Our dedicated chauffeur will also guide you to verified vegetarian restaurants throughout your journey.`;
    } else if (conv.destination.toLowerCase().includes('swiss')) {
      responseDraft = `Jai Jinendra ${conv.customerName.split(' ')[0]} ji! 🙏 Yes, all 4 seats on the Glacier Express Excellence Class have guaranteed panoramic window view tables with personalized service and Indian pure vegetarian lunch arranged aboard.`;
    }

    sendMessage(convId, responseDraft, 'agent');
    addToast('Response Drafted', `Suggested reply sent to ${conv.customerName}.`, 'success');
  };

  const toggleConversationAi = (convId: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        const next = !c.isAiActive;
        addToast(
          next ? 'AI Enabled' : 'AI Paused',
          next ? 'AI Assistant is now auto-responding for this chat.' : 'AI paused. Human agent in control.',
          'info'
        );
        return { ...c, isAiActive: next };
      }
      return c;
    }));
  };

  const toggleConversationTakeover = (convId: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        const next = !c.isAiActive;
        addToast(
          next ? 'AI Handed Over' : 'Human Takeover Activated',
          next ? 'Returned conversation to AI auto-pilot.' : 'Conversation claimed by human consultant.',
          'warning'
        );
        return { ...c, isAiActive: next };
      }
      return c;
    }));
  };

  const addBooking = (bData: Omit<Booking, 'id' | 'bookingRef' | 'bookingDate'>) => {
    const newBooking: Booking = {
      ...bData,
      id: 'bk-' + Date.now(),
      bookingRef: 'JTT-' + Math.floor(10000 + Math.random() * 90000),
      bookingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setBookings(prev => [newBooking, ...prev]);
    addToast('Booking Created', `Booking reference ${newBooking.bookingRef} registered.`, 'success');
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    addToast('Booking Updated', 'Booking record modified.', 'info');
  };

  const recordBookingPayment = (bookingId: string, amount: number) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const newPaid = b.paidAmount + amount;
        const newStatus = newPaid >= b.totalAmount ? 'Paid' : 'Partial';
        addToast('Payment Recorded', `₹${amount.toLocaleString('en-IN')} added. Status: ${newStatus}.`, 'success');
        return {
          ...b,
          paidAmount: newPaid,
          paymentStatus: newStatus
        };
      }
      return b;
    }));
  };

  const toggleFollowUpComplete = (id: string) => {
    setFollowups(prev => prev.map(f => {
      if (f.id === id) {
        const nextState = !f.isCompleted;
        addToast(
          nextState ? 'Completed' : 'Reopened',
          `Follow-up marked as ${nextState ? 'done' : 'pending'}.`,
          'info'
        );
        return { ...f, isCompleted: nextState };
      }
      return f;
    }));
  };

  const addFollowUp = (fData: Omit<FollowUp, 'id' | 'isCompleted'>) => {
    const newFollowUp: FollowUp = {
      ...fData,
      id: 'fu-' + Date.now(),
      isCompleted: false
    };
    setFollowups(prev => [newFollowUp, ...prev]);
    addToast('Follow-Up Scheduled', `Task created for ${newFollowUp.customerName}.`, 'success');
  };

  const addCampaign = (cData: Omit<Campaign, 'id' | 'deliveredCount' | 'readRate' | 'responseRate'>) => {
    const newCampaign: Campaign = {
      ...cData,
      id: 'camp-' + Date.now(),
      deliveredCount: 0,
      readRate: 0,
      responseRate: 0
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    addToast('Campaign Created', `"${newCampaign.title}" is ready.`, 'success');
  };

  const addKnowledgeItem = (itemData: Omit<KnowledgeItem, 'id'>) => {
    const newItem: KnowledgeItem = {
      ...itemData,
      id: 'kb-' + (knowledgeBase.length + 1)
    };
    setKnowledgeBase(prev => [newItem, ...prev]);
    addToast('Saved', 'Knowledge base entry saved.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        validUsers,
        inviteMember,
        currentUser,
        login,
        logout,
        activePage,
        setActivePage,
        isAiActive,
        setIsAiActive,
        whatsappNumbers,
        selectedNumberId,
        setSelectedNumberId,
        selectedNumber,
        addWhatsAppNumber,
        setDefaultWhatsAppNumber,
        customers,
        selectedCustomer,
        setSelectedCustomer,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        convertLeadToBooking,
        packages,
        addPackage,
        updatePackage,
        deletePackage,
        duplicatePackage,
        conversations,
        activeConversationId,
        setActiveConversationId,
        activeConversation,
        sendMessage,
        generateAiResponse,
        toggleConversationAi,
        toggleConversationTakeover,
        bookings,
        addBooking,
        updateBooking,
        recordBookingPayment,
        followups,
        toggleFollowUpComplete,
        addFollowUp,
        campaigns,
        addCampaign,
        knowledgeBase,
        addKnowledgeItem,
        teamMembers,
        toasts,
        addToast,
        removeToast,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isAddNumberModalOpen,
        setIsAddNumberModalOpen,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen,
        isLogoutModalOpen,
        setIsLogoutModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
