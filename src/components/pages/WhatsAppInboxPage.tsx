import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Send,
  Paperclip,
  CheckCheck,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  User,
  Share2,
  Phone,
  Bot,
  UserCheck,
  Sparkles,
  FileText,
  Radio,
  MessageSquare
} from 'lucide-react';
import { LeadStatus } from '../../types';
import { ButtonSpinner } from '../common/ButtonSpinner';

export const WhatsAppInboxPage: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    sendMessage,
    generateAiResponse,
    toggleConversationAi,
    toggleConversationTakeover,
    selectedNumber,
    packages,
    setActivePage,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'enquiries' | 'takeover'>('all');
  const [inputText, setInputText] = useState('');
  const [internalNotes, setInternalNotes] = useState(activeConversation?.internalNotes || '');
  const [leadStatus, setLeadStatus] = useState<LeadStatus>(activeConversation?.leadStatus || 'Proposal Sent');
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  React.useEffect(() => {
    if (activeConversation) {
      setInternalNotes(activeConversation.internalNotes);
      setLeadStatus(activeConversation.leadStatus);
    }
  }, [activeConversationId]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversation || isSending) return;

    setIsSending(true);
    try {
      // Simulate brief network dispatch
      await new Promise(r => setTimeout(r, 350));
      sendMessage(activeConversation.id, inputText, 'agent');
      setInputText('');
    } finally {
      setIsSending(false);
    }
  };

  const handleSmartReply = async () => {
    if (!activeConversation || isDrafting) return;
    setIsDrafting(true);
    try {
      await new Promise(r => setTimeout(r, 450));
      generateAiResponse(activeConversation.id);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSendBrochure = (pkgId: string) => {
    const pkg = packages.find(p => p.id === pkgId);
    if (!pkg || !activeConversation) return;

    sendMessage(
      activeConversation.id,
      `Jai Jinendra! 🙏 Here is the verified itinerary and pricing for "${pkg.name}" (${pkg.duration}): Starting at ₹${pkg.pricePerPerson.toLocaleString('en-IN')} per person, including 5-star hotel/houseboat accommodations, 100% pure veg & Jain meals, and private vehicle throughout.`,
      'agent',
      'image',
      pkg.images[0]
    );
    addToast('Brochure Sent', `Attached ${pkg.name} to WhatsApp conversation.`, 'success');
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.whatsappNumber.includes(searchQuery) ||
      c.destination.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'unread') return c.unreadCount > 0;
    if (filterTab === 'enquiries') return c.leadStatus === 'New Enquiry' || c.leadStatus === 'Proposal Sent';
    if (filterTab === 'takeover') return !c.isAiActive;
    return true;
  });

  return (
    <div className="h-full min-h-[520px] bg-white rounded-2xl border border-[#EAE6DE] shadow-card overflow-hidden flex flex-col md:flex-row animate-in fade-in duration-200">
      {/* LEFT PANEL: Conversation List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-[#EAE6DE] flex flex-col bg-white flex-shrink-0">
        {/* Header */}
        <div className="p-3.5 border-b border-[#EAE6DE] space-y-2.5 bg-[#FAF9F6]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#292929]">WhatsApp Customer Desk</h2>
            <span className="text-[10px] font-semibold bg-[#FAF4E8] text-[#A87922] px-2 py-0.5 rounded border border-[#F4E7C8]">
              {selectedNumber.name.split(' ')[0]} Line
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, phone, trip..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#EAE6DE] bg-white text-xs text-[#292929] placeholder:text-[#B3B3B3] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto text-[11px] font-semibold text-[#707070]">
            {[
              { id: 'all', label: 'All Inquiries' },
              { id: 'unread', label: 'Unread' },
              { id: 'enquiries', label: 'Active Leads' },
              { id: 'takeover', label: 'Human Only' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  filterTab === tab.id
                    ? 'bg-[#FAF4E8] text-[#A87922] font-bold border border-[#F4E7C8]'
                    : 'hover:bg-white text-[#707070]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#EAE6DE]">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3 cursor-pointer transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-[#FAF4E8] border-l-4 border-[#C99532]' : 'hover:bg-[#FAF9F6]'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.customerAvatar}
                      alt={conv.customerName}
                      className="w-11 h-11 rounded-full object-cover border border-[#EAE6DE]"
                    />
                    {conv.isAiActive ? (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#C99532] text-white flex items-center justify-center text-[9px] shadow-xs" title="AI Auto-Pilot Active">
                        <Bot className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] shadow-xs" title="Human Consultant in Control">
                        <UserCheck className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-[#292929] truncate">{conv.customerName}</h4>
                      <span className="text-[10px] text-[#8A8A8A] whitespace-nowrap">{conv.time}</span>
                    </div>

                    <p className="text-xs text-[#525252] line-clamp-1 leading-snug mb-1">
                      {conv.lastMessage}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-[#EAE6DE] text-[#707070] font-mono">
                        {conv.destination}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FAF4E8] text-[#A87922] font-semibold border border-[#F4E7C8]">
                        {conv.leadStatus}
                      </span>
                    </div>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#C99532] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-[#707070]">
              <div className="w-10 h-10 rounded-xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center mx-auto mb-2.5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#292929]">No Conversations</p>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Inbound WhatsApp chats from Meta Cloud API will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CENTER PANEL: Professional Travel Customer Chat */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-[#FAF9F6] relative">
          {/* Header */}
          <div className="h-16 px-4 bg-white border-b border-[#EAE6DE] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.customerAvatar}
                alt={activeConversation.customerName}
                className="w-10 h-10 rounded-full object-cover border border-[#EAE6DE]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#292929]">{activeConversation.customerName}</h3>
                  <span className="text-[10px] font-mono text-[#707070]">{activeConversation.whatsappNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#707070]">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online on WhatsApp
                  </span>
                  <span>•</span>
                  <span>Destination: <strong className="text-[#292929]">{activeConversation.destination}</strong></span>
                </div>
              </div>
            </div>

            {/* AI Control & Quick Reply */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleConversationTakeover(activeConversation.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                  activeConversation.isAiActive
                    ? 'bg-white border-[#EAE6DE] text-[#292929] hover:bg-[#FAF9F6]'
                    : 'bg-[#FAF4E8] border-[#F4E7C8] text-[#A87922]'
                }`}
                title={activeConversation.isAiActive ? 'Switch to Human Consultant' : 'Return to AI Auto-pilot'}
              >
                {activeConversation.isAiActive ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-[#C99532]" />
                    <span>AI Auto-Pilot</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-[#A87922]" />
                    <span>Human Takeover Active</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSmartReply}
                disabled={isDrafting}
                className="px-3 py-1.5 rounded-xl bg-[#FAF4E8] hover:bg-[#F4E7C8] text-[#A87922] text-xs font-semibold transition border border-[#F4E7C8] flex items-center gap-1.5"
                title="Draft quick response based on agency policy & package details"
              >
                {isDrafting ? (
                  <ButtonSpinner size="sm" label="Drafting..." />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Draft Reply</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Clean Travel Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-white">
            <div className="text-center my-2">
              <span className="inline-block px-3 py-1 rounded-lg bg-[#FAF9F6] text-[#707070] border border-[#EAE6DE] text-[11px]">
                Jainam Tours and Travels • Official WhatsApp Communication Line ({selectedNumber.phoneNumber})
              </span>
            </div>

            {activeConversation.messages.map((msg) => {
              const isOutgoing = msg.sender === 'agent' || msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                      isOutgoing
                        ? 'bg-[#FAF4E8] text-[#292929] border border-[#F4E7C8] rounded-tr-xs'
                        : 'bg-[#F2F2F2] text-[#292929] rounded-tl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] font-bold mb-1 opacity-70">
                      {isOutgoing ? (
                        <span className="text-[#A87922] flex items-center gap-1">
                          {msg.isAI ? <Bot className="w-3 h-3 text-[#C99532]" /> : <User className="w-3 h-3" />}
                          {msg.isAI ? 'AI Travel Assistant' : 'Jainam Tours Travel Consultant'}
                        </span>
                      ) : (
                        <span className="text-[#525252]">{activeConversation.customerName}</span>
                      )}
                      <span className="text-[9px] font-mono text-[#707070]">{msg.timestamp}</span>
                    </div>

                    {msg.mediaUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-[#EAE6DE]">
                        <img
                          src={msg.mediaUrl}
                          alt="Itinerary Brochure"
                          className="w-full h-44 object-cover"
                        />
                      </div>
                    )}

                    <p className="whitespace-pre-line">{msg.text}</p>

                    {isOutgoing && (
                      <div className="flex justify-end mt-1 text-[#C99532]">
                        <CheckCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Package Chips */}
          <div className="px-4 py-2 bg-[#FAF9F6] border-t border-[#EAE6DE] flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider flex-shrink-0">
              Quick Share:
            </span>
            <button
              onClick={() => handleSendBrochure('pkg-1')}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#EAE6DE] hover:border-[#C99532] text-[#292929] text-xs font-medium whitespace-nowrap"
            >
              🏔️ Share Kashmir Itinerary
            </button>
            <button
              onClick={() => handleSendBrochure('pkg-3')}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#EAE6DE] hover:border-[#C99532] text-[#292929] text-xs font-medium whitespace-nowrap"
            >
              🇨🇭 Share Swiss Alps Itinerary
            </button>
            <button
              onClick={() => {
                setInputText("Jai Jinendra! 🙏 Could you please confirm your preferred departure dates and the total number of travelers?");
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#EAE6DE] hover:border-[#C99532] text-[#292929] text-xs font-medium whitespace-nowrap"
            >
              📅 Ask Travel Dates
            </button>
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-[#EAE6DE] flex items-center gap-2"
          >
            <button
              type="button"
              className="p-2 text-[#8A8A8A] hover:text-[#292929] rounded-xl hover:bg-[#FAF9F6]"
              title="Attach Brochure / Voucher"
              onClick={() => handleSendBrochure('pkg-1')}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type customer reply as travel consultant..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-xs text-[#292929] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="px-4 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] disabled:opacity-50 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
            >
              {isSending ? (
                <ButtonSpinner size="sm" label="Sending..." />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#707070] bg-[#FAF9F6]">
          <img
            src="/jainam-logo.png"
            alt="Jainam Tours"
            className="h-16 w-auto object-contain opacity-85 mb-3"
          />
          <h3 className="text-sm font-bold text-[#292929]">WhatsApp Customer Desk</h3>
          <p className="text-xs text-[#707070] max-w-sm mt-1 leading-relaxed">
            Select an active customer enquiry to reply to WhatsApp messages, share verified itineraries, or generate quotations.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-[#A87922] font-semibold bg-[#FAF4E8] px-3.5 py-1.5 rounded-xl border border-[#F4E7C8]">
            <Radio className="w-3.5 h-3.5 text-[#C99532] animate-pulse" />
            <span>Meta WhatsApp Cloud API Active</span>
          </div>
        </div>
      )}

      {/* RIGHT PANEL: Customer Intelligence & Travel Preferences */}
      {activeConversation && (
        <div className="w-full md:w-72 lg:w-80 border-l border-[#EAE6DE] bg-white p-4 flex flex-col overflow-y-auto space-y-4">
          <div className="text-center pb-3 border-b border-[#EAE6DE]">
            <img
              src={activeConversation.customerAvatar}
              alt={activeConversation.customerName}
              className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-[#EAE6DE] mb-2"
            />
            <h3 className="text-sm font-bold text-[#292929]">{activeConversation.customerName}</h3>
            <p className="text-xs text-[#707070] font-mono">{activeConversation.whatsappNumber}</p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1.5">
              Enquiry Status
            </label>
            <select
              value={leadStatus}
              onChange={(e) => {
                const next = e.target.value as LeadStatus;
                setLeadStatus(next);
                addToast('Status Updated', `${activeConversation.customerName} is now "${next}".`, 'info');
              }}
              className="w-full px-3 py-1.5 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#292929] bg-[#FAF9F6] focus:outline-none"
            >
              <option value="New Enquiry">New Enquiry</option>
              <option value="Contacted">Contacted</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">
              Customer Trip Preferences
            </span>
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#707070] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C99532]" />
                  Destination:
                </span>
                <strong className="text-[#292929]">{activeConversation.destination}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#707070] flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#A87922]" />
                  Budget:
                </span>
                <strong className="text-[#292929] font-mono">₹{activeConversation.budget.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#707070] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#525252]" />
                  Travel Dates:
                </span>
                <span className="font-semibold text-[#292929]">{activeConversation.travelDates}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#707070] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#525252]" />
                  Guests:
                </span>
                <span className="font-semibold text-[#292929]">{activeConversation.travellers} Guests</span>
              </div>
            </div>
          </div>

          {/* Quick Action: Generate Custom Tour Plan */}
          <button
            onClick={() => setActivePage('builder')}
            className="w-full py-2 px-3 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Build Custom Quotation</span>
          </button>

          <div>
            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block mb-1.5">
              Recommended Packages
            </span>
            <div className="space-y-2">
              {packages.slice(0, 2).map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-2.5 rounded-xl border border-[#EAE6DE] bg-white hover:border-[#C99532] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={pkg.images[0]}
                      alt={pkg.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#292929] truncate">{pkg.name}</div>
                      <div className="text-[11px] text-[#A87922] font-mono">₹{pkg.pricePerPerson.toLocaleString('en-IN')}/pax</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendBrochure(pkg.id)}
                    className="w-full mt-1 py-1 rounded-lg bg-[#FAF4E8] hover:bg-[#F4E7C8] text-[#A87922] text-[11px] font-semibold transition flex items-center justify-center gap-1 border border-[#F4E7C8]"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share on WhatsApp</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block mb-1">
              Internal Consultant Notes
            </span>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
              placeholder="Record dietary requests (Jain food), hotel preferences, flight times..."
              className="w-full p-2.5 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-xs text-[#292929] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
            />
            <button
              onClick={() => addToast('Notes Saved', 'Consultant notes saved.', 'info')}
              className="mt-2 py-1.5 px-3 rounded-xl bg-white border border-[#EAE6DE] hover:bg-[#FAF9F6] text-[#292929] text-xs font-semibold self-end"
            >
              Save Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
