import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, ShieldCheck, BookOpen, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import { ModelTransparencyModal } from "@/components/ModelTransparencyModal";
import { useQuery } from "@tanstack/react-query";
import { manakApi } from "@/services/manakApi";

const STATUS_FILTERS = [
  { value: "All", label: "All statuses" },
  { value: "current", label: "Current" },
  { value: "under_revision", label: "Under revision" },
  { value: "withdrawn", label: "Withdrawn" },
];

export default function StandardsCatalog() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [qcoOnly, setQcoOnly] = useState(false);
  const [transparencyOpen, setTransparencyOpen] = useState(false);

  // Debounce keystrokes so the catalogue feels instant without a request per character
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 220);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["standards", debouncedSearch, selectedCategory, selectedStatus, qcoOnly],
    queryFn: () =>
      manakApi.getStandards({
        search: debouncedSearch || undefined,
        category: selectedCategory === "All" ? undefined : selectedCategory,
        status: selectedStatus === "All" ? undefined : selectedStatus,
        qco_only: qcoOnly || undefined,
        limit: 100,
      }),
    placeholderData: (prev) => prev,
  });

  const categories = useMemo(
    () => ["All", ...(data?.categories ?? [])],
    [data?.categories]
  );

  const filtersActive =
    !!debouncedSearch || selectedCategory !== "All" || selectedStatus !== "All" || qcoOnly;

  const clearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setQcoOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header onOpenTransparency={() => setTransparencyOpen(true)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Title */}
        <div className="space-y-2 border-b border-[#E5DFD5] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B132B]">
              Indian Standards Knowledge Base
            </h1>
            <span className="text-xs font-mono text-slate-500" data-testid="catalog-total-count">
              {data?.total_count ?? 0} standards indexed across {Math.max((data?.categories?.length ?? 0), 0)} divisions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Curated repository of Bureau of Indian Standards (BIS) specifications, mandatory Quality Control Orders
            (QCO), clause requirements and test methods. Search by IS number, title, ICS code, sectional committee or
            keyword.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-[#E5DFD5] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="IS number, title, ICS code or committee — e.g. 'IS 10322', '29.140.40', 'ETD 20', 'HDPE'"
                className="w-full pl-10 pr-9 py-2 text-xs border border-[#E5DFD5] bg-[#FAF8F5] focus:ring-1 focus:ring-[#B81D24] focus:outline-none text-slate-800"
                data-testid="standards-catalog-search-input"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-[#B81D24] transition-colors"
                  aria-label="Clear search"
                  data-testid="standards-catalog-clear-search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs px-3 py-2 border border-[#E5DFD5] bg-[#FAF8F5] text-slate-700 font-mono focus:outline-none focus:ring-1 focus:ring-[#B81D24]"
              data-testid="filter-status-select"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* QCO Mandatory Toggle */}
            <button
              type="button"
              onClick={() => setQcoOnly(!qcoOnly)}
              className={`text-xs px-3.5 py-2 font-mono flex items-center justify-center gap-1.5 transition-colors border ${
                qcoOnly
                  ? "bg-[#0B132B] text-white border-[#0B132B]"
                  : "bg-[#FAF8F5] text-slate-700 border-[#E5DFD5] hover:bg-[#F3EFEA]"
              }`}
              data-testid="filter-qco-toggle"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${qcoOnly ? "text-amber-300" : "text-slate-500"}`} />
              <span>QCO mandatory only</span>
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E5DFD5]">
            <span className="text-[11px] font-mono text-slate-500 mr-1">Divisions:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 font-medium border transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#B81D24] text-white border-[#B81D24]"
                    : "bg-[#FAF8F5] text-slate-600 hover:bg-[#F3EFEA] border-[#E5DFD5]"
                }`}
                data-testid={`category-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}

            {filtersActive && (
              <button
                onClick={clearFilters}
                className="ml-auto text-[11px] font-mono text-[#B81D24] hover:underline"
                data-testid="clear-all-filters-button"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Result summary */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span data-testid="catalog-result-summary">
            {isLoading
              ? "Searching…"
              : `${data?.standards.length ?? 0} standard${(data?.standards.length ?? 0) === 1 ? "" : "s"} shown${
                  debouncedSearch ? ` for “${debouncedSearch}”` : ""
                }`}
          </span>
          {isFetching && !isLoading && <span className="text-slate-400">updating…</span>}
        </div>

        {/* Standards List */}
        <div className="divide-y divide-[#E5DFD5] border-y border-[#E5DFD5] bg-white">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-500 font-mono">
              Searching Indian Standards…
            </div>
          ) : data && data.standards.length > 0 ? (
            data.standards.map((std, i) => (
              <div
                key={std.code}
                onClick={() => navigate(`/standards/${encodeURIComponent(std.code)}`)}
                className="p-5 hover:bg-[#FAF8F5] transition-colors duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
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
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF8F5] text-slate-600 border border-[#E5DFD5]">
                      {std.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#0B132B] group-hover:text-[#B81D24] transition-colors leading-snug">
                    {std.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{std.scope}</p>

                  <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-500">
                    <span>Committee: {std.technical_committee}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>ICS: {std.ics_code}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>{std.key_clauses.length} clauses indexed</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-[#0B132B] flex items-center gap-1 font-mono">
                    <span>View clauses</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-semibold text-[#0B132B]">No matching Indian Standards</h4>
              <p className="text-xs text-slate-500">
                This prototype indexes a curated subset of Indian Standards. Try a different IS number, ICS code or
                keyword.
              </p>
              {filtersActive && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#B81D24] hover:underline font-mono"
                  data-testid="empty-state-reset-button"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ModelTransparencyModal open={transparencyOpen} onOpenChange={setTransparencyOpen} />
    </div>
  );
}
