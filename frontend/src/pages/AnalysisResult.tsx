import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import { RelevanceGauge } from "@/components/RelevanceGauge";
import { ExportBriefModal } from "@/components/ExportBriefModal";
import { ModelTransparencyModal } from "@/components/ModelTransparencyModal";
import { useQuery } from "@tanstack/react-query";
import { manakApi } from "@/services/manakApi";
import { toast } from "sonner";
import type { RecommendedStandard, IndianStandard } from "@/types/standards";

export default function AnalysisResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [expandedEvidence, setExpandedEvidence] = useState<{ [key: string]: boolean }>({});
  const [selectedStandardForModal, setSelectedStandardForModal] = useState<RecommendedStandard | null>(null);
  const [standardDetailData, setStandardDetailData] = useState<IndianStandard | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [transparencyOpen, setTransparencyOpen] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => manakApi.getAnalysisById(id || ""),
    enabled: !!id,
  });

  const toggleEvidence = (code: string) => {
    setExpandedEvidence((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const handleOpenStandardDetail = async (rec: RecommendedStandard) => {
    setSelectedStandardForModal(rec);
    try {
      const data = await manakApi.getStandardByCode(rec.standard_code);
      setStandardDetailData(data);
    } catch {
      setStandardDetailData(null);
    }
  };

  const handleCopyAmendment = () => {
    if (analysis?.gap_analysis?.recommended_spec_amendment) {
      navigator.clipboard.writeText(analysis.gap_analysis.recommended_spec_amendment);
      setCopiedSpec(true);
      toast.success("Tender specification clause copied to clipboard");
      setTimeout(() => setCopiedSpec(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
        <Header />
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-20 text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#B81D24] text-white flex items-center justify-center font-bold text-lg mx-auto animate-pulse">
            म
          </div>
          <h2 className="text-lg font-bold text-[#0B132B]">Retrieving MANAK Intelligence Report...</h2>
          <p className="text-xs text-slate-500 font-mono">Loading applicable standards and gap analysis</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
        <Header />
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-20 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-xl font-bold text-[#0B132B]">We couldn't load this analysis</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The requested procurement analysis may have expired or does not exist.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-[#0B132B] text-white text-xs mt-2"
          >
            Back to Dashboard
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header onOpenTransparency={() => setTransparencyOpen(true)} />

      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-[#E5DFD5] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-mono">
            <button onClick={() => navigate("/dashboard")} className="hover:text-[#0B132B]">
              Dashboard
            </button>
            <span>/</span>
            <button onClick={() => navigate("/history")} className="hover:text-[#0B132B]">
              History
            </button>
            <span>/</span>
            <span className="text-[#0B132B] font-semibold truncate max-w-xs sm:max-w-md">
              {analysis.title}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/new", { state: { initialText: analysis.raw_text, initialTitle: analysis.title } })}
              className="text-xs border-[#E5DFD5] text-slate-700 hover:bg-[#F3EFEA] flex items-center gap-1.5"
              data-testid="edit-requirement-button"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Requirement</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setExportModalOpen(true)}
              className="bg-[#0B132B] hover:bg-slate-800 text-white text-xs flex items-center gap-1.5 shadow-xs"
              data-testid="export-tender-appendix-button"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Tender Appendix</span>
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* SECTION 1: REQUIREMENT ANALYSIS VIEW (Section 12 of prompt) */}
        <section className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs p-6 sm:p-8 space-y-6 guilloche-watermark">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5DFD5] pb-4 gap-2">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#B81D24]">
                Structured Intelligence Breakdown
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B132B]" data-testid="requirement-analysis-title">
                Requirement Analysis
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 bg-[#FAF8F5] text-slate-700 rounded-md border border-[#E5DFD5]">
                Sector: {analysis.sector}
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 font-semibold">
                Parsed by MANAK Engine
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold block">
                Product Identified
              </span>
              <p className="text-sm font-bold text-[#0B132B] leading-snug" data-testid="extracted-product-name">
                {analysis.extracted_intelligence?.product_identified || analysis.title}
              </p>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold block">
                Primary Purpose
              </span>
              <p className="text-xs text-slate-700 leading-relaxed" data-testid="extracted-purpose">
                {analysis.extracted_intelligence?.purpose}
              </p>
            </div>

            {/* Target Operating Environment */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold block">
                Operating Environment
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {analysis.extracted_intelligence?.target_operating_environment}
              </p>
            </div>
          </div>

          {/* Keywords Row */}
          <div className="space-y-2 pt-2 border-t border-[#E5DFD5]">
            <span className="text-xs font-mono uppercase text-slate-500 font-bold block">
              Extracted Technical Keywords
            </span>
            <div className="flex flex-wrap gap-1.5" data-testid="extracted-keywords-container">
              {analysis.extracted_intelligence?.keywords?.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-[#FAF8F5] text-[#0B132B] text-xs font-mono border border-[#E5DFD5]"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Key Parameters Table */}
          <div className="space-y-2 pt-2 border-t border-[#E5DFD5]">
            <span className="text-xs font-mono uppercase text-slate-500 font-bold block">
              Key Technical Parameters Matrix
            </span>
            <div className="border border-[#E5DFD5] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-slate-700 text-[11px] font-mono border-b border-[#E5DFD5]">
                  <tr>
                    <th className="p-3 font-semibold">Parameter</th>
                    <th className="p-3 font-semibold">Tender Specified Value</th>
                    <th className="p-3 font-semibold">Benchmark IS Norm</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD5]">
                  {analysis.extracted_intelligence?.technical_parameters?.map((param, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-[#0B132B]">{param.parameter}</td>
                      <td className="p-3 font-mono text-slate-700">{param.value}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">{param.benchmark_is_norm || "Standard Reference"}</td>
                      <td className="p-3">
                        {param.status === "specified" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-mono text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Specified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-mono text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            Recommended Add
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 2: RECOMMENDED STANDARDS (Section 13 of prompt) */}
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-[#0B132B]" data-testid="recommended-standards-title">
                Recommended Standards
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {analysis.recommendations?.length || 0} Standards Identified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Standards most relevant to your procurement requirement, ranked by semantic and technical parameter alignment.
            </p>
          </div>

          <div className="space-y-4">
            {analysis.recommendations?.map((rec, index) => {
              const isExpanded = !!expandedEvidence[rec.standard_code];

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs hover:border-slate-400 transition-all duration-200 overflow-hidden"
                  data-testid={`recommended-standard-card-${index}`}
                >
                  <div className="p-6 space-y-4">
                    {/* Header: Standard Code, Title, Status & Relevance */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-base sm:text-lg font-bold text-[#B81D24]" data-testid={`standard-code-${index}`}>
                            {rec.standard_code}
                          </span>
                          <StatusBadge
                            status={rec.status}
                            qcoMandatory={rec.qco_mandatory}
                          />
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-[#0B132B] leading-snug">
                          {rec.standard_title}
                        </h3>
                      </div>

                      <RelevanceGauge score={rec.relevance_score} />
                    </div>

                    {/* Why this is recommended */}
                    <div className="space-y-1 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5DFD5]">
                      <span className="text-[11px] font-mono font-bold uppercase text-[#0B132B] block">
                        Why this is recommended
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {rec.why_recommended}
                      </p>
                    </div>

                    {/* Expandable Clause Evidence Accordion */}
                    {rec.evidence_clauses && rec.evidence_clauses.length > 0 && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => toggleEvidence(rec.standard_code)}
                          className="text-xs font-mono font-semibold text-slate-600 hover:text-[#0B132B] flex items-center gap-1.5 transition-colors"
                          data-testid={`toggle-evidence-${index}`}
                        >
                          <span>Clause Evidence & Technical Proof ({rec.evidence_clauses.length} clauses matched)</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="pl-3 border-l-2 border-[#B81D24] space-y-2.5 pt-1 animate-in fade-in-50 duration-200">
                            {rec.evidence_clauses.map((clause, cIdx) => (
                              <div key={cIdx} className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] text-xs space-y-1">
                                <div className="flex items-center justify-between text-[11px] font-mono">
                                  <span className="font-bold text-[#0B132B]">{clause.clause_no}: {clause.clause_name}</span>
                                  <span className="text-slate-500">Requirement: {clause.matched_requirement}</span>
                                </div>
                                <p className="text-slate-600 text-[11px] leading-relaxed italic">
                                  "{clause.evidence_text}"
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Footer Actions */}
                    <div className="pt-2 border-t border-[#E5DFD5] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                        <span>Related: {rec.related_standards_summary?.join(", ") || "None"}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenStandardDetail(rec)}
                        className="text-xs border-[#E5DFD5] text-[#0B132B] hover:bg-[#F3EFEA] flex items-center gap-1.5"
                        data-testid={`view-standard-detail-${index}`}
                      >
                        <span>View Standard Details</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: GAP ANALYSIS & MANAK INSIGHT (Section 15 of prompt) */}
        <section className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs p-6 sm:p-8 space-y-8 guilloche-watermark">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-[#E5DFD5] pb-4 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E67E22]">
                Specification Gap Audit & Risk Mitigation
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B132B]" data-testid="manak-insight-heading">
                MANAK Insight
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Things to consider before finalizing the specification.
              </p>
            </div>

            {/* Compliance Score Gauge */}
            <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5]">
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Readiness Score</span>
                <span className="text-xs font-semibold text-slate-700">{analysis.gap_analysis?.compliance_rating}</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center font-mono font-bold text-base text-emerald-800">
                {analysis.gap_analysis?.readiness_score || 88}
              </div>
            </div>
          </div>

          {/* Missing Parameters Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B132B]">
              1. Identified Missing Technical Parameters
            </h3>
            <div className="space-y-3">
              {analysis.gap_analysis?.missing_parameters?.map((m, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5] space-y-2 text-xs"
                  data-testid={`missing-parameter-card-${i}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        {m.severity.toUpperCase()} PRIORITY
                      </span>
                      <span className="font-bold text-[#0B132B] text-sm">{m.parameter}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{m.recommended_clause}</span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    <strong>Impact:</strong> {m.impact}
                  </p>

                  <div className="p-2.5 bg-white rounded-lg border border-[#E5DFD5] font-mono text-[11px] text-slate-700">
                    <span className="font-bold text-[#B81D24] block mb-0.5">Suggested Specification Clause:</span>
                    "{m.suggested_text}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ambiguity Flags */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B132B]">
              2. Ambiguous & Legally Vulnerable Phrasing
            </h3>
            <div className="space-y-2.5">
              {analysis.gap_analysis?.ambiguity_flags?.map((a, i) => (
                <div key={i} className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Flagged Term: "{a.term}"</span>
                  </div>
                  <p className="text-slate-700 text-[11px] pl-5">
                    <strong>Audit Risk:</strong> {a.issue}
                  </p>
                  <p className="text-emerald-900 text-[11px] font-mono pl-5 bg-emerald-50/50 p-2 rounded border border-emerald-200">
                    <strong>Recommended Fix:</strong> {a.fix_suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* QCO Regulatory Alerts */}
          {analysis.gap_analysis?.qco_compliance_alerts?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B132B]">
                3. Mandatory Quality Control Orders (QCO)
              </h3>
              <div className="space-y-2">
                {analysis.gap_analysis.qco_compliance_alerts.map((q, i) => (
                  <div key={i} className="p-4 bg-[#0B132B] text-slate-200 rounded-xl space-y-1.5 text-xs border border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-white text-sm">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>{q.order_name}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{q.requirement}</p>
                    <p className="text-amber-300 text-[10px] font-mono pt-1 border-t border-slate-700">{q.legal_mandate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ready-to-Copy Tender Specification Amendment */}
          <div className="space-y-3 pt-2 border-t border-[#E5DFD5]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B132B]">
                4. Recommended NIT Tender Specification Clauses
              </h3>
              <Button
                size="xs"
                variant="outline"
                onClick={handleCopyAmendment}
                className="text-[11px] font-mono border-[#E5DFD5] flex items-center gap-1 bg-white"
                data-testid="copy-amendment-button"
              >
                {copiedSpec ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSpec ? "Copied" : "Copy Clause"}</span>
              </Button>
            </div>

            <pre className="p-4 bg-[#FAF8F5] text-slate-800 text-xs font-mono rounded-xl border border-[#E5DFD5] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {analysis.gap_analysis?.recommended_spec_amendment}
            </pre>
          </div>
        </section>
      </main>

      {/* STANDARD DETAIL MODAL */}
      {selectedStandardForModal && (
        <div className="fixed inset-0 z-50 bg-[#0B132B]/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-2xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-6 guilloche-watermark">
            <div className="border-b border-[#E5DFD5] pb-4 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg text-[#B81D24]">
                    {selectedStandardForModal.standard_code}
                  </span>
                  <StatusBadge
                    status={selectedStandardForModal.status}
                    qcoMandatory={selectedStandardForModal.qco_mandatory}
                  />
                </div>
                <h3 className="text-base font-bold text-[#0B132B]">
                  {selectedStandardForModal.standard_title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedStandardForModal(null);
                  setStandardDetailData(null);
                }}
                className="text-slate-500 hover:text-[#0B132B]"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              {/* Why this standard matters */}
              <div className="space-y-1 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5DFD5]">
                <h4 className="font-mono font-bold uppercase text-[#0B132B] text-xs">
                  Why this standard matters
                </h4>
                <p className="text-slate-700">
                  {selectedStandardForModal.why_recommended}
                </p>
              </div>

              {/* Scope */}
              <div className="space-y-1">
                <h4 className="font-mono font-bold uppercase text-[#0B132B] text-xs">
                  Scope of Standard
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {standardDetailData?.scope || "Specifies mandatory technical criteria, safety requirements, and test methods established by the Bureau of Indian Standards (BIS)."}
                </p>
              </div>

              {/* Key Clauses & Evidence */}
              <div className="space-y-2">
                <h4 className="font-mono font-bold uppercase text-[#0B132B] text-xs">
                  Evidence & Clause Benchmarks
                </h4>
                <div className="space-y-2">
                  {selectedStandardForModal.evidence_clauses?.map((c, i) => (
                    <div key={i} className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] space-y-1">
                      <div className="font-mono font-bold text-[#0B132B]">
                        {c.clause_no}: {c.clause_name}
                      </div>
                      <p className="text-slate-600 italic">"{c.evidence_text}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amendments & Version Status (Shown directly here per prompt) */}
              <div className="space-y-2">
                <h4 className="font-mono font-bold uppercase text-[#0B132B] text-xs">
                  Standard Status & Amendments
                </h4>
                <div className="p-3 bg-white rounded-lg border border-[#E5DFD5] space-y-1 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span>Gazetted Status: <strong>{selectedStandardForModal.status.toUpperCase()}</strong></span>
                    <span>QCO Mandatory: <strong>{selectedStandardForModal.qco_mandatory ? "YES" : "NO"}</strong></span>
                  </div>
                  {standardDetailData?.amendments && standardDetailData.amendments.length > 0 ? (
                    standardDetailData.amendments.map((a, i) => (
                      <div key={i} className="text-slate-600 pt-1 border-t border-slate-100">
                        • {a.amendment_no} ({a.date}): {a.summary}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 pt-1">
                      No pending amendment revisions. Standard is current in gazette registry.
                    </div>
                  )}
                </div>
              </div>

              {/* Related Standards */}
              <div className="space-y-1">
                <h4 className="font-mono font-bold uppercase text-[#0B132B] text-xs">
                  Related & Complementary Standards
                </h4>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {selectedStandardForModal.related_standards_summary?.map((r, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#F3EFEA] text-slate-800 border border-[#E5DFD5]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5DFD5] flex items-center justify-between">
              <a
                href="https://www.bis.gov.in/?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#B81D24] hover:underline flex items-center gap-1 font-mono"
              >
                Official BIS Portal (bis.gov.in)
                <ExternalLink className="w-3 h-3" />
              </a>

              <Button
                size="sm"
                onClick={() => {
                  setSelectedStandardForModal(null);
                  setStandardDetailData(null);
                }}
                className="bg-[#0B132B] text-white text-xs"
              >
                Close View
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tender Specification Appendix Export Modal */}
      <ExportBriefModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        analysis={analysis}
      />

      {/* Model Transparency Modal */}
      <ModelTransparencyModal
        open={transparencyOpen}
        onOpenChange={setTransparencyOpen}
      />

      <Footer />
    </div>
  );
}
