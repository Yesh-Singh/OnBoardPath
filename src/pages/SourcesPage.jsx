import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import SourceCard from '../components/SourceCard';
import SafetyPills from '../components/SafetyPill';
import { BookOpen, ShieldCheck, Search, Filter, Download } from 'lucide-react';

export default function SourcesPage() {
  const { sources, adminFiles } = useOnboarding();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(sources.map(s => s.category)))];

  const filteredSources = sources.filter(source => {
    const matchesCategory = selectedCategory === 'All' || source.category === selectedCategory;
    const matchesSearch = source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          source.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Approved Sources
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            The information behind OnboardPath’s answers. Every response is verified against approved corporate documentation.
          </p>
        </div>

        <SafetyPills compact={true} />
      </div>

      {/* Filter & Search Bar */}
      <div className="enterprise-card p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search approved source guides..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                ${selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-2xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sources Grid */}
      {adminFiles.length > 0 && (
        <section className="enterprise-card p-5 bg-white">
          <h2 className="text-base font-bold text-slate-900">Files shared by your buddy</h2>
          <div className="mt-3 space-y-2">
            {adminFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <span className="font-medium text-slate-700">{file.name}</span>
                {file.file && <a href={URL.createObjectURL(file.file)} download={file.name} className="text-blue-600 font-semibold flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Download</a>}
              </div>
            ))}
          </div>
        </section>
      )}

      {filteredSources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      ) : (
        <div className="enterprise-card p-12 text-center bg-white">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-900">No approved source found</h4>
          <p className="text-xs text-slate-500 mt-1">Try a different search query or filter category.</p>
        </div>
      )}
    </div>
  );
}
