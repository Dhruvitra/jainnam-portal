import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, X } from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const { knowledgeBase, addKnowledgeItem } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<'Visa' | 'Destinations' | 'Cancellation' | 'Payment' | 'General'>('General');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;
    addKnowledgeItem({
      category,
      question,
      answer,
      keywords: ['jainam', category.toLowerCase()],
      confidenceScore: 0.99
    });
    setQuestion('');
    setAnswer('');
    setIsAddOpen(false);
  };

  const filteredItems = knowledgeBase.filter(k =>
    k.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
            FAQs & Agency Policies
          </h1>
          <p className="text-xs sm:text-sm text-[#707070] mt-1">
            Official agency answers for visa procedures, pure vegetarian/Jain food arrangements, payment terms, and cancellation policies.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ / Policy</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search question or policy..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EAE6DE] bg-white text-xs text-[#292929] focus:ring-1 focus:ring-[#C99532]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]">
                {item.category}
              </span>
            </div>
            <h3 className="text-xs font-bold text-[#292929]">{item.question}</h3>
            <p className="text-xs text-[#525252] leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-modal p-6 space-y-4 border border-[#EAE6DE]">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#292929]">Add Agency Policy / FAQ</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#8A8A8A]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs"
                >
                  <option value="General">General Inquiries</option>
                  <option value="Visa">Visa Assistance</option>
                  <option value="Payment">Payment Terms</option>
                  <option value="Destinations">Destinations & Weather</option>
                  <option value="Cancellation">Cancellation Policy</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Customer Question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Do you arrange Jain food in Europe?"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Official Response</label>
                <textarea
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Official answer given by travel consultants..."
                  required
                  className="w-full p-2.5 rounded-xl border border-[#EAE6DE] text-xs"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-[#EAE6DE] rounded-xl text-xs text-[#525252]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C99532] hover:bg-[#A87922] text-white font-bold rounded-xl text-xs"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
