import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TourPackage } from '../../types';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Copy,
  Trash2,
  MapPin,
  Star,
  Grid,
  List,
  Briefcase
} from 'lucide-react';
import { AddPackageModal } from '../modals/AddPackageModal';
import { PackagePreviewDrawer } from '../modals/PackagePreviewDrawer';

export const TourPackagesPage: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage, duplicatePackage } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | '5' | '4' | 'active'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [previewPackage, setPreviewPackage] = useState<TourPackage | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleOpenPreview = (pkg: TourPackage) => {
    setPreviewPackage(pkg);
    setIsPreviewOpen(true);
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.country.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter === '5') return pkg.hotelCategory === 5;
    if (categoryFilter === '4') return pkg.hotelCategory === 4;
    if (categoryFilter === 'active') return pkg.isActive;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
            Tour Packages Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#707070] mt-1">
            Curate holiday itineraries, hotel classifications, tiered pricing, and client brochures.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tour Package</span>
        </button>
      </div>

      {/* Filter and View Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EAE6DE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by destination, country, package name..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-xs text-[#292929] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
          />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-1 text-xs">
            {[
              { id: 'all', label: 'All Packages' },
              { id: '5', label: '5-Star Luxury' },
              { id: '4', label: '4-Star Premium' },
              { id: 'active', label: 'Active Only' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id as any)}
                className={`px-2.5 py-1.5 rounded-xl font-medium transition-colors ${
                  categoryFilter === tab.id
                    ? 'bg-[#FAF4E8] text-[#A87922] font-bold border border-[#F4E7C8]'
                    : 'text-[#707070] hover:bg-[#FAF9F6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[#EAE6DE] mx-1 hidden sm:block" />

          <div className="flex items-center border border-[#EAE6DE] rounded-xl p-0.5 bg-[#FAF9F6]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-2xs text-[#C99532]' : 'text-[#8A8A8A]'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-2xs text-[#C99532]' : 'text-[#8A8A8A]'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' ? (
        filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs hover:border-[#C99532] hover:shadow-card transition-all flex flex-col overflow-hidden group"
            >
              {/* Photo Banner */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={pkg.images[0]}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-2xs ${
                      pkg.isActive ? 'bg-[#292929] text-white' : 'bg-slate-500 text-white'
                    }`}
                  >
                    {pkg.isActive ? 'ACTIVE' : 'DRAFT'}
                  </span>
                  {pkg.featured && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#C99532] text-white shadow-2xs">
                      FEATURED
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs bg-[#292929]/80 backdrop-blur-md px-2.5 py-1 rounded-xl">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#F4E7C8]" />
                    {pkg.destination}
                  </span>
                  <span className="font-mono">{pkg.duration}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1 text-[#C99532] mb-1">
                    {Array.from({ length: pkg.hotelCategory }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#C99532]" />
                    ))}
                    <span className="text-[11px] font-bold text-[#707070] ml-1">
                      {pkg.hotelCategory}-Star
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#292929] line-clamp-1 group-hover:text-[#A87922] transition-colors">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-[#707070] mt-1 line-clamp-2 leading-relaxed">
                    {pkg.hotelDetails}
                  </p>
                </div>

                {/* Highlights Pills */}
                {pkg.highlights && pkg.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {pkg.highlights.slice(0, 3).map((h, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#EAE6DE] text-[#525252]">
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Pricing & Season */}
                <div className="pt-2 border-t border-[#EAE6DE] flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-[#8A8A8A] block">Starting from</span>
                    <span className="text-lg font-extrabold text-[#292929] font-mono">
                      ₹{pkg.pricePerPerson.toLocaleString()}
                      <span className="text-xs text-[#707070] font-normal"> / person</span>
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-[#707070]">
                    <div>Child: <strong>₹{pkg.childPrice.toLocaleString()}</strong></div>
                    <div>Season: <strong>{pkg.bestSeason.split('&')[0]}</strong></div>
                  </div>
                </div>

                {/* Buttons: Add, Edit, Preview, Duplicate, Delete */}
                <div className="pt-2 border-t border-[#EAE6DE] grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => handleOpenPreview(pkg)}
                    className="p-1.5 rounded-lg border border-[#EAE6DE] text-[#525252] hover:bg-[#FAF9F6] flex items-center justify-center text-xs font-semibold gap-1"
                    title="Preview Package"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C99532]" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="p-1.5 rounded-lg border border-[#EAE6DE] text-[#525252] hover:bg-[#FAF9F6] flex items-center justify-center text-xs font-semibold gap-1"
                    title="Edit Package"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => duplicatePackage(pkg.id)}
                    className="p-1.5 rounded-lg border border-[#EAE6DE] text-[#525252] hover:bg-[#FAF9F6] flex items-center justify-center text-xs font-semibold gap-1"
                    title="Duplicate Package"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deletePackage(pkg.id)}
                    className="p-1.5 rounded-lg border border-[#EAE6DE] text-red-600 hover:bg-red-50 flex items-center justify-center text-xs font-semibold gap-1"
                    title="Delete Package"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#EAE6DE] p-12 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#292929]">No Tour Packages Found</h3>
            <p className="text-xs text-[#707070] max-w-sm mx-auto mt-1 mb-4">
              {searchQuery || categoryFilter !== 'all'
                ? 'No packages match your search or filter criteria.'
                : 'Your tour catalog is currently empty. Create your first curated travel package.'}
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Tour Package</span>
            </button>
          </div>
        )
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE6DE] bg-[#FAF9F6] text-[#8A8A8A] uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-3">Destination</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Hotel Class</th>
                <th className="py-3 px-3">Adult Rate</th>
                <th className="py-3 px-3">Child Rate</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DE] font-medium text-[#333333]">
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={pkg.images[0]}
                          alt={pkg.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-[#292929] line-clamp-1">{pkg.name}</div>
                          <div className="text-[11px] text-[#707070]">{pkg.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">{pkg.destination}</td>
                    <td className="py-3 px-3 whitespace-nowrap">{pkg.duration}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#C99532]">{pkg.hotelCategory} ★</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#292929]">₹{pkg.pricePerPerson.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono text-[#707070]">₹{pkg.childPrice.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pkg.isActive ? 'bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {pkg.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleOpenPreview(pkg)} className="p-1 text-[#8A8A8A] hover:text-[#292929]">
                          <Eye className="w-4 h-4 text-[#C99532]" />
                        </button>
                        <button onClick={() => handleOpenEdit(pkg)} className="p-1 text-[#8A8A8A] hover:text-[#292929]">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => duplicatePackage(pkg.id)} className="p-1 text-[#8A8A8A] hover:text-[#292929]">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => deletePackage(pkg.id)} className="p-1 text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#707070]">
                    No packages match your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddPackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(pkg) => {
          if (editingPackage) {
            updatePackage(editingPackage.id, pkg);
          } else {
            addPackage(pkg);
          }
        }}
        initialPackage={editingPackage}
      />

      {/* Preview Drawer */}
      <PackagePreviewDrawer
        pkg={previewPackage}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
