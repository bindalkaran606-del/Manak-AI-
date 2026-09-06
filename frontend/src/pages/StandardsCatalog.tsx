import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ChevronRight, 
  ShieldCheck, 
  BookOpen
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import { ModelTransparencyModal } from "@/components/ModelTransparencyModal";
import { useQuery } from "@tanstack/react-query";
import { manakApi } from "@/services/manakApi";

export default function StandardsCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [qcoOnly, setQcoOnly] = useState(false);
  const [transparencyOpen, setTransparencyOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["standards", searchTerm, selectedCategory, qcoOnly],
    queryFn: () =>
      manakApi.getStandards({
        search: searchTerm || undefined,
        category: selectedCategory === "All" ? undefined : selectedCategory,
        qco_only: qcoOnly || undefined,
        limit: 50,
      }),
  });

  const categories = [
    "All",
    "Electrotechnical",
    "Civil Engineering",
    "Safety & Fire",
    "Water & Utilities",
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header onOpenTransparency={() => setTransparencyOpen(true)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Title */}
        <div className="space-y-2 border-b border-[#E5DFD5] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B132B]">
              Indian Standards Knowledge Base
            </h1>
            <span className="text-xs font-mono text-slate-500">
              {data?.total_count || 0} Standards Curated for Procurement
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Curated repository of official Bureau of Indian Standards (BIS) specifications, mandatory Quality Control Orders (QCO), clause requirements, and test methods.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search standard code, title, or keywords (e.g. 'IS 10322', 'LED', 'TMT steel', 'helmet', 'HDPE pipe')..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E5DFD5] bg-[#FAF8F5] focus:ring-1 focus:ring-[#B81D24] focus:outline-none text-slate-800"
                data-testid="standards-catalog-search-input"
              />
            </div>

            {/* QCO Mandatory Toggle */}
            <button
              type="button"
              onClick={() => setQcoOnly(!qcoOnly)}
              className={`text-xs px-3.5 py-2 rounded-xl font-mono flex items-center gap-1.5 transition-colors border ${
                qcoOnly
                  ? "bg-[#0B132B] text-white border-slate-800"
                  : "bg-[#FAF8F5] text-slate-700 border-[#E5DFD5] hover:bg-[#F3EFEA]"
              }`}
              data-testid="filter-qco-toggle"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>QCO Mandatory Only</span>
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E5DFD5]">
            <span className="text-[11px] font-mono text-slate-500 mr-1">Divisions:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#B81D24] text-white"
                    : "bg-[#FAF8F5] text-slate-600 hover:bg-[#F3EFEA] border border-[#E5DFD5]"
                }`}
                data-testid={`category-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Standards List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-500 font-mono">
              Searching Indian Standards database...
            </div>
          ) : data && data.standards.length > 0 ? (
            data.standards.map((std, i) => (
              <div
                key={i}
                onClick={() => navigate(`/standards/${encodeURIComponent(std.code)}`)}
                className="p-5 bg-white hover:bg-[#FAF8F5] border border-[#E5DFD5] hover:border-slate-400 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-xs"
                data-testid={`catalog-standard-row-${i}`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-bold text-sm sm:text-base text-[#B81D24] group-hover:underline">
                      {std.code}
                    </span>
                    <StatusBadge
                      status={std.status}
                      reaffirmationYear={std.reaffirmation_year}
                      qcoMandatory={std.qco_mandatory}
                    />
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF8F5] text-slate-600 rounded border border-[#E5DFD5]">
                      {std.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#0B132B] group-hover:text-[#B81D24] transition-colors leading-snug">
                    {std.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {std.scope}
                  </p>

                  <div className="pt-1 flex items-center gap-4 text-[11px] font-mono text-slate-500">
                    <span>Committee: {std.technical_committee}</span>
                    <span>·</span>
                    <span>ICS: {std.ics_code}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-[#0B132B] flex items-center gap-1 font-mono">
                    <span>View Clauses</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E5DFD5] space-y-3">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-semibold text-[#0B132B]">No matching Indian Standards found</h4>
              <p className="text-xs text-slate-500">
                Try searching for a different keyword or category.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ModelTransparencyModal
        open={transparencyOpen}
        onOpenChange={setTransparencyOpen}
      />
    </div>
  );
}
